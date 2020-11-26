package util

import "net/http"

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
