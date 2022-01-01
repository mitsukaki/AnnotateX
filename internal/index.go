package main

import "net/http"

func Index(w http.ResponseWriter, r *http.Request) {
	// serve the player file
	http.ServeFile(w, r, "./web/player.html")
}
