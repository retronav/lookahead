package firebase

import (
	"bytes"
	"encoding/json"
	"io/ioutil"
	"net/http"
	"net/url"
	"os"
	"strings"
	"time"

	"github.com/fatih/color"
	"lookahead.web.app/cli/internal/credential"
	internalHttp "lookahead.web.app/cli/internal/http"
	"lookahead.web.app/cli/internal/logging"
)

type firebaseAuth struct{}

type updateIdTokenRes struct {
	IdToken      string `json:"id_token"`
	RefreshToken string `json:"refresh_token"`
}

//UpdateIdToken Updates the user's ID token (idToken field in the credentials file)
//if last update time was more than 1 hour ago
func (a firebaseAuth) UpdateIdToken() {
	creds := credential.ReadCredentials()
	newCreds := credential.CredentialsStruct{LocalId: creds.LocalId}
	if creds.SignInTimestamp != 0 &&
		time.Now().Unix()-creds.SignInTimestamp < 3600 {
		return
	}
	if creds.IdToken == "" && creds.RefreshToken == "" {
		return
	}
	s := logging.DarkSpinner(" retrieving your account")
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

// SendEmailRequest sends a request to the backend
// to send the authentication email to the user's email
func (a firebaseAuth) SendEmailRequest(email string, identityKey string) bool {
	reqBody, _ := json.Marshal(map[string]string{"email": email, "identityKey": identityKey})
	reqHeaders := map[string]string{"Content-Type": "application/json"}
	res, err := internalHttp.Post("https://lookahead-api.vercel.app/send-email-link", reqHeaders, bytes.NewReader(reqBody))
	if err != nil {
		color.HiRed("Some error happened %s", err)
		os.Exit(1)
	}
	var resJSON map[string]interface{}
	json.Unmarshal([]byte(res), &resJSON)
	return resJSON["message"] == "OK"
}

// GetLoginTokens gets the login tokens after the user clicks the email link
func (a firebaseAuth) GetLoginTokens(email string, identityKey string) credential.CredentialsStruct {
	time.Sleep(1500 * time.Millisecond)
	reqBody, _ := json.Marshal(map[string]string{"email": email, "identityKey": identityKey})
	reqHeaders := map[string]string{"Content-Type": "application/json"}
	res, err := internalHttp.Post("https://lookahead-api.vercel.app/get-login-tokens", reqHeaders, bytes.NewReader(reqBody))
	if err != nil {
		logging.Error(1, err.Error())
	}
	var resJSON = credential.CredentialsStruct{}
	json.Unmarshal([]byte(res), &resJSON)
	resJSON.SignInTimestamp = time.Now().Unix()
	return resJSON
}

//Auth Internal utility functions pertaining Firebase Auth
var Auth = firebaseAuth{}
