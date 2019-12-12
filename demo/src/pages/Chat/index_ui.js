import React, { Component } from 'react'
import { Input } from 'antd';
import { NavBar, Icon } from 'antd-mobile';

import './index.css'
export default class Chat extends Component {

    constructor(){
      super()

      this.state={
        userInformation:{},
        infLits:[],
      }
    }

    //发送消息
    
      sendMessage(value){
      
      if(value!==''){
        var data ={
          content:value,
          touser:{
            userid : this.state.userInformation._id,
            username : this.state.userInformation.username,
            userimg : this.state.userInformation.img,
            usertel : this.state.userInformation.tel
        } 
        } 
        this.chat.send(JSON.stringify(data))
      }else{
        this.$hint({code:0,text:'不能为空'})
      }
      this.$bus.emit('infList',this.state.infLits)
    }
    render() {
        const { Search } = Input;
        return (
            <div className="chat">

            <NavBar
            mode="light"
            icon={<Icon type="left" />}
            onLeftClick={() => this.props.history.go(-1)}
            rightContent={[
              <Icon key="1" type="ellipsis" />,
            ]}
          >
          
          { this.state.userInformation.username }</NavBar>
          <div className="chat-content">
           { this.state.infLits.map(item=>{

            if (item.status==="发送"){
                return (
                  <div className="user-dialogue-right" key={ item.addtime }>
                    <div className="content-right">
                      <div className="user-name-right">{ item.myuser.username }</div>
                      <div className="information-right">{ item.content }</div>
                    </div>
                    <div className="user-upload-right"><img src={ 'http://localhost:100/' +item.myuser.userimg}/></div>
                  </div>
                )
            }else{

              return(
               
                      <div className="user-dialogue" key={ item.addtime }>
                      <div className="user-upload"><img src={ 'http://localhost:100/' +item.myuser.userimg}/></div>
                      <div className="content">
                          <div className="user-name">{ item.myuser.username }</div>
                          <div className="information">{ item.content }</div>
                      </div>
                    </div>
              )
            }
           

            }) }
            </div>

            <Search
            placeholder="请输入信息"
            enterButton="发送"
            size="large"
            onSearch={value => (this.sendMessage(value))}
            className="chat-tabbar"
            ref='inp'
          />
            </div>
        )
    }
   async componentDidMount(){
     var id=window.location.href.split('=')[1]
     var { data } = await this.$axios.get(this.$baseurl+'/users?page=1&num=1&userid='+id)
     this.setState({
       userInformation:data.data[0]
     })
     

     var url = this.$chaturl+'?'+JSON.parse(localStorage.getItem('user_token'))
     var chat = new WebSocket(url)
     this.chat=chat

     chat.onmessage = (e)=>{

      if(JSON.parse(e.data).status==='发送'){
        var id=JSON.parse(e.data).touser.userid
      }else{
       var id=JSON.parse(e.data).myuser.userid

            if (localStorage.getItem('newHint')!==null) {

              var newHintArr=JSON.parse(localStorage.getItem('newHint'))


              if (newHintArr.indexOf(id)===-1) {
                  newHintArr.unshift(id)
                  this.props.addInf(newHintArr)
                  localStorage.setItem('newHint',JSON.stringify(newHintArr))
              }else{
                  newHintArr.splice(newHintArr.indexOf(id),1)
                  newHintArr.unshift(id)
                  this.props.addInf(newHintArr)
                  localStorage.setItem('newHint',JSON.stringify(newHintArr))
              }

            }else{
              var newHint=[id]
              this.props.addInf(newHintArr)
              localStorage.setItem('newHint',JSON.stringify(newHint))
            }
            
      }
     

      var newinf=JSON.parse(e.data)

      var oldinf=JSON.parse(localStorage.getItem(id))
      console.log(oldinf)
       if (oldinf===null) {
        localStorage.setItem(id,JSON.stringify([newinf]))
       }else{
          localStorage.setItem(id,JSON.stringify([...oldinf,newinf]))
       }
      

       this.setState({
         infLits:JSON.parse(localStorage.getItem(id))
       }) 
       
     }

     chat.onopen=()=>{
       console.log('聊天开启了')
       if (JSON.parse(localStorage.getItem(id))!==null) {
        this.setState({
          infLits:JSON.parse(localStorage.getItem(id))
        }) 
       }
       
     }
     chat.onclose= function(){
       console.log('聊天关闭了')
     }
     chat.onerror= function(){
       console.log('聊天出错了')
     }
    }

}
