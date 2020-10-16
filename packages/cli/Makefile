.PHONY: build
build:
	go build -ldflags "-s -w -X 'lookahead.web.app/cli/cmd.Version=v1.0.0'" -o ./build/look.exe ./main.go
command:
	cobra add $(name) -a "Pranav Karawale"