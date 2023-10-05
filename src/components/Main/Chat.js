import React, { useEffect, useState } from 'react';
import { Card, List, Row, Col, Button, Input } from 'antd';

const USER_TIMEOUT = 20000;

const Chat = ({ user, payload, sendPrivateMessage, sendPublicMessage, setAlert }) => {
  const [ messages, setMessages ] = useState([])
  const [ users, setUsers ] = useState([{ username: '--all--' }]);
  const [ selectedUser, setSelectedUser ] = useState('--all--');
  const [ message, setMessage ] = useState('');

  const renderMessages = (item) => {
    const title = '';

    return (
      <List.Item>
        <List.Item.Meta
          title={`${item.time} [${item.name}] : ${item.text}`}
        />
      </List.Item>
    )
  }

  const renderUsers = (_user) => (
    <List.Item
      style={_user.username === selectedUser ? { backgroundColor: '#e6f7ff' } : {}}
      onClick={() => setSelectedUser(_user.username)}
    >
      <List.Item.Meta
        title={_user.username}
      />
    </List.Item>
  )

  useEffect(() => {
    if (user.username) {
      let updatedUsers = [...users];

      const userIndex = updatedUsers.findIndex(({ username }) => username === user.username);
      
      if (userIndex >= 0) {
        if (user.clientId === updatedUsers[userIndex].clientId) {
          updatedUsers[userIndex] = { ...updatedUsers[userIndex], time: user.time, status: 'online' };
        } else {
          setAlert();
          return;
        }
      } else {
        updatedUsers.push({ ...user, status: 'online' });
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
              selectedUser === '--all--' ? 
                () => sendPublicMessage(message) : () => sendPrivateMessage(selectedUser, message)
              }
            disabled={message === ''}
            block
          >
            {selectedUser === '--all--' ? 'Send to All' : `Send to ${selectedUser}`}
          </Button>
        </Col>
      </Row>
    </Card>
  );
}

export default Chat;
