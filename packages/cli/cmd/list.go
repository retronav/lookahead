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
	"strings"

	"github.com/fatih/color"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
	"github.com/tidwall/gjson"
	"lookahead.web.app/cli/internal/credential"
	"lookahead.web.app/cli/internal/firebase"
	"lookahead.web.app/cli/internal/util"
)

func checkStringEmptyOrOnlySpaces(str string) bool {
	spaceRegexp := regexp.MustCompile(`\s.*`)
	if str == "" {
		return true
	}
	if spaceRegexp.MatchString(str) {
		return true
	}
	return false
}

func lastEditedStringFormat(lastEdited string) string {
	return gjson.Get(lastEdited, "date").Str + " at " + gjson.Get(lastEdited, "time").Str
}

func getLastPathOfDocId(docId string) string {
	arr := strings.Split(docId, "/")
	return arr[len(arr)-1]
}

// listCmd represents the show command
var listCmd = &cobra.Command{
	Use:   "list",
	Short: "Lists all notes and to-dos of the user",
	Run: func(cmd *cobra.Command, args []string) {
		//If user seems to be offline
		if util.IsOnline() {
			color.HiRed("Offline functionality will be implemented soon." +
				"But for now, you need to be online to run this command")
			os.Exit(1)
		}
		//If user is logged out
		if credential.CheckIfUserLoggedIn() == false {
			color.HiRed("You should be logged in to run this command!!" +
				" Use `look login` to login")
			os.Exit(1)
		}
		entriesLimit := viper.GetInt("numberOfEntries")
		credentials := credential.ReadCredentials()
		firestore := firebase.Firestore{
			IdToken: credentials.IdToken,
		}
		todoPath := fmt.Sprintf("users/%s/todos", credentials.LocalId)
		todoCollection := firestore.GetCollection(todoPath)
		documents := todoCollection.Documents
		for i, todo := range documents {
			if i >= entriesLimit {
				color.HiRed(
					"If you want to see more than %d entries, "+
						"please set the `numberOfEntries` flag in the configuration file"+
						" or use the `-n` flag in the command",
					entriesLimit,
				)
				break
			}
			fmt.Println("Todo id:", getLastPathOfDocId(todo.Id))
			color.HiCyan(fmt.Sprint(todo.Data["title"]))
			if !checkStringEmptyOrOnlySpaces(fmt.Sprint(todo.Data["content"])) {
				fmt.Println(todo.Data["content"])
			}
			fmt.Println(lastEditedStringFormat(fmt.Sprint(todo.Data["last_edited"])))
			fmt.Println()
		}
	},
}

func init() {
	rootCmd.AddCommand(listCmd)
	//Show this command as suggestion when these non-existent commands are used
	listCmd.SuggestFor = []string{"notes", "todos", "show"}
	listCmd.PersistentFlags().Int16P(
		"numberOfEntries",
		"n",
		0,
		"configure the number of entries the CLI shows on running `look list`")
	//Bind flag to viper for precedence
	viper.BindPFlag("numberOfEntries", listCmd.PersistentFlags().Lookup("numberOfEntries"))
}
