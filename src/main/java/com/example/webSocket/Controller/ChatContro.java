package com.example.webSocket.Controller;

import java.util.Date;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.webSocket.Model.Message;
import com.example.webSocket.Repository.WebSocketRepo;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/chat")
public class ChatContro {
	@Autowired
	private SimpMessagingTemplate messagingTemplate;
	@Autowired
	private WebSocketRepo webSocketRepo;
	
	@MessageMapping("/chat")
    @SendTo("/topic/messages")
    public Message sendMessage(@Payload Message message) {
       message.setTimestamp(new Date()); // Set the current timestamp
       messagingTemplate.convertAndSend("/topic/messages", "success");
        return message ;
    }
	
//	@PostMapping("/create")
//	public ResponseEntity<?> saveMessage(@RequestBody Message message) {
//		Message saved =repo.save(message);
//		simpMessagingTemplate.convertAndSend("/topic/notification", "success");
//		return ResponseEntity.ok().body(saved);
//	}
//	
	@GetMapping("/getAll")
	public ResponseEntity<?> getChat(){
		List<Message>getAllChat = webSocketRepo.findAll();
		return ResponseEntity.ok().body(getAllChat);
	}
	
}
