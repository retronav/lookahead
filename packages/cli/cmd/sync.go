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
	"lookahead.web.app/cli/internal/store"
)

// syncCmd represents the sync command
var syncCmd = &cobra.Command{
	Use:   "sync",
	Short: "Sync the local store with the database.",
	Long: `Sync the local store with the database.
	
Usually, the local store is automatically synced if more than 5 minutes have been 
passed since the last command has been run. To override the behaviour and
immediately sync the local store, use this command.`,
	Run: func(cmd *cobra.Command, args []string) {
		force := true
		store.Store.Sync(force)
	},
}

func init() {
	rootCmd.AddCommand(syncCmd)
}
