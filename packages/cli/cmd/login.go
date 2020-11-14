/*
Copyright © 2020 Pranav Karawale

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
package cmd

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"regexp"
	"time"

	"github.com/briandowns/spinner"
	"github.com/fatih/color"
	"github.com/google/uuid"
	"github.com/spf13/cobra"
	"lookahead.web.app/cli/internal/credential"
	"lookahead.web.app/cli/internal/http"
	"lookahead.web.app/cli/internal/logging"
)

// loginCmd represents the login command
var loginCmd = &cobra.Command{
	Use:   "login",
	Short: "Login with the CLI",
	Run: func(cmd *cobra.Command, args []string) {
		if credential.CheckIfUserLoggedIn() {
			color.Yellow("You seem to be already logged in!! If you need to use" +
				" another account, first run `look logout` first.")
			os.Exit(0)
		}
		var email string
		loginTokens := credential.CredentialsStruct{}
		identityKey, _ := uuid.NewRandom()
		fmt.Print("Tell me your email: ")
		fmt.Scanln(&email)
		if !checkEmailValidity(email) {
			color.HiRed("Invalid Email!!!")
			os.Exit(1)
		}
		emailRequestSent := sendEmailRequest(email, identityKey.String())
		if emailRequestSent {
			s := spinner.New(spinner.CharSets[9], 100*time.Millisecond)
			s.Suffix = color.CyanString(" Waiting for you to open the link")
			s.Start()
			for loginTokens.IdToken == "" {
				loginTokens = getLoginTokens(email, identityKey.String())
			}
			s.Suffix = " Logging in"
			credsLoc := credential.GetCredentialsLocation()
			loginTokensJSON, _ := json.Marshal(loginTokens)
			err := ioutil.WriteFile(credsLoc, []byte(loginTokensJSON), 0666)
			if err != nil {
				logging.Error(1, "Couldn't save credentials. Make sure you have"+
					" the permissions to save files :(")
			}
			s.Stop()
			logging.Success("Logged in successfully!!")
		} else {
			logging.Error(1, "Failed to send the email :(")
		}
	},
}

func checkEmailValidity(email string) bool {
	emailRegex := regexp.MustCompile("^[a-zA-Z0-9.!#$%&'*+\\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")
	if len(email) < 3 && len(email) > 254 {
		return false
	}
	return emailRegex.MatchString(email)
}

// sendEmailRequest sends a request to the backend
// to send the authentication email to the user's email
func sendEmailRequest(email string, identityKey string) bool {
	reqBody, _ := json.Marshal(map[string]string{"email": email, "identityKey": identityKey})
	reqHeaders := map[string]string{"Content-Type": "application/json"}
	res, err := http.Post("https://lookahead-api.vercel.app/send-email-link", reqHeaders, bytes.NewReader(reqBody))
	if err != nil {
		color.HiRed("Some error happened %s", err)
		os.Exit(1)
	}
	var resJSON map[string]interface{}
	json.Unmarshal([]byte(res), &resJSON)
	return resJSON["message"] == "OK"
}

// getLoginTokens gets the login tokens after the user clicks the email link
func getLoginTokens(email string, identityKey string) credential.CredentialsStruct {
	time.Sleep(1500 * time.Millisecond)
	reqBody, _ := json.Marshal(map[string]string{"email": email, "identityKey": identityKey})
	reqHeaders := map[string]string{"Content-Type": "application/json"}
	res, err := http.Post("https://lookahead-api.vercel.app/get-login-tokens", reqHeaders, bytes.NewReader(reqBody))
	if err != nil {
		color.HiRed("Some error happened %s", err)
		os.Exit(1)
	}
	var resJSON = credential.CredentialsStruct{}
	json.Unmarshal([]byte(res), &resJSON)
	resJSON.SignInTimestamp = time.Now().Unix()
	return resJSON
}

func init() {
	rootCmd.AddCommand(loginCmd)
}
