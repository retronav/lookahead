.PHONY: dev build clean
.DEFAULT_GOAL := dev
dev:
	go build -ldflags "-s -w" -o ./build/look.exe ./main.go
test:
	go build -ldflags "-s -w -X 'lookahead.web.app/cli/internal/version.Version=Test'" -o ./build/look.exe ./main.go
build:
	make -j3 \
	build-win \
	build-darwin \
	build-linux
build-win:
	GOOS=windows GOARCH=amd64 go build -ldflags "-s -w -X 'lookahead.web.app/cli/internal/version.Version=$$(git describe --abbrev=0 --tags)'" -o ./build/win32-amd64/look.exe ./main.go
build-darwin:
	GOOS=darwin GOARCH=amd64 go build -ldflags "-s -w -X 'lookahead.web.app/cli/internal/version.Version=$$(git describe --abbrev=0 --tags)'" -o ./build/darwin-amd64/look ./main.go
build-linux:
	GOOS=linux GOARCH=amd64 go build -ldflags "-s -w -X 'lookahead.web.app/cli/internal/version.Version=$$(git describe --abbrev=0 --tags)'" -o ./build/linux-amd64/look ./main.go
archive:
	go run scripts/archive/archive.go
clean:
	rm -rf build/
command:
	cobra add $(name) -a "Pranav Karawale"