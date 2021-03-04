package types

import (
	"time"

	"lookahead.web.app/cli/internal/version"
)

//DataSchema The schema to follow while writing or reading data from
//the local store.
type DataSchema struct {
	Title           string `json:"title"`
	Content         string `json:"content"`
	Id              string `json:"id"`
	LastEdited      string `json:"last_edited"`
	New             bool   `json:"new,omitempty"`
	LastEditedHuman string `json:"lastEditedHuman,omitempty"`
}

//TimeFormat The time format used in the CLI to display dates
var TimeFormat string = "02 Jan, 2006 at 3:04PM"

func (d DataSchema) ToLastEditedHuman() string {
	timeObj, _ := time.Parse(time.RFC3339, d.LastEdited)
	return timeObj.Local().Format(TimeFormat)
}

//CLIAPIEndpoint API Endpoint used by CLI to interact with
//Firebase
var CLIAPIEndpoint = func() string {
	if version.Version == "Dev" {
		return "http://localhost:3000"
	}
	return "https://lookahead-api.vercel.app"
}()

//SecureTokenEndpoint Google APIs Securetoken endpoint
//This is used to refresh user credentials
var SecureTokenEndpoint = func() string {
	prefix := "https://"
	if version.Version == "Dev" {
		prefix = "http://localhost:9099/"
	}
	return prefix + "securetoken.googleapis.com/v1/token"
}()

//Endpoints General API URLs used in the CLI for operations
var Endpoints = struct {
	SEND_EMAIL_LINK string
	GET_LOGIN_TOKEN string
	TODOS           string
}{
	SEND_EMAIL_LINK: CLIAPIEndpoint + "/send-email-link",
	GET_LOGIN_TOKEN: CLIAPIEndpoint + "/get-login-tokens",
	TODOS:           CLIAPIEndpoint + "/todos",
}
