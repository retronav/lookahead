package main

import (
	"archive/zip"
	"compress/gzip"
	"fmt"
	"io"
	"os"
	"path/filepath"
)

func main() {
	//Windows build
	if err := zipFiles("./build/look_win32_amd64.zip", []string{"./build/win32-amd64/look.exe"}); err != nil {
		panic(err)
	}
	//Darwin & Linux builds
	if err := gzipFile("./build/darwin-amd64/look", "./build/look_darwin_amd64.gz"); err != nil {
		panic(err)
	}
	if err := gzipFile("./build/linux-amd64/look", "./build/look_linux_amd64.gz"); err != nil {
		panic(err)
	}
}

// zipFiles compresses one or many files into a single zip archive file.
// Param 1: filename is the output zip file's name.
// Param 2: files is a list of files to add to the zip.
// Credits: https://golangcode.com/create-zip-files-in-go/
func zipFiles(filename string, files []string) error {

	newZipFile, err := os.Create(filename)
	if err != nil {
		return err
	}
	defer newZipFile.Close()

	zipWriter := zip.NewWriter(newZipFile)
	defer zipWriter.Close()

	// Add files to zip
	for _, file := range files {
		if err = AddFileToZip(zipWriter, file); err != nil {
			return err
		}
	}
	fmt.Println("Created zip file:", filename)
	return nil
}

func AddFileToZip(zipWriter *zip.Writer, filename string) error {

	fileToZip, err := os.Open(filename)
	if err != nil {
		return err
	}
	defer fileToZip.Close()

	// Get the file information
	info, err := fileToZip.Stat()
	if err != nil {
		return err
	}

	header, err := zip.FileInfoHeader(info)
	if err != nil {
		return err
	}

	// Change to deflate to gain better compression
	// see http://golang.org/pkg/archive/zip/#pkg-constants
	header.Method = zip.Deflate

	writer, err := zipWriter.CreateHeader(header)
	if err != nil {
		return err
	}
	_, err = io.Copy(writer, fileToZip)
	return err
}

//Credits: https://golangdocs.com/tar-gzip-in-golang#2-zipping-files-with-gzip
//gzipFile creates gzip of source and saves it at target
func gzipFile(source, target string) error {
	reader, err := os.Open(source)
	if err != nil {
		return err
	}

	filename := filepath.Base(source)
	writer, err := os.Create(target)
	if err != nil {
		return err
	}
	defer writer.Close()

	archiver := gzip.NewWriter(writer)
	archiver.Name = filename
	defer archiver.Close()

	_, err = io.Copy(archiver, reader)
	fmt.Println("Created gzip file:", target)
	return err
}
