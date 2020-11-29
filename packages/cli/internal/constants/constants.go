package constants

import (
	"os"
	"path"
)

var userDir, _ = os.UserHomeDir()

//CONFIG_PATH The directory for Lookahead to store config/log files
var CONFIG_PATH string = path.Join(userDir, ".config", "lookahead")
