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
	"strings"

	"github.com/spf13/cobra"
	"lookahead.web.app/cli/internal/input"
	"lookahead.web.app/cli/internal/logging"
	"lookahead.web.app/cli/internal/store"
)

// newCmd represents the new command
var newCmd = &cobra.Command{
	Use:   "new",
	Short: "Create a new todo/note.",
	Long: `Create a new todo/note using this command.
	
To create a new todo/note in interactive mode, run 'look new'.
To directly create a todo/note using flags, run 
'look new -t "YOUR TITLE" -c "YOUR CONTENT HERE"'.
If you need to insert newlines in the content simply use "\n", for example:
look new -t "Title" -c "Multiline\nWorks"

Flags:
-t, --title : Set the title of the new todo/note
-c, --content: Set the content of the new todo/note`,
	PreRun: func(cmd *cobra.Command, args []string) {
		title, _ := cmd.Flags().GetString("title")
		content, _ := cmd.Flags().GetString("content")
		if title == "" && content != "" {
			logging.Error(1, "Title must be present to supply content. To add a title,"+
				" run the interactive mode by running `look new`"+
				" or supply by arguments like `look new -t \"Title\" -c \"Content\"`")
		}
	},
	Run: func(cmd *cobra.Command, args []string) {
		title, _ := cmd.Flags().GetString("title")
		content, _ := cmd.Flags().GetString("content")
		if title == "" {
			title = input.Input("Enter the new title: ")
			// Because title can't be empty
			for title == "" {
				title = input.Input("Enter the new title: ")
			}
			content = input.MultilineInput("Enter the new content: ")
		}
		content = strings.Replace(content, "\\n", "\n", -1)
		s := logging.DarkSpinner(" Creating new todo/note")
		s.Start()
		isOffline, err := store.Store.Append(title, content)
		if err != nil {
			s.Stop()
			logging.Error(1, err.Error())
		} else {
			s.Stop()
			if isOffline {
				logging.Warn("Couldn't sync to the online store" +
					" because you seem to be offline.")
			}
			logging.Success("Created successfully!!")
		}
	},
}

func init() {
	rootCmd.AddCommand(newCmd)

	newCmd.Flags().StringP("title", "t", "", "Set the title of the new todo/note")
	newCmd.Flags().StringP("content", "c", "", "Set the content of the new todo/note")
}
