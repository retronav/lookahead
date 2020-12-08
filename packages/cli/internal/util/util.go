package util

import (
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

//GenerateDocID Generate random id for Firestore document.
//Original function ported from Typescript, from the Firebase
//JS SDK
//(see https://github.com/firebase/firebase-js-sdk/blob/73a586c92afe3f39a844b2be86086fddb6877bb7/packages/firestore/src/util/misc.ts#L36)
func GenerateDocID() string {
	//Seed the generator
	rand.Seed(time.Now().UnixNano())
	//Alphanumeric characters
	const chars string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
	autoId := ""
	for i := 0; i < 20; i++ {
		autoId += string(chars[int(rand.Float32()*float32(len(chars)))])
	}
	return autoId
}
