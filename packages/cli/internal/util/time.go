package util

import (
	"encoding/json"
	"fmt"
	"strconv"
	"strings"
	"time"

	"github.com/tidwall/gjson"
)

//This module contains methods to convert between UNIX timestamps
//and the date format used internally in Lookahead. It look like this:
//{"date" : "01 Jan 2021", "time" : "00:01"}
//This is usually transported as a string and only converted to JSON
//when need arises.

//MakeCurrDate create a date object that complies with the app standards
//and return in its string format
//
//Example: {"date" : "dd mm, yyyy", "time" : "hh:nn"}
func MakeCurrDate() string {
	now := time.Now().Local()
	date := now.Day()
	month := now.Month().String()[0:3]
	year := now.Year()
	hour := fmt.Sprint(now.Hour())
	minute := fmt.Sprint(now.Minute())

	if len(hour) == 1 {
		hour = "0" + hour
	}
	if len(minute) == 1 {
		minute = "0" + minute
	}

	dateMap := map[string]string{
		"date": fmt.Sprintf("%v %s, %v", date, month, year),
		"time": fmt.Sprintf("%s:%s", hour, minute),
	}
	toReturn, _ := json.Marshal(dateMap)
	return string(toReturn)
}

//DateJSONToTimestamp converts the output given by MakeCurrDate()
//into a Unix timestamp
func DateJSONToTimestamp(dateJSON string) int64 {
	months := []string{"Jan", "Feb", "Mar", "Apr", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"}
	dateParsed := gjson.Parse(dateJSON)
	fullDate := dateParsed.Get("date").Str
	fullTime := dateParsed.Get("time").Str
	dateParts := strings.SplitN(fullDate, " ", 3)
	dateStr, monthStr, yearStr := dateParts[0], dateParts[1], dateParts[2]
	monthStr = monthStr[:3]
	month := 0
	for i, n := range months {
		if monthStr == n {
			month = i
		}
	}
	year, _ := strconv.Atoi(yearStr)
	date, _ := strconv.Atoi(dateStr)
	hour, _ := strconv.Atoi(fullTime[:2])
	min, _ := strconv.Atoi(fullTime[3:5])
	timestamp := time.Date(year, time.Month(month), date, hour, min, 0, 0, time.Local)
	return timestamp.Unix()
}
