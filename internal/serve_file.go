package main

import (
	"net/http"
)

func ServeFile(w http.ResponseWriter, r *http.Request) {
	http.FileServer(http.Dir("web")).ServeHTTP(w, r)
}
