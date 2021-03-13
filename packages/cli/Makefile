.PHONY: build/single build clean
.DEFAULT_GOAL := build/single

ifeq ($(OS),Windows_NT)
	DEV_EXE_NAME += ./build/look.exe
else
	DEV_EXE_NAME += ./build/look
endif

DEV_VER := $$(git rev-parse --short HEAD)

build/single:
ifeq (${PROD},1)
	go build -ldflags "-s -w -X 'lookahead.web.app/cli/internal/version.Version=$(DEV_VER)'" -o $(DEV_EXE_NAME) ./main.go
else
	go build -ldflags "-s -w" -o $(DEV_EXE_NAME) ./main.go
endif
install:
	cp $(DEV_EXE_NAME) ${GOPATH}/bin
build:
	make -j3 \
	build/win \
	build/darwin \
	build/linux
build/win:
ifeq (${PROD},1)
ifeq (${RELEASE},1)
	GOOS=windows GOARCH=amd64 go build -ldflags "-s -w -X 'lookahead.web.app/cli/internal/version.Version=$$(git describe --abbrev=0)'" -o ./build/win32-amd64/look.exe ./main.go
else
	GOOS=windows GOARCH=amd64 go build -ldflags "-s -w -X 'lookahead.web.app/cli/internal/version.Version=$(DEV_VER)'" -o ./build/win32-amd64/look.exe ./main.go
endif
else
	GOOS=windows GOARCH=amd64 go build -ldflags "-s -w -X 'lookahead.web.app/cli/internal/version.Version=$(DEV_VER)'" -o ./build/win32-amd64/look.exe ./main.go
endif

build/linux:
ifeq (${PROD},1)
ifeq (${RELEASE},1)
	GOOS=linux GOARCH=amd64 go build -ldflags "-s -w -X 'lookahead.web.app/cli/internal/version.Version=$$(git describe --abbrev=0)'" -o ./build/win32-amd64/look.exe ./main.go
else
	GOOS=linux GOARCH=amd64 go build -ldflags "-s -w -X 'lookahead.web.app/cli/internal/version.Version=$(DEV_VER)'" -o ./build/win32-amd64/look.exe ./main.go
endif
else
	GOOS=linux GOARCH=amd64 go build -ldflags "-s -w -X 'lookahead.web.app/cli/internal/version.Version=$(DEV_VER)'" -o ./build/win32-amd64/look.exe ./main.go
endif

build/macos:
ifeq (${PROD},1)
ifeq (${RELEASE},1)
	GOOS=darwin GOARCH=amd64 go build -ldflags "-s -w -X 'lookahead.web.app/cli/internal/version.Version=$$(git describe --abbrev=0)'" -o ./build/win32-amd64/look.exe ./main.go
else
	GOOS=darwin GOARCH=amd64 go build -ldflags "-s -w -X 'lookahead.web.app/cli/internal/version.Version=$(DEV_VER)'" -o ./build/win32-amd64/look.exe ./main.go
endif
else
	GOOS=darwin GOARCH=amd64 go build -ldflags "-s -w -X 'lookahead.web.app/cli/internal/version.Version=$(DEV_VER)'" -o ./build/win32-amd64/look.exe ./main.go
endif

archive:
	go run scripts/archive/archive.go
clean:
	rm -rf build/
command:
	cobra add $(name) -a "Pranav Karawale"