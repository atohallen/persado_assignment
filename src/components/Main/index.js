import React, { useEffect, useState } from 'react'
import Connection from './Connection'
import Chat from './Chat';
import mqtt from 'mqtt'

const MainPage = () => {
  const [client, setClient] = useState(null)
  const [username, setUsername] = useState('username');
  const [connectStatus, setConnectStatus] = useState('Connect')

  const [ user, setUser ] = useState({});
  const [ payload, setPayload ] = useState({});

  const mqttConnect = (host, mqttOption, _username) => {
    setConnectStatus('Connecting')
    setUsername(_username);
    setClient(mqtt.connect(host, mqttOption))
  }

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
        text,
        time: new Date().toISOString(),
        isPublic: true,
    }));
  };

  const sendPrivateMessage = (targetClientId, text) => {
    client.publish(`/topic/chatserver101/priv/${targetClientId}`, JSON.stringify({
        name: username,
        text: text,
        time: new Date().toISOString(),
        isPublic: false,
    }));
  };

  useEffect(() => {
    if (client) {
      client.on('connect', () => {
        setConnectStatus('Disconnect')

        // subscribe topic
        client.subscribe('/topic/chatserver101/presence', { qos: 1 });
        client.subscribe('/topic/chatserver101/public');
        client.subscribe(`/topic/chatserver101/priv/${client.options.clientId}`);

        // Broadcast presence
        client.publish('/topic/chatserver101/presence', JSON.stringify({
          username,
          clientId: client.options.clientId,
          time: new Date().toISOString(),
        }), { qos: 1 });

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
            if(payload.clientId !== client.options.clientId)
              setUser(payload);
            break;
          case '/topic/chatserver101/public':
            setPayload(payload);
            break;
          case `/topic/chatserver101/priv/${client.options.clientId}`:
            setPayload(payload);
            break;
          default:
            break;
        }
      });

      const interval = setInterval(() => {
        client.publish('/topic/chatserver101/presence', JSON.stringify({
          username,
          clientId: client.options.clientId,
          time: new Date().toISOString(),
        }));
      }, 5000);

      return () => {
        client.end();
        clearInterval(interval);
      }
    }
  }, [client])

  return (
    <>
      <Connection
        connect={mqttConnect}
        disconnect={mqttDisconnect}
        connectBtn={connectStatus}
      />
      {
        connectStatus === 'Disconnect' && 
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
