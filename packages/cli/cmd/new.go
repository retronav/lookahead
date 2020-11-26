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
	"github.com/spf13/cobra"
	"lookahead.web.app/cli/internal/input"
	"lookahead.web.app/cli/internal/logging"
	"lookahead.web.app/cli/internal/rest"
)

// newCmd represents the new command
var newCmd = &cobra.Command{
	Use:   "new",
	Short: "Create a new todo.",
	Long: `Create a new todo using this command.
	
	To create a new todo in interactive mode, run 'look new'.
	To directly create a todo using flags, run 
	'look new -t "YOUR TITLE" -c "YOUR CONTENT HERE"'.
	The method of creating todos using 
	command line flags don't support multiline content.`,
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
			for []byte(title)[0] == /*Newline*/ 13 {
				title = input.Input("Enter the new title: ")
			}
			content = input.MultilineInput("Enter the new content: ")
		}
		s := logging.DarkSpinner(" Creating new todo/note")
		s.Start()
		err := rest.RestClient.Add(title, content)
		if err != nil {
			s.Stop()
			logging.Error(1, err.Error())
		} else {

			s.Stop()
			logging.Success("Created successfully!!")
		}
	},
}

func init() {
	rootCmd.AddCommand(newCmd)

	newCmd.Flags().StringP("title", "t", "", "Set the title ")
	newCmd.Flags().StringP("content", "c", "", "Set the content."+
		" Doesn't support multiline ")
}
