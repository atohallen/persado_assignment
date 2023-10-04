import React, { useEffect, useState } from 'react';
import { Card, List, Row, Col } from 'antd';

const Receiver = ({ message }) => {
  const [messages, setMessages] = useState([])
  const [users, setUsers] = useState([]);

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

  const renderUsers = (user) => {

  }

  // useEffect(() => {
  //   if (message.username) {
  //     setMessages(messages => [...messages, message])
  //   }
  // }, [message])


  return (
    <Card title="Chat Page">
      <Row gutter={16} >
        <Col span={16}>
          <List
            size="small"
            bordered
            dataSource={messages}
            renderItem={renderMessages}
          />
        </Col>
        <Col span={8}>
          <List
            size="small"
            bordered
            dataSource={users}
            renderItem={renderUsers}
          />
        </Col>
      </Row>
    </Card>
  );
}

export default Receiver;
