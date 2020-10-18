package firebase

import (
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/tidwall/gjson"
)

//jsonString represents a string containing valid JSON
type jsonString = string

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

type Document struct {
	Id   string                 //Id the document path in Firestore
	Data map[string]interface{} //Data field value pairs in the particular document
}

type DocumentCollection struct {
	Id        string     //Id the document path in Firestore
	Documents []Document //Data field value pairs of all the documents in the collection.
}

//GetDocument Fetch a document from Firestore.
//
//Path format:
//
//if document is present at `/users/me/todos`, path should be `users/me/todos` without slash
//at beginning
func GetDocument(path string, idToken string) Document {
	client := http.Client{}
	request, _ := http.NewRequest("GET", projectFirestoreEndpoint+"/"+path, nil)
	request.Header.Add("Authorization", fmt.Sprintf("Bearer %s", idToken))
	res, err := client.Do(request)
	if err != nil {
	}
	resJSON, _ := ioutil.ReadAll(res.Body)
	finalDataToPass := Document{
		Id:   gjson.Get(string(resJSON), "name").Str,
		Data: shallowDocument(string(resJSON)),
	}
	return finalDataToPass
}

func GetCollection(path string, idToken string) DocumentCollection {
	client := http.Client{}
	request, _ := http.NewRequest("GET", projectFirestoreEndpoint+"/"+path, nil)
	request.Header.Add("Authorization", fmt.Sprintf("Bearer %s", idToken))
	res, err := client.Do(request)
	if err != nil {
	}
	resJSON, _ := ioutil.ReadAll(res.Body)
	finalDataToPass := DocumentCollection{
		Id:        gjson.Get(string(resJSON), "name").Str,
		Documents: shallowCollection(string(resJSON)),
	}
	return finalDataToPass
}

func shallowDocument(rawDocumentJSON jsonString) map[string]interface{} {
	finalMap := make(map[string]interface{})
	gjson.Get(rawDocumentJSON, "fields").ForEach(
		func(key gjson.Result, val gjson.Result) bool {
			finalMap[key.Str] = shallowField(val.Raw)
			return true
		},
	)
	return finalMap
}

func shallowCollection(rawCollectionJSON jsonString) []Document {
	finalArr := make([]Document, 0)
	gjson.Get(rawCollectionJSON, "documents").ForEach(
		func(key gjson.Result, val gjson.Result) bool {
			finalArr = append(finalArr, Document{
				Id:   val.Get("name").Str,
				Data: shallowDocument(val.Raw),
			})
			return true
		},
	)
	return finalArr
}

/*shallowArray shallow and return the values in an array of Firestore document response.

Example:
	myArr := shallowArray(`{values : [
		{"stringValue" : "foo"},
		{"integerValue" : 12},
		{"booleanValue": true}
	]}`) // myArr = []interface{}{"foo", 12, true}
*/
func shallowArray(jsonArray jsonString) []interface{} {
	finalArray := make([]interface{}, 0)
	gjson.Get(jsonArray, "values").
		ForEach(func(k gjson.Result, v gjson.Result) bool {
			finalArray = append(finalArray, shallowField(v.Raw))
			return true
		})
	return finalArray
}

/*shallowField shallows and returns the value of a Firestore document.

Example:
	foo := shallowField(`{"stringValue" : "bar"}`)
	//foo = "bar"
*/
func shallowField(value jsonString) interface{} {
	var shallow interface{}
	switch {
	case gjson.Get(value, "stringValue").Exists():
		shallow = gjson.Get(value, "stringValue")
		break
	case gjson.Get(value, "integerValue").Exists():
		shallow = gjson.Get(value, "integerValue")
		break
	case gjson.Get(value, "booleanValue").Exists():
		shallow = gjson.Get(value, "booleanValue")
		break
	case gjson.Get(value, "arrayValue").Exists():
		shallow = shallowArray(gjson.Get(value, "arrayValue").Raw)
		break
	default:
		return nil
	}
	return shallow
}
