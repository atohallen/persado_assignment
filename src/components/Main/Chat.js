import React, { useEffect, useState } from 'react';
import { Card, List, Row, Col, Button, Input } from 'antd';

const USER_TIMEOUT = 30000; // Expire time limit

const Chat = ({ user, payload, sendPrivateMessage, sendPublicMessage }) => {
  const [ messages, setMessages ] = useState([])
  const [ selectedUser, setSelectedUser ] = useState({ username: '--all--', clientId: 'all'});
  const [ message, setMessage ] = useState('');
  const [ users, setUsers ] = useState([{ username: '--all--', clientId: 'all' }]);

  const renderMessages = (item) => {
    let title = `${item.time.slice(11, 16)} [${item.name}] : `;

    if(!item.isPublic) {
      title += '🔒 ';
    }

    title += item.text;

    return (
      <List.Item>
        <List.Item.Meta
          title={title}
        />
      </List.Item>
    )
  }

  const renderUsers = (_user) => {
    let title = _user.username;
    if(_user.status === 'offline')
      title += ' 🚫';
    return (
      <List.Item
        style={_user.clientId === selectedUser.clientId ? { backgroundColor: '#e6f7ff' } : {}}
        onClick={() => setSelectedUser({ username: _user.username, clientId: _user.clientId })}
      >
        <List.Item.Meta
          title={title}
        />
      </List.Item>
    )
  }

  useEffect(() => {
    if (user.username) {
      let updatedUsers = [...users];

      const userIndex = updatedUsers.findIndex(({ username }) => username === user.username);
      
      if (userIndex >= 0) {
        if (updatedUsers.find(({ clientId }) => clientId === user.clientId)) {
          const updateUserIndex = updatedUsers.findIndex(({ clientId }) => clientId === user.clientId);
          updatedUsers[updateUserIndex] = { ...updatedUsers[updateUserIndex], time: user.time, status: 'online' };
        } else {
          updatedUsers[userIndex] = {
            ...updatedUsers[userIndex],
            status: 'online',
            count: updatedUsers[userIndex].count + 1,
          };

          updatedUsers.push({
            ...user,
            status: 'online',
            count: 0,
            username: updatedUsers[userIndex].username + '-' + (updatedUsers[userIndex].count + 1),
          });
        }
      } else {
        updatedUsers.push({ ...user, status: 'online', count: 0 });
      }

      const now = Date.now();
      updatedUsers = updatedUsers.map(user => {
        if (now - new Date(user.time).getTime() > USER_TIMEOUT && user.status === 'online' ) {
          return { ...user, status: 'offline' };
        }
        return user;
      });

      setUsers(updatedUsers);
    }
  }, [user])

  useEffect(() => {
    if (payload.text) {
      setMessages([...messages, payload]);
    }
  }, [payload]);

  return (
    <Card title="Chat Page">
      <Row gutter={[16, 16]} >
        <Col span={16}>
          <List
            size="small"
            bordered
            dataSource={messages}
            renderItem={renderMessages}
            style={{ height: '250px', overflowY: 'auto' }}
        />
        </Col>
        <Col span={8}>
          <List
            size="small"
            bordered
            dataSource={users}
            renderItem={renderUsers}
            style={{ height: '250px', overflowY: 'auto' }}
          />
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={16}>
          <Input value={message} onChange={(e) => setMessage(e.target.value)} />
        </Col>
        <Col span={8}>
          <Button
            onClick={
              selectedUser.username === '--all--' ? 
                () => sendPublicMessage(message) : () => sendPrivateMessage(selectedUser.clientId, message)
              }
            disabled={message === ''}
            block
          >
            {selectedUser.username === '--all--' ? 'Send to All' : `Send to ${selectedUser.username}`}
          </Button>
        </Col>
      </Row>
    </Card>
  );
}

export default Chat;
