package util

import (
	"fmt"
	"testing"
	"time"

	"github.com/tidwall/gjson"
)

func BenchmarkDateJSONToTimestamp(b *testing.B) {
	for i := 0; i < b.N; i++ {
		DateJSONToTimestamp("{\"date\" : \"1 Jan 2021\", \"time\" : \"00:10\"}")
	}
}

func TestDateJSONToTimestamp(t *testing.T) {
	var shouldGive int64 = time.Date(2021, time.January, 1, 0, 10, 0, 0, time.Local).Unix()
	res := DateJSONToTimestamp("{\"date\" : \"1 Jan 2021\", \"time\" : \"00:10\"}")
	if shouldGive != res {
		t.Logf("Expected %v", shouldGive)
		t.Logf("Got %v", res)
		t.FailNow()
	}
}

func TestMakeCurrDate(t *testing.T) {
	now := time.Now()
	//Most likely a minute is going to pass which can fail our tests
	//So let the minute pass
	if now.Second() > 50 {
		time.Sleep(time.Second * time.Duration(59-now.Second()))
	}
	now = time.Now()
	dateJSON := MakeCurrDate()
	shouldBeDateJSON := fmt.Sprintf(`{"date":"%v %s, %v","time":"%v:%v"}`,
		now.Local().Day(), time.Month(now.Local().Month()).String()[:3], now.Local().Year(), now.Local().Hour(), now.Local().Minute())
	date := gjson.Parse(dateJSON).Value().(map[string]interface{})
	shouldBeDate := gjson.Parse(shouldBeDateJSON).Value().(map[string]interface{})

	if date["date"] != shouldBeDate["date"] && date["time"] != shouldBeDate["time"] {
		t.Logf("Expected %s", shouldBeDate)
		t.Logf("Got %s", date)
		t.FailNow()
	}
}
