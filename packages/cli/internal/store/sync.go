package store

import (
	"encoding/json"
	"io/ioutil"
	"time"

	"github.com/mitchellh/mapstructure"
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
		*&rest.RestClient.IdToken = creds.IdToken
		//This will be done in the background so no error handling needed
		dbRawJSON, _ := rest.RestClient.GetAll()
		var dbJSON []DataSchema
		localJSON, _ := s.GetAll()
		//Convert map to DataSchema
		mapstructure.Decode(dbRawJSON, &dbJSON)
		//Reconcile everything
	outer:
		for _, item := range dbJSON {
			//Flag to confirm that this is a new item
			newItem := true
			for i, lItem := range localJSON {
				if item.Id == lItem.Id {
					newItem = false
					if item.Title != lItem.Title || item.Content != lItem.Content {
						//Look for mutated items and update them
						newItem = false
						if lItem.LastEdited != item.LastEdited {
							lts := util.DateJSONToTimestamp(lItem.LastEdited)
							ts := util.DateJSONToTimestamp(item.LastEdited)
							if lts > ts {
								//This item was edited in the CLI,
								//But the user was offline. Update it
								rest.RestClient.Set(lItem.Id, lItem.Title, lItem.Content, lItem.LastEdited)
							}
						} else {
							//This item got updated on the web app. Update it
							localJSON[i] = item
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
			if lItem.New == true {
				//This item was added from the CLI but the user was offline.
				//Update it
				if util.IsOnline() {
					lItem.New = false
					rest.RestClient.Set(lItem.Id, lItem.Title, lItem.Content, lItem.LastEdited)
				} else {
					continue
				}
			}
			//A flag to confirm that this a deleted item
			deletedItem := true
			for _, item := range dbJSON {
				if item.Id == lItem.Id {
					deletedItem = false
				}
			}
			//If the item is deleted
			if deletedItem {
				//Remove the item and push the remaining ones ahead
				//This seems to be computationally expensive, so
				//TODO(obnoxiousnerd): find alternatives to this
				localJSON = append(localJSON[:i], localJSON[i+1:]...)
			}
		}
		toWrite, _ := json.Marshal(localJSON)
		timeStamp := time.Now().Unix()
		ioutil.WriteFile(s.storeLoc, []byte(toWrite), s.filePermissions)
		creds.StoreSyncTimestamp = timeStamp
		credential.WriteCredentials(creds)
		spinner.Stop()
	}
}
