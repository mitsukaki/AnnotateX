package main

import (
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/syndtr/goleveldb/leveldb"
)

var db *leveldb.DB

func main() {
	// open the database
	var err error
	db, err = leveldb.OpenFile("./db", nil)
	if err != nil {
		log.Fatal(err)
	}

	defer db.Close()

	// create a new router
	r := mux.NewRouter()

	// Route handles & endpoints
	r.HandleFunc("/n/{vid_id}", Index)
	r.HandleFunc("/api/anotations/{vid_id}", AnotationFetch).Methods("GET")
	r.HandleFunc("/api/anotations/{vid_id}", AnotationInsert).Methods("POST")

	// serve files too!
	r.PathPrefix("/").Handler(http.FileServer(http.Dir("./web")))

	http.Handle("/", r)

	// listen on port 3300
	log.Println("Listening on :3300...")
	err = http.ListenAndServe(":3300", nil)
	if err != nil {
		log.Fatal(err)
	}
}
