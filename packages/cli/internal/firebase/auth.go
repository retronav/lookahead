package firebase

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/briandowns/spinner"
	"lookahead.web.app/cli/internal/credential"
)

type IFirebaseAuth interface {
	//UpdateIdToken Updates the user's ID token (idToken field in the credentials file)
	//if last update time was more than 1 hour ago
	UpdateIdToken()
}

type FirebaseAuth struct{}

type updateIdTokenRes struct {
	IdToken      string `json:"id_token"`
	RefreshToken string `json:"refresh_token"`
}

//UpdateIdToken Updates the user's ID token (idToken field in the credentials file)
//if last update time was more than 1 hour ago
func (a FirebaseAuth) UpdateIdToken() {
	creds := credential.ReadCredentials()
	newCreds := credential.CredentialsStruct{}
	if creds.SignInTimestamp != 0 &&
		time.Now().Unix()-creds.SignInTimestamp < 3600 {
		return
	}
	if creds.IdToken == "" && creds.RefreshToken == "" {
		return
	}
	s := spinner.New(spinner.CharSets[9], 100*time.Millisecond)
	s.Suffix = " retrieving your account"
	s.Start()
	apiUrl :=
		"https://securetoken.googleapis.com/v1/token?key=" + AuthAPIKey
	urlParams := url.Values{}
	urlParams.Add("grant_type", "refresh_token")
	urlParams.Add("refresh_token", creds.RefreshToken)
	client := http.Client{}
	request, _ := http.NewRequest("POST", apiUrl, strings.NewReader(urlParams.Encode()))
	request.Header.Add("Content-Type", "application/x-www-form-urlencoded")
	res, err := client.Do(request)
	if err != nil {
		s.Stop()
		return
	}
	resBody, _ := ioutil.ReadAll(res.Body)
	var resBodyJSON updateIdTokenRes
	json.Unmarshal(resBody, &resBodyJSON)
	newCreds.IdToken = resBodyJSON.IdToken
	newCreds.RefreshToken = resBodyJSON.RefreshToken
	newCreds.SignInTimestamp = time.Now().Unix()
	credential.WriteCredentials(newCreds)
	s.Stop()
}

//Auth Internal utility functions pertaining Firebase Auth
var Auth = FirebaseAuth{}
