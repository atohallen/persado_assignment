import React, { useState } from 'react'
import { Card, Button, Input, Row, Col } from 'antd'

const Connection = ({ connect, disconnect, connectBtn }) => {
  const [options, setOptions] = useState({
    host: 'broker.emqx.io',
    clientId: 'emqx_react_' + Math.random().toString(16).substring(2, 8),
    port: 8083,
    username: 'username'
  })

  const [ isModify, setIsModify ] = useState(false);

  const handleConnect = () => {
    const { host, clientId, port, username } = options;
    const url = `ws://${host}/mqtt`;
    const _options = {
      port,
      clientId,
      clean: true,
      reconnectPeriod: 1000, // ms
      connectTimeout: 30 * 1000, // ms
    };
    connect(url, _options, username)
  }

  const handleDisconnect = () => {
    disconnect()
  }

  const handleChange = (e) => {
    setOptions({
      ...options,
      [e.target.name] : e.target.value
    })
  }

  const ConnectionForm = (
    <>
      <Row align="middle" gutter={20}>
          <Col span={3} align="middle">
            <label>Username</label>
          </Col>
          <Col span={7} align="middle">
            <Input placeholder="Enter username" value={options.username} name="username" onChange={handleChange} />
          </Col>
          <Col span={4} align="middle">
            <Button
              type={connectBtn === 'Disconnect' ? "danger" : "primary"}
              onClick={connectBtn === 'Disconnect' ? handleDisconnect : handleConnect}
              block>
                {connectBtn}
            </Button>
          </Col>
          <Col span={5} align="middle">
            <Button
              onClick={() => setIsModify(!isModify)}
              block
            > {!isModify ? 'Modify' : 'Hide'}
            </Button>
          </Col>
      </Row>
      {isModify &&
        <div style={{ border: 'solid 1px', padding: '20px', marginTop: '20px' }}>
          <Row align="middle" style={{ textAlign: 'center' }}>
            <Col span={24}>
              <label align="middle">Connection details</label>
            </Col>
          </Row>
          <Row gutter={20} style={{ marginTop: '20px' }} align="middle">
            <Col span={2}>
              <label>host</label>
            </Col>
            <Col span={8}>
              <Input name="host" value={options.host} onChange={handleChange} />
            </Col>
            <Col span={2}>
              <label>clientId</label>
            </Col>
            <Col span={8}>
              <Input name="clientId" value={options.clientId} onChange={handleChange} />
            </Col>
          </Row>
          <Row gutter={20} style={{ marginTop: '20px' }}>
            <Col span={2}>
              <label>port</label>
            </Col>
            <Col span={8}>
              <Input name="port" value={options.port} onChange={handleChange} />
            </Col>
          </Row>
        </div>
      }
    </>
  )

  return (
    <Card
      title="Connection"
    >
      {ConnectionForm}
    </Card>
  )
}

export default Connection
