package types

import (
	"time"
)

//DataSchema The schema to follow while writing or reading data from
//the local store.
type DataSchema struct {
	Title           string `json:"title"`
	Content         string `json:"content"`
	Id              string `json:"id"`
	LastEdited      string `json:"last_edited"`
	New             bool   `json:"new,omitempty"`
	LastEditedHuman string
}

//TimeFormat The time format used in the CLI to display dates
var TimeFormat string = "02 Jan, 2006 at 3:04PM"

func (d DataSchema) ToLastEditedHuman() string {
	timeObj, _ := time.Parse(time.RFC3339, d.LastEdited)
	return timeObj.Local().Format(TimeFormat)
}
