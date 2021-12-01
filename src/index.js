import ReactDOM from 'react-dom'
import React, { useEffect, useState } from 'react'
import { w3cwebsocket } from 'websocket'
import { Card, Avatar, Input, Typography } from 'antd'
import 'antd/dist/antd.css'
import './index.css'

const client = new w3cwebsocket('ws://127.0.0.1:8080')

/* importação de componentes antd */
const { Search } = Input
const { Text }  = Typography
const { Meta } = Card

export default function App () {

  const [userName, setUserName] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputMsg, setInputMsg] = useState('')

  useEffect(() => {
    client.onopen = () => {
      console.log('Websocket Client connect')
    }
    client.onmessage = msg =>{
      const dataFromServer = JSON.parse(msg.data)
      if(dataFromServer.type === 'message') {
        setMessages(oldState => [...oldState, {
          msg: dataFromServer.msg,
          user: dataFromServer.user
        }])
      }
    }
  },[])

  const sendMessage = (text) => {
    client.send(JSON.stringify({
      type: 'message',
      msg: text,
      user: userName
    }))
    setInputMsg('')
  }

  return(
    <div className="main">
      {isLoggedIn ? (
        <div>
          <div className="title">
            <Text type="secondary" style={{fontSize: '2rem', color:'#fff', fontWeight: '600'}}>Websocket Chat</Text>
          </div>
          <div className="chat-container">
            {messages.map(msg => (
              <Card key={msg.msg + msg.user}>
                <Meta 
                  avatar={<Avatar style={{backgroundColor: '#DBEBC0', color: '#fff', alignSelf: userName === msg.user ? 'flex-end' : 'flex-start' }}>{msg.user.toUpperCase().substring(0,1)}</Avatar>}
                  title={msg.user}
                  description={msg.msg}
                />
              </Card>
            ))}
          </div>
          <div className="bottom">
            <Search 
              placeholder="Digite sua mensagem"
              enterButton="Enviar"
              value={inputMsg}
              onChange={e => setInputMsg(e.target.value)}
              onSearch={value => sendMessage(value)}
            />
          </div>
        </div>
      ):(
        <div style={{height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', padding: '2rem'}}>
          <Search 
            placeholder="Insira um apelido" 
            enterButton="Entrar"
            size="large" 
            onSearch={value => {
              setIsLoggedIn(true)
              setUserName(value)
            }}
          />
        </div>
      )}
    </div>
  )
}

ReactDOM.render(<App/>, document.getElementById('root'))