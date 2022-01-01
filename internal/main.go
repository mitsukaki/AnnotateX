package main

import (
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

func main() {
	r := mux.NewRouter()
	r.HandleFunc("/n/{vid_id}", Index)
	r.HandleFunc("/n/{vid_id}/{anotation_id}", Index)
	r.PathPrefix("/").Handler(http.FileServer(http.Dir("./web")))
	http.Handle("/", r)

	log.Println("Listening on :3300...")
	err := http.ListenAndServe(":3300", nil)
	if err != nil {
		log.Fatal(err)
	}
}
