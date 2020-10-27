package logging

import (
	"fmt"
	"io"
	"os"
	"runtime"

	"github.com/enescakir/emoji"
	"github.com/fatih/color"
	"github.com/mattn/go-colorable"
	"github.com/mattn/go-isatty"
)

var stdout io.Writer = colorable.NewColorableStdout()

type formatterFunc = func(str string, a ...interface{}) string

func logFactory(emoji string, fallbackEmoji string, colorMethod formatterFunc) func(str string, a ...interface{}) {
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
		fmt.Printf(str+"\n", a...)
	}
}

func Error(exitCode int, str string, a ...interface{}) {
	errorLogger := logFactory(emoji.CrossMark.String(), "!!", color.HiRedString)
	errorLogger(str, a...)
}

var Warn = logFactory(emoji.Warning.String(), "!", color.HiYellowString)
var Success = logFactory(emoji.CheckMark.String(), "!", color.HiGreenString)
var Info = logFactory(emoji.Information.String(), ">", color.HiBlueString)
