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

	"github.com/spf13/cobra"
	"lookahead.web.app/cli/internal/credential"
	"lookahead.web.app/cli/internal/input"
	"lookahead.web.app/cli/internal/logging"
	"lookahead.web.app/cli/internal/rest"
	"lookahead.web.app/cli/internal/util"
)

// editCmd represents the set command
var editCmd = &cobra.Command{
	Use:   "edit [id]",
	Short: "Update a todo/note by specifying its ID.",
	Long: `Update a todo/note by specifying its ID.

To know the ID of the note you're looking for, run "look list". The output
will contain the ID specified. Grab the ID and then run this command.

By default, editing the content is disabled. If you need to edit the content, then you need
to pass the -c flag.`,
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
		shouldEditContent, _ := cmd.Flags().GetBool("content")
		title := ""
		content := ""
		title = input.Input("Enter the title to be updated: ")
		for []byte(title)[0] == /*Newline*/ 13 {
			title = input.Input("Enter the title to be updated: ")
		}
		fmt.Println("")
		if shouldEditContent {
			content = input.MultilineInput("Enter the content to be updated")
			//Trim trailing and leading newlines
			content = strings.Trim(content, "\n")
		}
		s := logging.DarkSpinner(" Updating %s", id)
		s.Start()
		err := rest.RestClient.Set(id, title, content)
		if err != nil {
			s.Stop()
			logging.Error(1, err.Error())
		} else {
			s.Stop()
			logging.Success("Successfully updated!!")
		}
	},
}

func init() {
	rootCmd.AddCommand(editCmd)
	editCmd.Flags().BoolP("content", "c", false, "Set this flag to edit the content.")
}
