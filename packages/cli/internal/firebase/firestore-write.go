package firebase

import (
	"errors"
	"time"
)

func (f Firestore) writeDocument(path string, data map[string]interface{}) {
	//TODO: implement fetching documents
}

//mapToFirestoreDoc Converts simple maps to Firestore documents' JSON structure(see their REST API)
//This basically does the reverse of shallowFirestoreDoc (see ./firestore-read.go)
//Example:
//	map1 := map[string]interface{"foo" : "bar", "time": time.Now()}
//	map2, err := mapToFirestoreDoc(map1)
//	if err == nil{
//		//All good :)
//		//map2 = {"foo" : {
//		//		"stringValue": "bar"
//		//		}, "time": {
//		//	"timestampValue": "01-01-2020T00:00:000Z"
//		//	}
//		//}
//	}
func mapToFirestoreDoc(data map[string]interface{}) (map[string]interface{}, error) {
	finalMap := map[string]interface{}{}
	for k, v := range data {
		switch v.(type) {
		case string:
			finalMap[k] = map[string]interface{}{"stringValue": v}
			break
		case int:
			finalMap[k] = map[string]interface{}{"integerValue": v}
			break
		case bool:
			finalMap[k] = map[string]interface{}{"booleanValue": v}
			break
		case time.Time:
			finalMap[k] = map[string]interface{}{"timestampValue": v.(time.Time).Format(time.RFC3339)}
			break
		default:
			return nil, errors.New("Variable of invalid type recieved.")
		}
	}
	return finalMap, nil
}
