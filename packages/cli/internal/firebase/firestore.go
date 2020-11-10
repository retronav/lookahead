package firebase

//Client for Firebase Cloud Firestore
//
//Initialization:
//		firestoreClient = Firestore{IdToken: "<the-user-idtoken-or-oauth2-token>"}
type Firestore struct {
	IdToken string //The Firebase ID Token of the user
}

type IFirestore interface {
	GetDocument(path string) Document
	GetCollection(path string) DocumentCollection
	WriteDocument(path string, data map[string]interface{}) error
}

var apiEndpoint = "https://firestore.googleapis.com/v1"
var projectFirestoreEndpoint = apiEndpoint +
	"/projects/lookahead-89164/databases/(default)/documents/"

func DocPathToURL(path string) string {
	return apiEndpoint + projectFirestoreEndpoint + "/" + path
}
