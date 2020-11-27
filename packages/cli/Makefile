.PHONY: build/single build clean
.DEFAULT_GOAL := build/single

ifeq ($(OS),Windows_NT)
	DEV_EXE_NAME += ./build/look.exe
else
	DEV_EXE_NAME += ./build/look
endif

FIXEDVERSION := FixedVersion

build/single:
	go build -ldflags "-s -w -X 'lookahead.web.app/cli/internal/version.Version=$(FIXEDVERSION)'" -o $(DEV_EXE_NAME) ./main.go
install:
	cp $(DEV_EXE_NAME) ${GOPATH}/bin
build:
	make -j3 \
	build/win \
	build/darwin \
	build/linux
build/win:
ifeq (${FIXEDVER},1)
	GOOS=windows GOARCH=amd64 go build -ldflags "-s -w -X 'lookahead.web.app/cli/internal/version.Version=$(FIXEDVERSION)'" -o ./build/win32-amd64/look.exe ./main.go
else
	GOOS=windows GOARCH=amd64 go build -ldflags "-s -w -X 'lookahead.web.app/cli/internal/version.Version=$$(git describe --abbrev=0 --tags)'" -o ./build/win32-amd64/look.exe ./main.go
endif
build/darwin:
ifeq (${FIXEDVER},1)
	GOOS=darwin GOARCH=amd64 go build -ldflags "-s -w -X 'lookahead.web.app/cli/internal/version.Version=$(FIXEDVERSION)'" -o ./build/darwin-amd64/look ./main.go
else
	GOOS=darwin GOARCH=amd64 go build -ldflags "-s -w -X 'lookahead.web.app/cli/internal/version.Version=$$(git describe --abbrev=0 --tags)'" -o ./build/darwin-amd64/look ./main.go
endif
build/linux:
ifeq (${FIXEDVER},1)
	GOOS=linux GOARCH=amd64 go build -ldflags "-s -w -X 'lookahead.web.app/cli/internal/version.Version=$(FIXEDVERSION)'" -o ./build/linux-amd64/look ./main.go
else
	GOOS=linux GOARCH=amd64 go build -ldflags "-s -w -X 'lookahead.web.app/cli/internal/version.Version=$$(git describe --abbrev=0 --tags)'" -o ./build/linux-amd64/look ./main.go
endif
archive:
	go run scripts/archive/archive.go
clean:
	rm -rf build/
command:
	ifeq ($(name),"")
		$(error Please supply a name to generate command)
	endif
	cobra add $(name) -a "Pranav Karawale"