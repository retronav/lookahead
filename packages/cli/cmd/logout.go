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
	"os"
	"time"

	"github.com/briandowns/spinner"
	"github.com/fatih/color"
	"github.com/spf13/cobra"
	"lookahead.web.app/cli/internal/credential"
)

// logoutCmd represents the logout command
var logoutCmd = &cobra.Command{
	Use:   "logout",
	Short: "Logs out the current user from the CLI",
	Long:  ``,
	Run: func(cmd *cobra.Command, args []string) {
		s := spinner.New(spinner.CharSets[9], 100*time.Millisecond)
		s.Suffix = " logging out"
		s.Start()
		err := os.Remove(credential.GetCredentialsLocation())
		if err != nil {
			color.HiRed("Couldn't log out. Please try again :(")
		}
		s.Stop()
		color.HiGreen("Logged out successfully. Sad to see you go")
	},
}

func init() {
	rootCmd.AddCommand(logoutCmd)
}
