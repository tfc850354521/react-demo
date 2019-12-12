import { Component } from 'react'

function webscoket(){
    var url = this.$chaturl+'?'+JSON.parse(localStorage.getItem('user_token'))
    var chat = new WebSocket(url)
    this.chat=chat

    chat.onmessage = (e)=>{
     console.log(JSON.parse(e.data))
      this.setState({
        infLits:[...this.state.infLits,JSON.parse(e.data)]
      }) 
      this.$bus.emit('infList',this.state.infLits)
    }

    chat.onopen=function(){
      console.log('聊天开启了')
    }
    chat.onclose= function(){
      console.log('聊天关闭了')
    }
    chat.onerror= function(){
      console.log('聊天出错了')
    }
}

Component.prototype.$websocket=webscoket

export default webscoket