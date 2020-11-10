package rest

import (
	"bytes"
	"encoding/json"
	"errors"
	"io/ioutil"
	"net/http"

	"github.com/tidwall/gjson"
	"lookahead.web.app/cli/internal/credential"
	"lookahead.web.app/cli/internal/version"
)

func getAPIEndpoint() string {
	if version.Version == "Dev" {
		return "http://localhost:3000/todos"
	}
	return "https://lookahead-api.vercel.app/todos"
}

type restClientStruct struct {
	idToken    string
	httpClient http.Client
}

type restClientMethods interface {
	Add()
	Delete()
	GetAll() ([]map[string]interface{}, error)
	Set()
}

func (c restClientStruct) Add()    {}
func (c restClientStruct) Delete() {}

// GetAll fetch all the user todos from the serverless API.
// To identify the user, the user-authenticated OAuth2 token or a Firebase ID token.
func (c restClientStruct) GetAll() ([]map[string]interface{}, error) {
	req, _ := http.NewRequest("GET", getAPIEndpoint(), nil)
	req.Header.Add("Authorization", "Bearer "+c.idToken)

	res, err := c.httpClient.Do(req)
	if err == nil {
		todos := make([]map[string]interface{}, 0)
		todosBytes, _ := ioutil.ReadAll(res.Body)
		todosParsed := gjson.ParseBytes(todosBytes).Array()

		for _, todo := range todosParsed {
			toPush := make(map[string]interface{})
			toPush["id"] = todo.Get("id").String()
			toPush["title"] = todo.Get("data.title").String()
			toPush["content"] = todo.Get("data.content").String()
			toPush["last_edited"] = todo.Get("data.last_edited").String()
			todos = append(todos, toPush)
		}

		return todos, nil
	} else {
		return nil, err
	}
}
func (c restClientStruct) Set(id string, title string, content string) error {
	reqBodyData := map[string]string{
		"title":   title,
		"content": content,
	}
	reqBody := map[string]interface{}{
		"id":   id,
		"data": reqBodyData,
	}
	reqBodyJSON, _ := json.Marshal(reqBody)
	req, _ := http.NewRequest(http.MethodPatch, getAPIEndpoint(), bytes.NewBuffer(reqBodyJSON))
	req.Header.Add("Authorization", "Bearer "+c.idToken)
	req.Header.Add("Content-Type", "application/json")

	res, err := c.httpClient.Do(req)

	if err != nil {
		return err
	}
	resBody, _ := ioutil.ReadAll(res.Body)
	resMsg := gjson.GetBytes(resBody, "message").Str
	if resMsg != "OK" {
		return errors.New("There was some problem on our side. Sorry for incovenience!!")
	}
	return nil
}

var RestClient restClientStruct = restClientStruct{
	idToken: credential.ReadCredentials().IdToken,
}
