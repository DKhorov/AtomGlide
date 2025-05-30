import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import './Chat.css';

const emojis = [
  '😀', '😂', '😍', '😊', '😎', '😜', '🤩', '🥳', '😇', '🤪',
  '😘', '🥰', '😋', '🤗', '🤔', '😏', '😒', '😞', '😢', '😠',
  '😳', '🤯', '😱', '🤢', '😴', '😈', '👻', '💩', '🤡', '👽',
  '👍', '👎', '❤️', '🔥', '🎉', '💯', '✨', '🌟', '🙏', '🤝',
  '👏', '🙈', '🙉', '🙊', '💋', '💔', '💖', '💘', '💝', '💤'
];

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [avatarColor, setAvatarColor] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const socket = useRef();
  const messagesEndRef = useRef(null);
  const chatMainRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const savedName = localStorage.getItem('chatUsername');
    const savedColor = localStorage.getItem('avatarColor');
    
    if (savedName && savedColor) {
      setUserName(savedName);
      setAvatarColor(savedColor);
      connectToServer(savedName, savedColor);
      setIsModalVisible(false);
    }

    return () => {
      if (socket.current) socket.current.disconnect();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, showEmojiPicker]);

  const connectToServer = (name, color) => {
    setConnectionStatus('connecting');
    
    socket.current = io(process.env.REACT_APP_API_BASE_URL, {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ['websocket']
    });

    socket.current.on('connect', () => {
      setConnectionStatus('connected');
      socket.current.emit('registerUser', {
        userId: localStorage.getItem('userId') || Date.now().toString(),
        userName: name
      });
    });

    socket.current.on('disconnect', () => {
      setConnectionStatus('disconnected');
    });

    socket.current.on('connect_error', () => {
      setConnectionStatus('error');
    });

    socket.current.on('messageHistory', (history) => {
      setMessages(history);
    });

    socket.current.on('receiveMessage', (newMessage) => {
      setMessages(prev => [...prev, newMessage]);
    });
  };

  const handleUserRegistration = () => {
    const name = userName || 'Аноним';
    const color = avatarColor || `#${Math.floor(Math.random()*16777215).toString(16)}`;
    
    setUserName(name);
    setAvatarColor(color);
    localStorage.setItem('chatUsername', name);
    localStorage.setItem('avatarColor', color);
    localStorage.setItem('userId', Date.now().toString());
    setIsModalVisible(false);
    connectToServer(name, color);
  };

  const scrollToBottom = () => {
    if (chatMainRef.current) {
      setTimeout(() => {
        chatMainRef.current.scrollTo({
          top: chatMainRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }, 100);
    }
  };

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      socket.current.emit('sendMessage', {
        userName,
        text: inputMessage,
        avatarColor,
        isSticker: false
      });
      setInputMessage('');
      setShowEmojiPicker(false);
      inputRef.current.focus();
    }
  };

  const handleSendSticker = (emoji) => {
    socket.current.emit('sendMessage', {
      userName,
      text: emoji,
      avatarColor,
      isSticker: true
    });
    setShowEmojiPicker(false);
    inputRef.current.focus();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-app">
      {/* Модальное окно подключения */}
      {isModalVisible && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Подключение к чату</h2>
            </div>
            <div className="modal-body">
              <div className="connection-form">
                <input
                  type="text"
                  placeholder="Введите ваше имя"
                  className="name-input"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
                <button 
                  className="connect-button"
                  onClick={handleUserRegistration}
                >
                  Подключиться
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Шапка чата */}
      <header className="chat-header">
        <div className="header-content">
          <div className="chat-title">
            Чат сообщества
            <span className="connection-status" style={{ 
              color: connectionStatus === 'connected' ? '#52c41a' : 
                     connectionStatus === 'connecting' ? '#faad14' : 
                     connectionStatus === 'error' ? '#f5222d' : '#d9d9d9'
            }}>
              {connectionStatus === 'connected' ? ' онлайн' : ' офлайн'}
            </span>
          </div>
        </div>
      </header>

      {/* Основное содержимое чата */}
      <main className="chat-main" ref={chatMainRef}>
        <div className="messages-list">
          {messages.map((item, index) => (
            <div key={index} className={`message-item ${item.isSticker ? 'sticker-message' : ''}`}>
              <div className="message-content">
                <div 
                  className="user-avatar" 
                  style={{ backgroundColor: item.avatarColor }}
                >
                  {item.user ? item.user.charAt(0).toUpperCase() : 'A'}
                </div>
                <div className="message-text">
                  <div className="message-meta">
                    <span className="message-user">{item.user || 'Аноним'}</span>
                    <span className="message-time">
                      {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="message-body">
                    {item.isSticker ? (
                      <span className="sticker">{item.text}</span>
                    ) : (
                      item.text
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Плавающая панель смайликов */}
      {showEmojiPicker && (
        <div className="emoji-panel floating">
          <div className="emoji-grid">
            {emojis.map((emoji, index) => (
              <button
                key={index}
                className="emoji-button"
                onClick={() => handleSendSticker(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Панель ввода сообщения */}
      <footer className="chat-footer">
        <div className="message-input-container">
          <button
            className="emoji-toggle"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            😊
          </button>
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Напишите сообщение..."
            className="message-input"
          />
          <button
            className="send-button"
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
          >
            Отпр.
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Chat;