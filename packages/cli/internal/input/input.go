package input

import (
	"bufio"
	"os"
	"strings"

	"github.com/fatih/color"
	"lookahead.web.app/cli/internal/logging"
)

//Input accepts input from the end user.
//It will stop after user hits the enter key
//
//Parameters:
//question The input question to be displayed before input
func Input(question string) string {
	logging.Ask(question)
	reader := bufio.NewReader(os.Stdin)
	answer, _ := reader.ReadString(byte('\n'))
	answer = strings.Trim(answer, "\n")
	answer = strings.Trim(answer, "\r")
	return answer
}

func Confirm(question string) bool {
	confirmed := false
	logging.Ask(question + " [y/N]: ")
	reader := bufio.NewReader(os.Stdin)
	answer, _ := reader.ReadString(byte('\n'))
	answer = strings.Trim(answer, "\n")
	answer = strings.Trim(answer, "\r")
	if answer == "y" || answer == "Y" {
		confirmed = true
	}
	return confirmed
}

//MultilineInput accepts input from the end user, but supports multiline.
//
//The strategy is :
//Use a bufio scanner, scan till we hit a delimiter.
//
//Parameters:
//
//question The input question to be displayed before input
func MultilineInput(question string) string {
	logging.Ask(question)
	color.Cyan(" [Enter 2 blank lines to exit]\n")
	scanner := bufio.NewScanner(os.Stdin)
	answer := ""
	newLineCount := 0
	for scanner.Scan() {
		rawBytes := scanner.Bytes()
		if len(rawBytes) == 0 {
			if newLineCount == 1 {
				break
			} else {
				newLineCount += 1
			}
		} else {
			newLineCount = 0
		}
		if scanner.Text() != "" {
			answer += scanner.Text() + "\n"
		}
	}
	answer = strings.Trim(answer, "\n")
	answer = strings.Trim(answer, "\r")
	return answer
}
