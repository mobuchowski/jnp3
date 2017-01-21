package main

import (
	"database/sql"
	"fmt"
	"bytes"
)


type Hub struct {
	db * sql.DB
	// Registered clients.
	clients map[*Client]bool

	// Inbound messages from the clients.
	broadcast chan Message

	// Register requests from the clients.
	register chan *Client

	// Unregister requests from clients.
	unregister chan *Client
}

func NewHub(d * sql.DB) *Hub {
	return &Hub{
		db:         d,
		broadcast:  make(chan Message),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		clients:    make(map[*Client]bool),
	}
}

func checkCount(rows *sql.Rows) (count int) {
	for rows.Next() {
		rows.Scan(&count)
	}
	return count
}


func (h *Hub) checkFriends(token []byte, rhs int) bool {
	qstring := fmt.Sprintf("SELECT * FROM api_user_friends A join authtoken_token B ON A.from_user_id=B.user_id" +
		" WHERE B.key='%s' AND from_user_id=B.user_id AND to_user_id=%d", token, rhs)
	rows, err := h.db.Query(qstring)
	if err != nil {
		panic(err)
	}
	if checkCount(rows) != 1 {
		return false
	}
	return true
}

func (h *Hub) Run() {
	for {
		select {
		case client := <-h.register:
			h.clients[client] = true
		case client := <-h.unregister:
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				close(client.send)
			}
		case message := <-h.broadcast:
			for client := range h.clients {
				if bytes.Equal(client.id, message.receiver) {
					select {
					case client.send <- message:
					default:
						close(client.send)
						delete(h.clients, client)
					}
				}
			}
		}
	}
}
