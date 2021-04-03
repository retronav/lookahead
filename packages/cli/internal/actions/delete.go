package actions

import (
	"lookahead.web.app/cli/internal/input"
	"lookahead.web.app/cli/internal/logging"
	"lookahead.web.app/cli/internal/store"
)

//Delete A monolithic function to delete todos/notes
func Delete(id string) {
	//Confirm if really want to delete
	wantsToDelete := input.Confirm("Do you really want to delete it?")
	//Check if ID really exists
	exists := store.Store.IDExists(id)
	if !exists {
		logging.Error(1, "ID not found! Please check that ID again!")
	}
	if wantsToDelete {
		deleted, err := store.Store.Delete(id)
		if err != nil {
			logging.Error(1, err.Error())
		}
		if deleted {
			logging.Success("Successfully deleted todo/note!")
		}
	} else {
		logging.Info("Cancelled the deletion")
	}
}
