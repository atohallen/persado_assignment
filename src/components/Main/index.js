import React, { useEffect, useState } from 'react'
import Connection from './Connection'
import Chat from './Chat';
import mqtt from 'mqtt'

const MainPage = () => {
  const [client, setClient] = useState(null)
  const [username, setUsername] = useState('username');
  const [connectStatus, setConnectStatus] = useState('Connect')
  const [user, setUser] = useState('');
  const [payload, setPayload] = useState({});

  const mqttConnect = (host, mqttOption, _username) => {
    setConnectStatus('Connecting')
    setUsername(_username);
    setClient(mqtt.connect(host, mqttOption))
  }

  useEffect(() => {
    if (client) {
      client.on('connect', () => {
        setConnectStatus('Connected')

        // subscribe topic
        client.subscribe('/topic/chatserver101/presence');
        client.subscribe('/topic/chatserver101/public');
        client.subscribe(`/topic/chatserver101/priv/${username}`);  

        // Broadcast presence
        client.publish('/topic/chatserver101/presence', JSON.stringify({
          username,
          time: new Date().toISOString()
        }));

        console.log('connection successful')
      })

      client.on('error', (err) => {
        console.error('Connection error: ', err)
        client.end()
      })

      client.on('reconnect', () => {
        setConnectStatus('Reconnecting')
      })

      client.on('message', (topic, message) => {
        const payload = JSON.parse(message.toString());
        switch (topic) {
          case '/topic/chatserver101/presence':
            setUser(payload.username);
            break;
          case '/topic/chatserver101/public':
            setPayload(payload);
            break;
          default:
            if (topic.includes('/topic/chatserver101/priv/')) {
                console.log(`Private message from ${payload.name} at ${payload.time}: ${payload.text}`);
            }
            break;
        }
      });
    }
  }, [client])

  const mqttDisconnect = () => {
    if (client) {
      try {
        client.end(false, () => {
          setConnectStatus('Connect')
          console.log('disconnected successfully')
        })
      } catch (error) {
        console.log('disconnect error:', error)
      }
    }
  }

  const sendPublicMessage = (text) => {
    client.publish('/topic/chatserver101/public', JSON.stringify({
        name: username,
        text: text,
        time: new Date().toISOString()
    }));
  };

  const sendPrivateMessage = (targetUsername, text) => {
    client.publish(`/topic/chatserver101/priv/${targetUsername}`, JSON.stringify({
        name: username,
        text: text,
        time: new Date().toISOString()
    }));
  };

  return (
    <>
      <Connection
        connect={mqttConnect}
        disconnect={mqttDisconnect}
        connectBtn={connectStatus}
      />
      {
        connectStatus === 'Connected' && 
          <Chat
            user={user}
            payload={payload}
            sendPrivateMessage={sendPrivateMessage}
            sendPublicMessage={sendPublicMessage}
          />
      }
    </>
  )
}

export default MainPage
