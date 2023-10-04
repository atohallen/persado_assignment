import React, { useEffect, useState } from 'react';
import { Card, List, Row, Col, Button, Input } from 'antd';

const Receiver = ({ user, payload, sendPrivateMessage, sendPublicMessage }) => {
  const [ messages, setMessages ] = useState([])
  const [ users, setUsers ] = useState(['--all--', 'aaa', 'bbb', 'ccc', 'ddd', 'eee', 'fff']);
  const [ selectedUser, setSelectedUser ] = useState('--all--');
  const [ message, setMessage ] = useState('');

  const renderMessages = (item) => {
    const title = '';

    return (
      <List.Item>
        <List.Item.Meta
          title={`${item.time} [${item.username}] : ${item.message}`}
          description={item.message}
        />
      </List.Item>
    )
  }

  const renderUsers = (user) => (
    <List.Item
      style={user === selectedUser ? { backgroundColor: '#e6f7ff' } : {}}
      onClick={() => setSelectedUser(user)}
    >
      <List.Item.Meta
        title={user}
      />
    </List.Item>
  )

  useEffect(() => {
    if (user) {
      setUsers([...users, user])
    }
  }, [user])

  useEffect(() => {
    if (payload.message) {
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
            onClick={selectedUser === '--all--' ? sendPublicMessage : sendPrivateMessage}
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

export default Receiver;
