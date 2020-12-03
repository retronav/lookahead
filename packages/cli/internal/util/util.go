package util

import (
	"encoding/json"
	"fmt"
	"math/rand"
	"net/http"
	"time"
)

//IsOnline Check whether user is connected to the Internet or not.
//This method of checking can be unfunctional in some areas
//but there seems to be no downtime.
//
func IsOnline() bool {
	//Make a request to the Lookahead API server
	//We need the error only, nothing else :)
	_, err := http.Get("https://lookahead-api.vercel.app/")
	//err = nil means online
	if err == nil {
		return true
	}
	//if the "return statement" in the if didn't executed,
	//this one will execute surely
	return false
}

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

//GenerateDocID Generate random id for Firestore document.
//Original function ported from Typescript, from the Firebase
//JS SDK
//(see https://github.com/firebase/firebase-js-sdk/blob/73a586c92afe3f39a844b2be86086fddb6877bb7/packages/firestore/src/util/misc.ts#L36)
func GenerateDocID() string {
	//Alphanumeric characters
	const chars string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
	autoId := ""
	for i := 0; i < 20; i++ {
		autoId += string(chars[int(rand.Float32()*float32(len(chars)))])
	}
	return autoId
}
