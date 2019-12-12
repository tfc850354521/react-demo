import React, { Component } from 'react'
import { Accordion, List } from 'antd-mobile';
import { message } from 'antd';
import './index.css'
export default class Personal extends Component {
    constructor(){
        super()

        this.state={
            userInf:{
                img:'/img1.jpg',
                username:'未登录'
            }
        }
    }

    goCollect(){

        this.props.history.push('/collect')

    }

    logout(){
        message.success('注销成功')
        setTimeout(()=>{
            this.props.history.push('/')
            localStorage.removeItem('user_token')
        },1000)
        
        
    }


    render() {
        return (

            <div className="personal">
                <div className="personal-header">
                    <div className="personal-header-load" >
                    <img src={ 'http://localhost:100/'+ this.state.userInf.img } />
                    <div className="personal-header-username">{ this.state.userInf.username }</div>
                    </div>
                </div>

                <div className="personal-content">
    
                        <div style={{ marginTop: 10, marginBottom: 10 }}>
                            <Accordion defaultActiveKey="" className="my-accordion" >
                            <Accordion.Panel header="我的收藏">

                                <List.Item onClick={ ()=>{ this.goCollect() } }>收藏的动态</List.Item>
                                <List.Item onClick={ ()=>{ this.props.history.push('/homepage') } }>我的动态</List.Item>
                               
                            </Accordion.Panel>
                            <Accordion.Panel header="积分商城" className="pad">

                                <List.Item>积分兑换</List.Item>

                            </Accordion.Panel>
                            <Accordion.Panel header="个人信息" className="pad">

                                <List.Item  onClick={ ()=>{ this.props.history.push('/modification') } }>信息修改</List.Item>
                                <List.Item  onClick={ ()=>{ this.logout() } }>注销登录</List.Item>


                            </Accordion.Panel>
                            </Accordion>
                      </div>
                </div>
            </div>

        )
    }

    componentDidMount(){
        this.setState({
            userInf:JSON.parse(localStorage.getItem('user_information'))
        })
    }
}
