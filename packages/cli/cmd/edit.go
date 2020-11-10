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
	"bufio"
	"fmt"
	"os"
	"strings"

	"github.com/spf13/cobra"
	"lookahead.web.app/cli/internal/credential"
	"lookahead.web.app/cli/internal/logging"
	"lookahead.web.app/cli/internal/rest"
	"lookahead.web.app/cli/internal/util"
)

// editCmd represents the set command
var editCmd = &cobra.Command{
	Use:   "edit [id]",
	Short: "Update a todo/note by specifying its ID.",
	Long: `This command is useful to update the metadata stored in your notes.

To know the ID of the note you're looking for, run "look list". The output
will contain the ID specified. Grab the ID and then run this command.	`,
	Args: cobra.ExactArgs(1),
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
		id := args[0]

		var content string
		logging.Ask("Enter the title to be updated: ")
		reader := bufio.NewReader(os.Stdin)
		title, _ := reader.ReadString(byte('\n'))
		fmt.Println("")

		logging.Ask("Enter the content to be updated" +
			"(optional; multiline; Ctrl-X and hit ENTER to quit): ")
		scanner := bufio.NewScanner(os.Stdin)
		for scanner.Scan() {
			if scanner.Bytes()[0] == /* Ctrl-X ASCII code */ 24 {
				break
			}
			if scanner.Text() != "" {
				content += scanner.Text() + "\n"
			}
		}
		//Trim trailing and leading newlines
		content = strings.Trim(content, "\n")

		err := rest.RestClient.Set(id, title, content)
		if err != nil {
			panic(err)
		}
		logging.Success("Successfully updated!!")
	},
}

func init() {
	rootCmd.AddCommand(editCmd)
}
