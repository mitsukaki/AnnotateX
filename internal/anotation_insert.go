package main

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"sort"

	"github.com/gorilla/mux"
)

type Anotation struct {
	Time     int
	Duration int
	Text     string
}

func AnotationInsert(w http.ResponseWriter, r *http.Request) {
	// get the video id from the url
	vars := mux.Vars(r)
	vid := vars["vid_id"]

	// get the json post body
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		// if there is an error, return a 400 error
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	// get the anotations from the leveldb
	anotations, err := db.Get([]byte(vid), nil)
	if err != nil {
		// if the anotations can't be found, send a 404 error
		if err.Error() == "leveldb: not found" {
			anotations = []byte("[]")
		} else {
			// if there is another error, send a 500 error
			http.Error(w, "Anotation fetch failed", http.StatusInternalServerError)
			return
		}
	}

	// json parse the anotations array
	var anotationsArray []Anotation
	json.Unmarshal(anotations, &anotationsArray)

	// json parse the body
	var patchArray []Anotation
	json.Unmarshal(body, &patchArray)

	// append the patch array to the anotations array
	anotationsArray = append(anotationsArray, patchArray...)

	// sort the anotations array by time
	sort.Slice(anotationsArray, func(i, j int) bool {
		return anotationsArray[i].Time < anotationsArray[j].Time
	})

	// json encode the anotations
	anotations, err = json.Marshal(anotationsArray)
	if err != nil {
		// if there is an error, return a 500 error
		http.Error(w, "Anotation insert failed", http.StatusInternalServerError)
		return
	}

	// write the anotations to the leveldb
	err = db.Put([]byte(vid), anotations, nil)
	if err != nil {
		// if there is an error, return a 500 error
		http.Error(w, "Anotation insert failed", http.StatusInternalServerError)
		return
	}

	// send a success status
	w.WriteHeader(http.StatusOK)
}
