package http

import (
	"io"
	"net/http"
)

func Get(url string) (string, error) {
	res, err := http.Get(url)
	if err != nil {
		return "", err
	} else {
		body, _ := io.ReadAll(res.Body)
		return string(body), nil
	}
}

func Post(url string, headers map[string]string, body io.Reader) (string, error) {
	client := &http.Client{}
	req, _ := http.NewRequest("POST", url, body)
	for k, v := range headers {
		req.Header.Set(k, v)
	}
	res, err := client.Do(req)
	if err != nil {
		return "", err
	} else {
		body, _ := io.ReadAll(res.Body)
		return string(body), nil
	}
}
