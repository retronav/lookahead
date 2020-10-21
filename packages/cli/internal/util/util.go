package util

import "net/http"

//IsOnline Check whether user is connected to the Internet or not.
//This method of checking can be unfunctional in some areas
//but there seems to be no downtime.
//
//See https://major.io/icanhazip-com-faq/ for more info about icanhazip
func IsOnline() bool {
	//Make a request to icanhazip.com
	//We need the error only, nothing else :)
	_, err := http.Get("https://icanhazip.com/")
	//err = nil means online
	if err == nil {
		return true
	}
	//if the "return statement" in the if didn't executed,
	//this one will execute surely
	return false
}
