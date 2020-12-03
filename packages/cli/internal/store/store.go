package store

import (
	"encoding/json"
	"errors"
	"io/ioutil"
	"os"
	"path"
	"time"

	"github.com/mitchellh/mapstructure"
	"lookahead.web.app/cli/internal/constants"
	"lookahead.web.app/cli/internal/credential"
	"lookahead.web.app/cli/internal/firebase"
	"lookahead.web.app/cli/internal/logging"
	"lookahead.web.app/cli/internal/rest"
	"lookahead.web.app/cli/internal/util"
)

func getStoreLocation() string {
	return path.Join(constants.CONFIG_PATH, "store.json")
}

//DataSchema The schema to follow while writing or reading data from
//the local store.
type DataSchema struct {
	Title      string `json:"title" mapstructure:"title"`
	Content    string `json:"content" mapstructure:"content"`
	Id         string `json:"id" mapstructure:"id"`
	LastEdited string `json:"last_edited" mapstructure:"last_edited"`
}

//rawDataSchema copy of DataSchema, but just the raw data
type rawDataSchema struct {
	Title   string `json:"title"`
	Content string `json:"content"`
}

type storeStruct struct {
	filePermissions os.FileMode
	storeLoc        string
}

type storeInterface interface {
	Append(id string, title string, content string) error
	GetAll() ([]DataSchema, error)
	Refresh()
	Update(id string, title string, content string) error
}

//Append Append a new todo/note in the local store
func (s storeStruct) Append(title string, content string) error {
	existingJSON, _ := s.GetAll()
	data := DataSchema{
		Id:         util.GenerateDocID(),
		Title:      title,
		Content:    content,
		LastEdited: util.MakeCurrDate(),
	}
	existingJSON = append(existingJSON, data)
	toWrite, err := json.Marshal(existingJSON)
	if err != nil {
		return errors.New("There was an error while adding values to the store. Please try again")
	}
	err = ioutil.WriteFile(s.storeLoc, []byte(toWrite), s.filePermissions)
	if err != nil {
		return errors.New("Couldn't write data to local data store. Please try again")
	}
	if util.IsOnline() {
		err = rest.RestClient.Set(data.Id, title, content, data.LastEdited)
		if err != nil {
			return err
		}
	} else {
		logging.Warn("Couldn't sync to the online store" +
			" because you seem to be offline.")
	}
	return nil
}

//GetAll Gets all values from the local store
func (s storeStruct) GetAll() ([]DataSchema, error) {
	if _, err := os.Stat(s.storeLoc); err == nil {
		content, _ := ioutil.ReadFile(s.storeLoc)
		storeJSON := []DataSchema{}
		json.Unmarshal(content, &storeJSON)
		return storeJSON, nil
	}
	return nil, errors.New("Couldn't access local data store. Please try again")
}

//Refresh Refresh the local store to the cloud database
func (s storeStruct) Refresh() {
	creds := credential.ReadCredentials()
	if time.Now().Unix()-creds.SignInTimestamp > 3600 {
		firebase.Auth.UpdateIdToken()
		creds = credential.ReadCredentials()
	} else {
		creds = credential.ReadCredentials()
	}
	if util.IsOnline() && credential.CheckIfUserLoggedIn() && time.Now().Unix()-creds.StoreSyncTimestamp > 300 {
		spinner := logging.DarkSpinner(" Syncing to database")
		spinner.Start()
		//The id token with the restClient might be the expired one, so take
		//no chances and update it
		*&rest.RestClient.IdToken = creds.IdToken
		//This will be done in the background so no error handling needed
		dbRawJSON, _ := rest.RestClient.GetAll()
		var dbJSON []DataSchema
		localJSON, _ := s.GetAll()
		//Convert map to DataSchema
		mapstructure.Decode(dbRawJSON, &dbJSON)
		//Reconcile everything
	outer:
		for _, item := range dbJSON {
			//Flag to confirm that this is a new item
			newItem := true
			for i, lItem := range localJSON {
				if item.Id == lItem.Id {
					newItem = false
					continue outer
				} else if item.Id == lItem.Id &&
					//Look for mutated items and update them
					(item.Title != lItem.Title || item.Content != lItem.Content) {
					newItem = false
					localJSON[i] = item
					continue outer
				}
			}
			//If confirmed that the current item is a new one,
			//append it
			if newItem {
				localJSON = append(localJSON, item)
			}
		}
		for i, lItem := range localJSON {
			//A flag to confirm that this a deleted item
			deletedItem := true
			for _, item := range dbJSON {
				if item.Id == lItem.Id {
					deletedItem = false
				}
			}
			//If the item is deleted
			if deletedItem {
				//Remove the item and push the remaining ones ahead
				//This seems to be computationally expensive, so
				//TODO(obnoxiousnerd): find alternatives to this
				localJSON = append(localJSON[:i], localJSON[i+1:]...)
			}
		}
		toWrite, _ := json.Marshal(localJSON)
		timeStamp := time.Now().Unix()
		ioutil.WriteFile(s.storeLoc, []byte(toWrite), s.filePermissions)
		creds.StoreSyncTimestamp = timeStamp
		credential.WriteCredentials(creds)
		spinner.Stop()
	}
}

//Update Update the contents of an existing todo/note
func (s storeStruct) Update(id string, title string, content string) error {
	existingJSON, _ := s.GetAll()
	data := DataSchema{
		Id:         id,
		Title:      title,
		Content:    content,
		LastEdited: util.MakeCurrDate(),
	}
	//Keep track of mutation
	mutated := false
	for i, item := range existingJSON {
		if item.Id == data.Id {
			existingJSON[i] = data
			mutated = true
		}
	}
	if !mutated {
		return errors.New("given id does not exist")
	} else {
		toWrite, err := json.Marshal(existingJSON)
		if err != nil {
			return errors.New("There was an error while adding values to the store. Please try again")
		}
		err = ioutil.WriteFile(s.storeLoc, []byte(toWrite), s.filePermissions)
		if err != nil {
			return errors.New("Couldn't write data to local data store. Please try again")
		}
		if util.IsOnline() {
			err = rest.RestClient.Set(id, title, content, data.LastEdited)
			if err != nil {
				return err
			}
		} else {
			logging.Warn("Couldn't sync to the online store" +
				" because you seem to be offline.")
		}
		return nil
	}
}

//Store The local data store instance
var Store storeStruct = storeStruct{filePermissions: 0666, storeLoc: getStoreLocation()}
