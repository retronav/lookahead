package types

//DataSchema The schema to follow while writing or reading data from
//the local store.
type DataSchema struct {
	Title      string `json:"title"`
	Content    string `json:"content"`
	Id         string `json:"id"`
	LastEdited string `json:"last_edited"`
	New        bool   `json:"new,omitempty"`
}
