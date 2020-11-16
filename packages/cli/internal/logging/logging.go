package logging

import (
	"fmt"
	"io"
	"os"
	"runtime"
	"time"

	"github.com/briandowns/spinner"
	"github.com/enescakir/emoji"
	"github.com/fatih/color"
	"github.com/mattn/go-colorable"
	"github.com/mattn/go-isatty"
)

var stdout io.Writer = colorable.NewColorableStdout()

type formatterFunc = func(str string, a ...interface{}) string

func logFactory(emoji string, fallbackEmoji string, colorMethod formatterFunc, newLine bool) func(str string, a ...interface{}) {
	return func(str string, a ...interface{}) {
		switch runtime.GOOS {
		case "windows":
			switch isatty.IsCygwinTerminal(os.Stdout.Fd()) {
			case true:
				fmt.Print(emoji + " ")
			case false:
				fmt.Fprint(stdout, colorMethod(fallbackEmoji+" "))
			}
		default:
			fmt.Print(emoji + " ")
		}
		if newLine {

			fmt.Printf(str+"\n", a...)
		} else {
			fmt.Printf(str, a...)
		}
	}
}

func Error(exitCode int, str string, a ...interface{}) {
	errorLogger := logFactory(emoji.CrossMark.String(), "!!", color.HiRedString, true)
	errorLogger(str, a...)
	os.Exit(exitCode)
}

var Warn = logFactory(emoji.Warning.String(), "!", color.HiYellowString, true)
var Success = logFactory(emoji.CheckMark.String(), "!", color.HiGreenString, true)
var Info = logFactory(emoji.Information.String(), ">", color.HiBlueString, true)
var Ask = logFactory(emoji.QuestionMark.String(), "?", color.HiCyanString, false)

//DarkSpinner Factory function that returns a spinner with gray color
func DarkSpinner(format string, a ...interface{}) *spinner.Spinner {
	s := spinner.New(spinner.CharSets[9], 100*time.Millisecond)
	s.Color("fgHiBlack")
	s.Suffix = color.HiBlackString(format, a...)
	return s
}
