package main

import (
	"flag"
	"log"
	"net/http"
	"fmt"
	"database/sql"
	_ "github.com/lib/pq"
)

const (
	DB_USER     = "jnp3"
	DB_NAME     = "ebdb"
	DB_PASSWORD = "passpass"
	DB_HOST     = "aaubvv9l0hts00.csxu6zpuvsxt.eu-central-1.rds.amazonaws.com"
)


var addr = flag.String("addr", ":8080", "http service address")

func main() {
	connstring := fmt.Sprintf("dbname=%s user=%s password=%s host=%s", DB_NAME, DB_USER, DB_PASSWORD, DB_HOST)

	db, err := sql.Open("postgres", connstring)
	if err != nil {
		panic(err)
	}

	flag.Parse()
	hub := NewHub(db)
	go hub.Run()
	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		ServeWs(hub, w, r)
	})
	err = http.ListenAndServe(*addr, nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}