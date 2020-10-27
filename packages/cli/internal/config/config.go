package config

import (
	"github.com/spf13/viper"
	"lookahead.web.app/cli/internal/logging"
)

func CheckConfigValidity() {
	if viper.GetInt("limitEntries") <= 0 {
		logging.Error(1, "`limitEntries must be more than 0!`")
	}
}
