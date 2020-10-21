package firebase

//Client for Firebase Cloud Firestore
//
//Initialization:
//		firestoreClient = Firestore{IdToken: "<the-user-idtoken-or-oauth2-token>"}
type Firestore struct {
	IdToken string //The Firebase ID Token of the user
}
