package com.example.webSocket.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.webSocket.Model.Message;

public interface WebSocketRepo extends MongoRepository<Message, String> {

}
