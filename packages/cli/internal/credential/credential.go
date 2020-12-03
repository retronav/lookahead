package credential

import (
	"encoding/json"
	"io/ioutil"
	"os"
	"path"

	"lookahead.web.app/cli/internal/constants"
	"lookahead.web.app/cli/internal/logging"
)

var writeCredentialsFilePermissions os.FileMode = 0666

//CredentialsStruct The typical structue of a user credentials file
type CredentialsStruct struct {
	//IdToken The Firebase Auth ID token of the logged in user
	IdToken string `json:"idToken"`
	//RefreshToken A refresh token used to renew the id token
	RefreshToken string `json:"refreshToken"`
	//LocalId The unique ID of the user
	LocalId string `json:"localId"`
	//SignInTimestamp Epoch timestamp captured when the user signed in
	SignInTimestamp int64 `json:"signInTimestamp"`
	//StoreSyncTimestamp Epoch timestamp captured when the local store
	//is synced with the cloud database
	StoreSyncTimestamp int64 `json:"storeSyncTimestamp"`
}

//GetCredentialsLocation Return the path of the credentials file
func GetCredentialsLocation() string {
	return path.Join(constants.CONFIG_PATH, ".lookaheadrc")
}

//ReadCredentials Get the credentials and return them
func ReadCredentials() CredentialsStruct {
	credsLoc := GetCredentialsLocation()
	if _, err := os.Stat(credsLoc); err == nil {
		content, err := ioutil.ReadFile(credsLoc)
		if err != nil {
			logging.Error(1, "Couldn't read credentials file. Please try again")
		}
		contentStruct := CredentialsStruct{}
		json.Unmarshal(content, &contentStruct)
		return contentStruct
	}
	return CredentialsStruct{}
}

func WriteCredentials(data CredentialsStruct) bool {
	credsLoc := GetCredentialsLocation()
	dataToWrite, _ := json.Marshal(data)
	if _, err := os.Stat(credsLoc); err == nil {
		err := ioutil.WriteFile(credsLoc, dataToWrite, writeCredentialsFilePermissions)
		if err != nil {
			return false
		}
		return true
	}
	return false
}

func CheckIfUserLoggedIn() bool {
	creds := ReadCredentials()
	if creds.IdToken != "" && creds.RefreshToken != "" {
		return true
	}
	return false
}
