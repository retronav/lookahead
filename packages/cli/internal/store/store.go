package store

import (
	"encoding/json"
	"errors"
	"io/ioutil"
	"os"
	"path/filepath"

	"lookahead.web.app/cli/internal/constants"
	"lookahead.web.app/cli/internal/rest"
	"lookahead.web.app/cli/internal/types"
	"lookahead.web.app/cli/internal/util"
)

func getStoreLocation() string {
	return filepath.Join(constants.CONFIG_PATH, "store.json")
}

type storeStruct struct {
	filePermissions os.FileMode
	storeLoc        string
}

type storeInterface interface {
	Append(id string, title string, content string) (bool, error)
	Delete(id string) (bool, error)
	Get(id string) (types.DataSchema, error)
	GetAll() ([]types.DataSchema, error)
	Sync()
	Update(id string, title string, content string) (bool, error)
	IdExists(id string) bool
}

//Append Append a new todo/note in the local store
func (s storeStruct) Append(title string, content string) (bool, error) {
	isOffline := false
	existingJSON, _ := s.GetAll()
	newId := util.GenerateDocID()
	if s.IdExists(newId) {
		newId = util.GenerateDocID()
	}
	data := types.DataSchema{
		Id:         newId,
		Title:      title,
		Content:    content,
		LastEdited: util.MakeCurrDate(),
	}
	if util.IsOnline() {
		err := rest.RestClient.Set(data.Id, title, content, data.LastEdited)
		if err != nil {
			return isOffline, err
		}
	} else {
		data.New = true
		isOffline = true
	}
	existingJSON = append(existingJSON, data)
	toWrite, err := json.Marshal(existingJSON)
	if err != nil {
		return isOffline, errors.New("There was an error while adding values to the store. Please try again")
	}
	err = ioutil.WriteFile(s.storeLoc, []byte(toWrite), s.filePermissions)
	if err != nil {
		return isOffline, errors.New("Couldn't write data to local data store. Please try again")
	}
	return isOffline, nil
}
func (s storeStruct) Delete(id string) (bool, error) {
	if s.IdExists(id) {
		err := rest.RestClient.Delete(id)
		if err != nil {
			return false, errors.New("There was an error while deleting from the database. Please try again later.")
		}
		s.Sync(true)
		return true, nil
	}
	return false, errors.New("ID Not found")
}
func (s storeStruct) Get(id string) (types.DataSchema, error) {
	if s.IdExists(id) {
		all, err := s.GetAll()
		if err != nil {
			return types.DataSchema{}, err
		}
		for _, todo := range all {
			if todo.Id == id {
				return todo, nil
			}
		}
	}
	return types.DataSchema{}, errors.New("ID not found")
}

//GetAll Gets all values from the local store
func (s storeStruct) GetAll() ([]types.DataSchema, error) {
	if _, err := os.Stat(s.storeLoc); err == nil {
		content, _ := ioutil.ReadFile(s.storeLoc)
		storeJSON := []types.DataSchema{}
		json.Unmarshal(content, &storeJSON)
		return storeJSON, nil
	}
	return nil, errors.New("Couldn't access local data store. Please try again")
}

func (s storeStruct) IdExists(id string) bool {
	data, _ := s.GetAll()
	found := false
	for _, item := range data {
		if item.Id == id {
			found = true
		}
	}
	return found
}

//Update Update the contents of an existing todo/note
func (s storeStruct) Update(id string, title string, content string) (bool, error) {
	isOffline := false
	existingJSON, _ := s.GetAll()
	data := types.DataSchema{
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
		return isOffline, errors.New("given id does not exist")
	} else {
		toWrite, err := json.Marshal(existingJSON)
		if err != nil {
			return isOffline, errors.New("There was an error while adding values to the store. Please try again")
		}
		err = ioutil.WriteFile(s.storeLoc, []byte(toWrite), s.filePermissions)
		if err != nil {
			return isOffline, errors.New("Couldn't write data to local data store. Please try again")
		}
		if util.IsOnline() {
			err = rest.RestClient.Set(id, title, content, data.LastEdited)
			if err != nil {
				return isOffline, err
			}
		} else {
			isOffline = true
		}
		return isOffline, nil
	}
}

//Store The local data store instance
var Store storeStruct = storeStruct{filePermissions: 0666, storeLoc: getStoreLocation()}
