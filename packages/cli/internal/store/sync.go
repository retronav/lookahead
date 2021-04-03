package store

import (
	"encoding/json"
	"os"
	"sort"
	"time"

	"lookahead.web.app/cli/internal/credential"
	"lookahead.web.app/cli/internal/firebase"
	"lookahead.web.app/cli/internal/logging"
	"lookahead.web.app/cli/internal/rest"
	"lookahead.web.app/cli/internal/util"
)

//This algorithm of syncing the local store to the cloud database
//is kept seperate to maintain readablity and to ease
//maintenance.

//Sync Sync the local store to the cloud database
func (s storeStruct) Sync(force bool) {
	creds := credential.ReadCredentials()
	if time.Now().Unix()-creds.SignInTimestamp > 3600 {
		firebase.Auth.UpdateIdToken()
		creds = credential.ReadCredentials()
	} else {
		creds = credential.ReadCredentials()
	}
	if util.IsOnline() && credential.CheckIfUserLoggedIn() && (force || time.Now().Unix()-creds.StoreSyncTimestamp > 300) {
		spinner := logging.DarkSpinner(" Syncing to database")
		spinner.Start()
		//The id token with the restClient might be the expired one, so take
		//no chances and update it
		//lint:ignore SA4001 the rest client object is necessary to mutate here
		*&rest.RestClient.IdToken = creds.IdToken
		//This will be done in the background so no error handling needed
		dbJSON, _ := rest.RestClient.GetAll()
		localJSON, _ := s.GetAll()
		//Reconcile everything
	outer:
		for _, item := range dbJSON {
			//Flag to confirm that this is a new item
			newItem := true
			for i, lItem := range localJSON {
				if item.ID == lItem.ID {
					newItem = false
					if item.Title != lItem.Title || item.Content != lItem.Content {
						//Look for mutated items and update them
						newItem = false
						if lItem.LastEdited != item.LastEdited {
							lts := util.RFC3339ToUnix(lItem.LastEdited)
							ts := util.RFC3339ToUnix(item.LastEdited)
							if lts > ts {
								//This item was edited in the CLI,
								//But the user was offline. Update it
								rest.RestClient.Set(lItem.ID, lItem.Title, lItem.Content, lItem.LastEdited)
							} else {
								//This item got updated on the web app. Update it
								localJSON[i] = item
							}
						}
					}
					continue outer
				}
			}
			//If confirmed that the current item is a new one,
			//append it
			if newItem {
				localJSON = append(localJSON, item)
			}
		}
		for i, lItem := range localJSON {
			if lItem.New {
				//This item was added from the CLI but the user was offline.
				//Update it
				if util.IsOnline() {
					lItem.New = false
					rest.RestClient.Set(lItem.ID, lItem.Title, lItem.Content, lItem.LastEdited)
				} else {
					continue
				}
			}
			//A flag to confirm that this a deleted item
			deletedItem := true
			for _, item := range dbJSON {
				if item.ID == lItem.ID {
					deletedItem = false
				}
			}
			//If the item is deleted
			if deletedItem {
				if len(localJSON) > (i + 1) {
					//Remove the item and push the remaining ones ahead
					//Since everything is goind to be sorted anyway,
					//Use second approach in https://stackoverflow.com/a/37335777/12020232
					localJSON[i] = localJSON[len(localJSON)-1]
					localJSON = localJSON[:len(localJSON)-1]
				} else {
					localJSON = localJSON[:len(localJSON)-1]
				}
			}
		}
		//Sort the elements by date; ascending order
		sort.SliceStable(localJSON, func(i, j int) bool {
			return util.RFC3339ToUnix(localJSON[i].LastEdited) < util.RFC3339ToUnix(localJSON[j].LastEdited)
		})
		toWrite, _ := json.Marshal(localJSON)
		timeStamp := time.Now().Unix()
		os.WriteFile(s.storeLoc, []byte(toWrite), s.filePermissions)
		creds.StoreSyncTimestamp = timeStamp
		credential.WriteCredentials(creds)
		spinner.Stop()
	}
}
