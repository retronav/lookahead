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
	"lookahead.web.app/cli/internal/credential"
	"lookahead.web.app/cli/internal/logging"
	"lookahead.web.app/cli/internal/store"
)

// deleteCmd represents the delete command
var deleteCmd = &cobra.Command{
	Use:   "delete [id]",
	Short: "Delete a todo/note by specifying its ID.",
	Long: `Delete a todo/note by specifying its ID.

To know the ID of the note you're looking for, run "look list". The output
will contain the ID specified. Grab the ID and then run this command.`,
	Run: func(cmd *cobra.Command, args []string) {
		//If user is logged out
		if credential.CheckIfUserLoggedIn() == false {
			logging.Error(1, "You should be logged in to run this command!!"+
				" Use `look login` to login")
		}
		id := args[0]
		//Check if ID really exists
		exists := store.Store.IdExists(id)
		if !exists {
			logging.Error(1, "ID not found! Please check that ID again!")
		}
		deleted, err := store.Store.Delete(id)
		if err != nil {
			logging.Error(1, err.Error())
		}
		if deleted {
			logging.Success("Successfully deleted todo/note!")
		}
	},
}

func init() {
	rootCmd.AddCommand(deleteCmd)
}
