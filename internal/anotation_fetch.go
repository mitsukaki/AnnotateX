package main

import (
	"net/http"

	"github.com/gorilla/mux"
)

func AnotationFetch(w http.ResponseWriter, r *http.Request) {
	// get the video id from the url
	vars := mux.Vars(r)
	vid := vars["vid_id"]

	// get the anotations from the leveldb
	anotations, err := db.Get([]byte(vid), nil)
	if err != nil {
		// if the anotations can't be found, send a 404 error
		if err.Error() == "leveldb: not found" {
			http.Error(w, "Anotation not found", http.StatusNotFound)
			return
		}

		// if there is another error, send a 500 error
		http.Error(w, "Anotation fetch failed", http.StatusInternalServerError)
		return
	}

	// send the anotations as the JSON response
	w.Header().Set("Content-Type", "application/json")
	w.Write(anotations)
}
