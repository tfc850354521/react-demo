import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { TabBar } from 'antd-mobile';
import { notification, Icon } from 'antd';

 class Tabbar extends Component {
     constructor(){
      super()

      this.state={
        selectedTab:'',
        num:0
      }

     }


     openNotification(data){
      
      this.setState({
        num:this.state.num+1
      })
      console.log(this.state.num)
      notification.open({
        message: data.myuser.username+'新的消息',
        description:data.content,
        icon: <Icon type="smile" style={{ color: '#108ee9' }} />,
      });

     }
    render() {
        return (
          <div className='tabbar' >
            <TabBar
            unselectedTintColor="#949494"
            tintColor="#33A3F4"
            barTintColor="white"
          >
            <TabBar.Item
              title="聊天"
              key="chat"
              icon={<div className="fa fa-commenting-o" style={{ fontSize:22 }}></div>
              }
              selectedIcon={<div className="fa fa-commenting-o" style={{ color:'rgb(0, 107, 207)',fontSize:22 }}></div>
              }
              selected={this.state.selectedTab === 'chat'}
              badge={this.state.num}
              onPress={() => {
                this.setState({
                  selectedTab: 'chat',
                  num:0
                });
                this.props.history.push('/home')
              }}
              data-seed="logId"
            >
            </TabBar.Item>

            <TabBar.Item
              title="通讯录"
              key="address"
              icon={<div className="fa fa-address-book-o" style={{ fontSize:22 }}></div>
              }
              selectedIcon={<div className="fa fa-address-book-o" style={{ color:'rgb(0, 107, 207)',fontSize:22 }}></div>
              }
              selected={this.state.selectedTab === 'address'}
              badge={0}
              onPress={() => {
                this.setState({
                  selectedTab: 'address',
                });
                this.props.history.push('/address')
              }}
              data-seed="logId"
            >
            </TabBar.Item>

            <TabBar.Item
              title="朋友圈"
              key="social"
              icon={<div className="fa fa-users" style={{ fontSize:22 }}></div>
              }
              selectedIcon={<div className="fa fa-users" style={{ color:'rgb(0, 107, 207)',fontSize:22 }}></div>
              }
              selected={this.state.selectedTab === 'social'}
              badge={0}
              onPress={() => {
                this.setState({
                  selectedTab: 'social',
                });
                this.props.history.push('social')
              }}
              data-seed="logId"
            >
            </TabBar.Item>

            <TabBar.Item
              title="个人中心"
              key="personal"
              icon={<div className="fa fa-user-circle" style={{ fontSize:22 }}></div>
              }
              selectedIcon={<div className="fa fa-user-circle" style={{ color:'rgb(0, 107, 207)',fontSize:22 }}></div>
              }
              selected={this.state.selectedTab === 'personal'}
              badge={0}
              onPress={() => {
                this.setState({
                  selectedTab: 'personal',
                });
                this.props.history.push('/personal')
              }}
              data-seed="logId"
            >
            </TabBar.Item>
        
        </TabBar>
      </div>
        )
    }


    componentDidMount(){

      console.log('添加',this.props.tabInf)
      if (localStorage.getItem('user_token')!== null) {
        
     
    var url = this.$chaturl+'?'+JSON.parse(localStorage.getItem('user_token'))
    var chat = new WebSocket(url)
    this.chat=chat

    chat.onmessage = (e)=>{
      
      console.log(JSON.parse(e.data))
  
      if(JSON.parse(e.data).status==='发送'){
        var id=JSON.parse(e.data).touser.userid
      }else{
        this.openNotification(JSON.parse(e.data))
       var id=JSON.parse(e.data).myuser.userid

            if (localStorage.getItem('newHint')!==null) {

              var newHintArr=JSON.parse(localStorage.getItem('newHint'))
              console.log(newHintArr.indexOf(id))

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
              this.props.addInf(newHint)
              localStorage.setItem('newHint',JSON.stringify(newHint))
            }

      }

      var newinf=JSON.parse(e.data)
      var oldinf=JSON.parse(localStorage.getItem(id))
    
      //将消息对应个人消息存储到本地
       if (oldinf===null) {
        localStorage.setItem(id,JSON.stringify([newinf]))
       }else{
          localStorage.setItem(id,JSON.stringify([...oldinf,newinf]))
       }
       
       //新消息提示
       
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
   }
}
export default withRouter(Tabbar)