package firebase

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/tidwall/gjson"
)

var apiEndpoint = "https://firestore.googleapis.com/v1"
var projectFirestoreEndpoint = apiEndpoint +
	"/projects/lookahead-89164/databases/(default)/documents"

//responseDocument struct to define response structure
//of a document from the API.
//Example : https://play.golang.org/p/2vykRq7rpXO
type responseDocument struct {
	Name       string      `json:"name"`
	Fields     interface{} `json:"fields"`
	CreateTime string      `json:"createTime"`
	UpdateTime string      `json:"updateTime"`
}

//responseCollection struct to define response structure
//of a document collection from the API.
//Example : https://play.golang.org/p/h0sxqjzI2sr
type responseCollection struct {
	Documents []responseDocument `json:"documents"`
}

type IDocument interface {
	Data(raw string) map[string]interface{}
}

type Document struct {
	Id   string //Id the document path in Firestore
	Data interface{}
}

//GetDocument Fetch a document from Firestore.
//
//Path format:
//
//if document is present at `/users/me/todos`, path should be `users/me/todos` without slash
//at beginning
func GetDocument(path string, idToken string) {
	client := http.Client{}
	request, _ := http.NewRequest("GET", projectFirestoreEndpoint+"/"+path, nil)
	request.Header.Add("Authorization", fmt.Sprintf("Bearer %s", idToken))
	res, err := client.Do(request)
	if err != nil {
	}
	resJSON, _ := ioutil.ReadAll(res.Body)
	var resDocument responseDocument
	json.Unmarshal(resJSON, &resDocument)
	// finalDataToPass := Document{Id: resDocument.Name}
}

type jsonString = string

func shallowResponseData(data jsonString) interface{} {
	finalMap := make(map[string]interface{})
	initalValues := gjson.Get(data, "fields")
	initalValues.ForEach(func(k gjson.Result, v gjson.Result) bool {
		if shallowVal := k.Get("stringValue"); shallowVal.Exists() {
			finalMap[k.Str] = shallowVal.Str
		}
		if shallowVal := k.Get("integerValue"); shallowVal.Exists() {
			finalMap[k.Str] = shallowVal.Int()
		}
		if shallowVal := k.Get("arrayValue"); shallowVal.Exists() {
			finalMap[k.Str] = shallowVal.Get("values").Array()
		}
		return true
	})
	return finalMap
}
