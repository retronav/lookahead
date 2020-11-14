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
	"strings"
	"time"

	"github.com/briandowns/spinner"
	"github.com/fatih/color"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
	"github.com/tidwall/gjson"
	"lookahead.web.app/cli/internal/credential"
	"lookahead.web.app/cli/internal/logging"
	"lookahead.web.app/cli/internal/rest"
	"lookahead.web.app/cli/internal/util"
)

func checkStringEmptyOrOnlySpaces(str string) bool {
	if strings.TrimSpace(str) == "" {
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

func printWholeTodo(todo map[string]interface{}) {
	fmt.Println("Todo id:", getLastPathOfDocId(todo["id"].(string)))
	color.HiCyan(fmt.Sprint(todo["title"]))
	if !checkStringEmptyOrOnlySpaces(fmt.Sprint(todo["content"])) {
		fmt.Println(todo["content"])
	}
	fmt.Println(lastEditedStringFormat(fmt.Sprint(todo["last_edited"])))
	fmt.Println()
}

func printOnlyId(todo map[string]interface{}) {
	// TODO(me): Implement print-ID-only functionality
}

// listCmd represents the show command
var listCmd = &cobra.Command{
	Use:   "list",
	Short: "Lists all notes and to-dos of the user",
	Run: func(cmd *cobra.Command, args []string) {
		//If user seems to be offline
		if !util.IsOnline() {
			logging.Error(1, "Offline functionality will be implemented soon."+
				" But for now, you need to be online to run this command")
		}
		//If user is logged out
		if credential.CheckIfUserLoggedIn() == false {
			logging.Error(1, "You should be logged in to run this command!!"+
				" Use `look login` to login")
		}
		entriesLimit := viper.GetInt("limitEntries")
		// -----------------------------------------
		// Implement get-by-id only
		// -----------------------------------------
		s := spinner.New(spinner.CharSets[9], 100*time.Millisecond)
		s.Prefix = " Fetching data"
		s.Start()
		documents, err := rest.RestClient.GetAll()
		if err != nil {
			s.Stop()
			logging.Error(1, err.Error())
		}
		for i, todo := range documents {
			if entriesLimit > 0 && i >= entriesLimit {
				logging.Warn(
					"If you want to see more than %d entries, "+
						"please set the `limitEntries` flag in the configuration file"+
						" or use the `-l` flag in the command",
					entriesLimit,
				)
				break
			}
			printWholeTodo(todo)
		}
	},
}

func init() {
	rootCmd.AddCommand(listCmd)
	//Show this command as suggestion when these non-existent commands are used
	listCmd.SuggestFor = []string{"notes", "todos", "show"}
	listCmd.PersistentFlags().Int16P(
		"limitEntries",
		"l",
		0,
		"configure the number of entries the CLI shows on running `look list`")
	//Bind flag to viper for precedence
	viper.BindPFlag("limitEntries", listCmd.PersistentFlags().Lookup("limitEntries"))
}
