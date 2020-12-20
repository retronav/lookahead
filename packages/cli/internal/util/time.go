package util

import (
	"time"
)

//This module contains methods to convert between UNIX timestamps
//and ISO 8601 timestamps(RFC3339).

//MakeCurrDate return an RFC3339 timestamp of the current time
//in UTC timezone
//Example: 2006-01-02T15:04:05Z
func MakeCurrDate() string {
	now := time.Now().UTC()
	return now.Format(time.RFC3339)
}

//RFC3339ToUnix converts the output given by MakeCurrDate()
//into a Unix timestamp
func RFC3339ToUnix(RFCDate string) int64 {
	timeObj, _ := time.Parse(time.RFC3339, RFCDate)
	return timeObj.Local().Unix()
}
