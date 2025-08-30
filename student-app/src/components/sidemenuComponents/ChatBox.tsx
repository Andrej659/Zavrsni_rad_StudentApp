import React, { useEffect, useState, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import "../../css/ChatBox.css";

const WEBSOCKET_BASE = "http://localhost:8080/chat";

interface User {
  userID: number;
  username: string;
}

interface Message {
  msgID: number;
  msgContent: string;
  msgTimeSent: string;
  user: {
    userID: number;
    username: string;
  };
  academicYear: {
    academicYearID: number;
  };
}

interface Props {
  academicYearId: number;
}

const getUserFromToken = (): User | null => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      userID: payload.userID || payload.id,
      username: payload.username,
    };
  } catch {
    return null;
  }
};

const ChatBox: React.FC<Props> = ({ academicYearId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const clientRef = useRef<Client | null>(null);
  const [connected, setConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const loggedInUser = getUserFromToken();
  const [selectedMessageId, setSelectedMessageId] = useState<number | null>(
    null
  );

  useEffect(() => {
    if (!academicYearId) return;
    const token = localStorage.getItem("token");

    fetch(`http://localhost:8080/api/messages?yearId=${academicYearId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Greška " + res.status);
        return res.json();
      })
      .then((data) => setMessages(data))
      .catch((err) => {
        console.error("Ne mogu dohvatiti poruke:", err);
        setMessages([]);
      });
  }, [academicYearId]);

  const fetchAllMessages = () => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:8080/api/messages?yearId=${academicYearId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch((err) => {
        console.error("Ne mogu dohvatiti poruke:", err);
        setMessages([]);
      });
  };

  useEffect(() => {
    if (!academicYearId) return;

    const socket = new SockJS(WEBSOCKET_BASE);
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        setConnected(true);
        client.subscribe(`/topic/messages/${academicYearId}`, () => {
          fetchAllMessages();
        });
      },
      onDisconnect: () => setConnected(false),
      debug: () => {},
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
      setConnected(false);
    };
  }, [academicYearId]);

  const handleRemove = async (msgId: number) => {
    const confirm = window.confirm(
      "Jesi li siguran da želiš obrisati ovu poruku?"
    );
    if (!confirm) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8080/api/messages/${msgId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Greška pri brisanju poruke");

      console.log("Poruka obrisana:", msgId);
      setSelectedMessageId(null);
      await fetchAllMessages();
    } catch (error) {
      console.error("Greška u brisanju:", error);
      alert("Neuspješno brisanje poruke.");
    }
  };

  const sendMessage = () => {
    if (!messageInput || !connected || !loggedInUser) return;

    const messageDTO = {
      userId: loggedInUser.userID,
      academicYearId: academicYearId,
      msgContent: messageInput,
      msgTimeSent: new Date().toISOString().slice(0, 16),
    };

    clientRef.current!.publish({
      destination: `/app/send/${academicYearId}`,
      body: JSON.stringify(messageDTO),
    });
    setMessageInput("");
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
      <div
        ref={messagesEndRef}
        style={{
          minHeight: 400,
          maxHeight: 500,
          overflowY: "auto",
          border: "1px solid #ccc",
          borderRadius: 8,
          padding: 16,
          marginBottom: 12,
          background: "#fafbfc",
        }}
      >
        {messages.map((msg, idx) => {
          const isMine = msg.user.userID === loggedInUser?.userID;
          const isSelected = selectedMessageId === msg.msgID;

          return (
            <div
              key={msg.msgID ? `${msg.msgID}-${idx}` : `fallback-${idx}`}
              style={{
                display: "flex",
                justifyContent: isMine ? "flex-end" : "flex-start",
                marginBottom: 8,
                position: "relative",
              }}
              onClick={() =>
                isMine
                  ? setSelectedMessageId(isSelected ? null : msg.msgID)
                  : null
              }
            >
              {!isMine && (
                <div style={{ marginRight: 8, fontSize: 12, color: "#236" }}>
                  <b>{msg.user.username.split("@")[0] || "Student"}</b>
                </div>
              )}
              <div
                style={{
                  maxWidth: 280,
                  padding: "10px 16px",
                  borderRadius: 18,
                  background: isMine ? "#DCF8C6" : "#F0F0F0",
                  color: isMine ? "#222" : "#333",
                  alignSelf: isMine ? "flex-end" : "flex-start",
                  boxShadow: "0 2px 4px #0001",
                  cursor: isMine ? "pointer" : "default",
                }}
              >
                {msg.msgContent}
                <div
                  style={{
                    fontSize: 11,
                    color: "#888",
                    marginTop: 4,
                    textAlign: isMine ? "right" : "left",
                  }}
                >
                  {msg.msgTimeSent
                    ? new Date(msg.msgTimeSent).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </div>

                {isMine && isSelected && (
                  <div
                    style={{
                      position: "absolute",
                      top: -40,
                      right: 0,
                      background: "#fff",
                      border: "1px solid #ccc",
                      borderRadius: 8,
                      padding: "4px 8px",
                      display: "flex",
                      gap: 8,
                      zIndex: 5,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(msg.msgID);
                      }}
                      style={{
                        fontSize: 12,
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#d33",
                      }}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <input
          className="form-input"
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 12,
            border: "1px solid #bbb",
          }}
          placeholder="Upiši poruku..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          disabled={!connected}
        />
        <button
          onClick={sendMessage}
          style={{
            padding: "8px 18px",
            borderRadius: 12,
            border: "none",
            background: "#1464F4",
            color: "#fff",
            fontWeight: "bold",
          }}
          disabled={!connected}
        >
          Pošalji
        </button>
      </div>

      {!connected && (
        <div style={{ color: "#d33", fontSize: 13, marginTop: 4 }}>
          Nisi spojen na chat...
        </div>
      )}
    </div>
  );
};

export default ChatBox;
