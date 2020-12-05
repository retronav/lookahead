package store

import (
	"encoding/json"
	"errors"
	"io/ioutil"
	"os"
	"path"

	"lookahead.web.app/cli/internal/constants"
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
	New        bool   `json:"new,omitempty"`
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
	Sync()
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
	if util.IsOnline() {
		err := rest.RestClient.Set(data.Id, title, content, data.LastEdited)
		if err != nil {
			return err
		}
	} else {
		data.New = true
		logging.Warn("Couldn't sync to the online store" +
			" because you seem to be offline.")
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
