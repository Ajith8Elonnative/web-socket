package com.example.webSocket.Model;

import java.util.Date;

public class Message {

	private String nickname;
	private String content;
	private Date timestamp;
	public Message(String nickName, String content, Date timestamp) {
		super();
		this.nickname = nickName;
		this.content = content;
		this.timestamp = timestamp;
	}
	public Message() {
		super();
	}
	public Message(String string) {
		// TODO Auto-generated constructor stub
	}
	public String getNickName() {
		return nickname;
	}
	public void setNickName(String nickName) {
		this.nickname = nickName;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public Date getTimestamp() {
		return timestamp;
	}
	public void setTimestamp(Date timestamp) {
		this.timestamp = timestamp;
	}
	@Override
	public String toString() {
		return "Message [nickName=" + nickname + ", content=" + content + ", timestamp=" + timestamp + "]";
	} 
	
}
