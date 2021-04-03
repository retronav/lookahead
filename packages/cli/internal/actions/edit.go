package actions

import (
	"fmt"
	"strings"

	"lookahead.web.app/cli/internal/input"
	"lookahead.web.app/cli/internal/logging"
	"lookahead.web.app/cli/internal/store"
)

//Edit A monolithic function to edit todos/notes
func Edit(id string, shouldEditContent bool) {
	//Check if ID really exists
	exists := store.Store.IDExists(id)
	if !exists {
		logging.Error(1, "ID not found! Please check that ID again!")
	}
	originalTodo, err := store.Store.Get(id)
	if err != nil {
		logging.Error(1, err.Error())
	}
	logging.Info("Original title : %s", originalTodo.Title)
	logging.Info("Original content : %s", originalTodo.Content)
	title := ""
	content := ""
	title = input.Input("Enter the title to be updated: ")
	for title == "" {
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
	isOffline, err := store.Store.Update(id, title, content)
	if err != nil {
		s.Stop()
		logging.Error(1, err.Error())
	} else {
		s.Stop()
		if isOffline {
			logging.Warn("Couldn't sync to the online store" +
				" because you seem to be offline.")
		}
		logging.Success("Successfully updated!!")
	}
}
