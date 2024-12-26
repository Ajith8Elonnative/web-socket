import React, { useState, useEffect } from 'react';
import {
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  CircularProgress,
} from '@mui/material';
import Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import axios from "axios"

const App = () => {
  const [messages, setMessages] = useState([]);
  console.log(messages)
  const [message, setMessage] = useState('');
  const [nickname, setNickname] = useState('');
  const [stompClient, setStompClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  // Send message logic
  const sendMessage = () => {
    const trimmedNickname = nickname.trim() || 'Anonymous'; // Default to 'Anonymous' if nickname is empty

    if (message.trim() && trimmedNickname && stompClient && stompClient.connected) {
      const chatMessage = {
        nickname: trimmedNickname, // Use validated nickname here
        content: message,
      };
      stompClient.send('/app/chat', {}, JSON.stringify(chatMessage));
      setMessage('');
    }
  };

  // WebSocket connection
  useEffect(() => {
    const socket = new SockJS('http://localhost:6001/ws');
    const client = Stomp.over(socket);
    localStorage.setItem("value", "success")
    client.connect({}, (frame) => {
      console.log('Connected to WebSocket server:', frame);
      setIsConnected(true);
      setLoading(false);
      client.subscribe('/topic/jobStatus', (message) => {
        const receivedMessage = message.body;
        setMessages((prevMessages) => [...prevMessages, receivedMessage]);
        const matchItem = localStorage.getItem("value")
        if (receivedMessage != null) {
          fetchMessages()
        }
      });

    }, (error) => {
      console.error('Error connecting to WebSocket:', error);
      setLoading(false);
    });
    setStompClient(client);

    // Cleanup WebSocket connection when component unmounts
    return () => {
      if (client && client.connected) {
        client.disconnect();
      }
    };
  }, []); // Empty dependency array ensures this effect runs only once (on mount)

  const handleNicknameChange = (event) => {
    setNickname(event.target.value);
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  // Check nickname before sending a message
  const handleSendMessage = () => {
    if (!nickname.trim()) {
      alert('Please enter a nickname');
      return;
    }
    sendMessage();
  };
  const fetchMessages = async () => {
    try {
      const response = await axios.get('http://localhost:6001/api/beacon/get_all');
      console.log(response)
      setMessages(response.data.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };



  return (
    <div>
      {loading && (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <CircularProgress />
          <Typography variant="h6">Connecting...</Typography>
        </div>
      )}

      {!loading && !isConnected && (
        <Typography variant="h6" color="error" align="center">
          Failed to connect to WebSocket.
        </Typography>
      )}

      <List>
        {messages?.map((msg, index) => (
          <ListItem key={msg.id}>
            <ListItemAvatar>
              <Avatar>{nickname.charAt(0).toUpperCase()}</Avatar>
              {/* Display first letter of nickname */}
            </ListItemAvatar>
            <ListItemText
              primary={<Typography variant="subtitle1">{nickname}</Typography>}
              secondary={msg.content}
            />
          </ListItem>
        ))}
      </List>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <TextField
          placeholder="Enter your nickname"
          value={nickname}
          onChange={handleNicknameChange}
          autoFocus
          disabled={loading || !isConnected}
          fullWidth
        />
        <TextField
          placeholder="Type a message"
          value={message}
          onChange={handleMessageChange}
          fullWidth
          disabled={loading || !isConnected || !nickname}
        />
        <IconButton
          onClick={handleSendMessage}
          disabled={!message.trim() || !nickname.trim() || !isConnected}
        >
          Send
        </IconButton>
      </div>
      <table style={{borderCollapse:"collapse", width:"60%", marginTop:"30px"}}>
  
  <tr style={{backgroundColor:"#ccc", fontWeight:"bold"}}>
    <td style={{border:"1px solid #ddd",padding:"8px"}}>gmac</td>
    <td style={{border:"1px solid #ddd",padding:"8px"}}>msg</td>
    <td style={{border:"1px solid #ddd",padding:"8px"}}>model</td>
    <td style={{border:"1px solid #ddd",padding:"8px"}}>uptime</td>
  </tr>
  {messages?.map((msg, index) => {
    return (
      <tr key={msg?.id}>
      <td style={{border:"1px solid #ddd",padding:"8px"}}>{msg.data?.gmac}</td>
      <td style={{border:"1px solid #ddd",padding:"8px"}}>{msg.data?.data?.msg}</td>
      <td style={{border:"1px solid #ddd",padding:"8px"}}>{msg.data?.data?.model}</td>
      <td style={{border:"1px solid #ddd",padding:"8px"}}>{msg.data?.data?.uptime}</td>
    </tr>
    )
})}
  
</table>

    </div>
  );
};

export default App;