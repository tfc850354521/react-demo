import React, { Component } from 'react'
import { Comment, List } from 'antd';

import './index.css'

export default class Home extends Component {


    constructor(){
      super()

      this.state={
        newNnf:[]
      }
    }
    goChat(data){

        this.props.history.push('/chat?id='+data)
    }

    render() {

      const data =this.state.newNnf.map(item=>(
          {
            author: item.myuser.username,
            avatar: 'http://localhost:100/' + item.myuser.userimg,
            content: (
              <p>
                { item.content }
              </p>
            ),
            datetime: (

                <span>
                {item.addtime}
                </span>
            ),
            id:item.myuser.userid,
          }
        ))
       
        return (
            <div className="home">
            <List
            className="comment-list"
            itemLayout="horizontal"
            dataSource={data}
            renderItem={item => (
              <li style={{padding:'0 10px' }} onClick={ ()=>{this.goChat(item.id)} }>
                <Comment
                  actions={item.actions}
                  author={item.author}
                  avatar={item.avatar}
                  content={item.content}
                  datetime={item.datetime}
                />
              </li>
            )}
          />
            </div>
        )
    }

    componentDidMount(){

      this.$route('新消息')
      if(localStorage.getItem('newHint')!==null){
        JSON.parse(localStorage.getItem('newHint'))

        var arr=JSON.parse(localStorage.getItem('newHint')).map(item=>{
             var n=JSON.parse(localStorage.getItem(item)).length
          return JSON.parse(localStorage.getItem(item))[n-1]
        })

        this.setState({
          newNnf:arr
        })
        
      }

      



    }
}
