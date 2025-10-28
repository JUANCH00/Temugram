import React, { useState, useEffect } from 'react';
import { MessageSquare, Reply, Clock, Server, RefreshCw } from 'lucide-react';
import './styles.css';

class CausalServer {
  constructor(id) {
    this.id = id;
    this.events = [];
    this.vectorClock = {};
    this.pendingEvents = [];
    this.randomSeed = Math.random();
  }

  addEvent(event, delay = 0) {
    setTimeout(() => {
      if (this.canAddImmediately(event)) {
        this.insertEvent(event);
        this.processPendingEvents();
      } else {
        this.pendingEvents.push(event);
      }
    }, delay);
  }

  canAddImmediately(event) {
    if (event.parentId) {
      return this.events.some(e => e.id === event.parentId);
    }
    return true;
  }

  insertEvent(event) {
    this.vectorClock[event.serverId] = (this.vectorClock[event.serverId] || 0) + 1;

    const newEvent = {
      ...event,
      timestamp: Date.now(),
      vectorClock: { ...this.vectorClock },
      localOrder: this.calculateLocalOrder(event)
    };

    if (event.parentId) {
      const parentIndex = this.events.findIndex(e => e.id === event.parentId);
      if (parentIndex !== -1) {
        let insertIndex = parentIndex + 1;
        while (insertIndex < this.events.length &&
          this.events[insertIndex].parentId === event.parentId) {
          insertIndex++;
        }
        this.events.splice(insertIndex, 0, newEvent);
        return;
      }
    }

    const insertIndex = this.findInsertPosition(newEvent);
    this.events.splice(insertIndex, 0, newEvent);
  }

  calculateLocalOrder(event) {
    const hash = event.id.split('').reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);
    return (hash * this.randomSeed) % 1000;
  }

  findInsertPosition(event) {
    if (event.parentId) {
      const parentIndex = this.events.findIndex(e => e.id === event.parentId);
      if (parentIndex !== -1) {
        return parentIndex + 1;
      }
    }

    if (!event.parentId) {
      const randomIndex = Math.floor(Math.random() * (this.events.length + 1));
      return randomIndex;
    }
    return this.events.length;
  }


  processPendingEvents() {
    let processed = true;
    while (processed) {
      processed = false;
      for (let i = this.pendingEvents.length - 1; i >= 0; i--) {
        if (this.canAddImmediately(this.pendingEvents[i])) {
          const event = this.pendingEvents.splice(i, 1)[0];
          this.insertEvent(event);
          processed = true;
        }
      }
    }
  }

  getEvents() {
    return [...this.events];
  }

  getPendingCount() {
    return this.pendingEvents.length;
  }
}

export default function CausalConsistencyDemo() {
  const [servers, setServers] = useState([]);
  const [selectedServer, setSelectedServer] = useState(0);
  const [message, setMessage] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [eventCounter, setEventCounter] = useState(0);
  const [updateTrigger, setUpdateTrigger] = useState(0);

  useEffect(() => {
    const newServers = [
      new CausalServer('Server-A'),
      new CausalServer('Server-B'),
      new CausalServer('Server-C')
    ];
    setServers(newServers);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setUpdateTrigger(prev => prev + 1);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const syncServers = (sourceServer, event) => {
    servers.forEach((server, idx) => {
      if (idx !== sourceServer) {
        const serverLatencies = [
          3000 + Math.random() * 2000,
          5000 + Math.random() * 3000,
          7000 + Math.random() * 3000
        ];
        const latencyMultiplier = event.parentId ? 0.6 : 1.0;
        const delay = serverLatencies[idx] * latencyMultiplier;

        server.addEvent(event, delay);
      }
    });
  };

  const handlePost = () => {
    if (!message.trim() || servers.length === 0) return;

    const newEvent = {
      id: `event-${eventCounter}`,
      serverId: servers[selectedServer].id,
      text: message,
      parentId: replyTo,
      type: replyTo ? 'reply' : 'comment',
      createdAt: new Date().toISOString()
    };

    servers[selectedServer].addEvent(newEvent);
    syncServers(selectedServer, newEvent);

    setEventCounter(eventCounter + 1);
    setMessage('');
    setReplyTo(null);
  };

  const handleReply = (eventId) => {
    setReplyTo(eventId);
  };

  const renderEvent = (event, depth = 0) => {
    const currentServer = servers[selectedServer];
    if (!currentServer) return null;

    const replies = currentServer.getEvents().filter(e => e.parentId === event.id);

    return (
      <div key={event.id} style={{ marginLeft: `${depth * 20}px` }} className="event-container">
        <div className="event-card">
          <div className="event-header">
            <div className="event-info">
              <div className="event-meta">
                <Server size={14} />
                <span className="server-name">{event.serverId}</span>
                <Clock size={14} />
                <span className="event-time">{new Date(event.createdAt).toLocaleTimeString()}</span>
                <span className="event-id">({event.id})</span>
              </div>
              <p className="event-text">{event.text}</p>
            </div>
            <button
              onClick={() => handleReply(event.id)}
              className="reply-button"
              title="Responder"
            >
              <Reply size={16} />
            </button>
          </div>
        </div>
        {replies.map(reply => renderEvent(reply, depth + 1))}
      </div>
    );
  };

  const rootEvents = servers[selectedServer]?.getEvents().filter(e => !e.parentId) || [];
  const pendingCount = servers[selectedServer]?.getPendingCount() || 0;

  return (
    <div className="app-container">
      <div className="content-wrapper">
        <div className="header-section">
          <h1 className="main-title">
            <MessageSquare className="title-icon" />
            Consistencia Causal
          </h1>
        </div>

        <div className="servers-grid">
          {servers.map((server, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedServer(idx)}
              className={`server-button ${selectedServer === idx ? 'server-selected' : ''}`}
            >
              <div className="server-content">
                <Server size={24} />
                <span className="server-label">{server.id}</span>
              </div>
              <div className="server-stats">
                <div className="server-count">
                  {server.getEvents().length} eventos
                </div>
                {server.getPendingCount() > 0 && (
                  <div className="pending-count">
                    <RefreshCw size={12} />
                    {server.getPendingCount()} pendientes
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        <div className="post-section">
          <h2 className="section-title">
            Publicar en {servers[selectedServer]?.id}
          </h2>

          {replyTo && (
            <div className="reply-indicator">
              <span className="reply-text">
                Respondiendo a: {replyTo}
              </span>
              <button
                onClick={() => setReplyTo(null)}
                className="cancel-reply"
              >
                Cancelar
              </button>
            </div>
          )}

          <div className="post-form">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handlePost()}
              placeholder={replyTo ? "Escribe tu respuesta..." : "Escribe un comentario..."}
              className="post-input"
            />
            <button
              onClick={handlePost}
              disabled={!message.trim()}
              className="post-button"
            >
              {replyTo ? 'Responder' : 'Publicar'}
            </button>
          </div>
        </div>

        <div className="events-section">
          <h2 className="section-title">
            Vista de {servers[selectedServer]?.id}
            {pendingCount > 0 && (
              <span className="pending-badge">
                {pendingCount} evento(s) esperando dependencias
              </span>
            )}
          </h2>

          <div className="events-list">
            {rootEvents.length === 0 ? (
              <div className="empty-state">
                No hay comentarios aún. ¡Sé el primero en publicar!
              </div>
            ) : (
              rootEvents.map(event => renderEvent(event))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}