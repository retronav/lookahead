package constants

import (
	"os"
	"path/filepath"
)

var userDir, _ = os.UserHomeDir()

//CONFIG_PATH The directory for Lookahead to store config/log files
var CONFIG_PATH string = filepath.Join(userDir, ".config", "lookahead")
