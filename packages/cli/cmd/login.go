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
	"fmt"
	"os"
	"regexp"
	"time"

	"github.com/briandowns/spinner"
	"github.com/fatih/color"
	"github.com/google/uuid"
	"github.com/spf13/cobra"
	"lookahead.web.app/cli/internal/credential"
	"lookahead.web.app/cli/internal/firebase"
	"lookahead.web.app/cli/internal/input"
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
		loginTokens := credential.CredentialsStruct{}
		identityKey, _ := uuid.NewRandom()
		email := input.Input("Tell me your email: ")
		if !checkEmailValidity(email) {
			color.HiRed("Invalid Email!!!")
			os.Exit(1)
		}
		emailRequestSent := firebase.Auth.SendEmailRequest(email, identityKey.String())
		if emailRequestSent {
			logging.Info("We've sent you an link to your email to sign in.")
			s := spinner.New(spinner.CharSets[9], 100*time.Millisecond)
			s.Suffix = color.CyanString(" Waiting for you to open the link")
			s.Start()
			for loginTokens.IdToken == "" {
				loginTokens = firebase.Auth.GetLoginTokens(email, identityKey.String())
			}
			s.Suffix = " Logging in"
			err := credential.WriteCredentials(loginTokens)
			if err != nil {
				s.Stop()
				fmt.Println(err.Error())
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

func init() {
	rootCmd.AddCommand(loginCmd)
}
