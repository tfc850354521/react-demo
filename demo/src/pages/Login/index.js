import React, { Component } from 'react'
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import './index.css'
 class Login extends Component {

    //提交登录
    async handleSubmit(e){
        e.preventDefault()
        let fd= new FormData(e.target)
        var { data } = await this.$axios.post(this.$baseurl+'/user_login',fd)
        console.log(data)
        this.$hint(data)
        if(data.code===1){
          localStorage.setItem('user_token',JSON.stringify(data.token))
          localStorage.setItem('user_information',JSON.stringify(data.result))
          setTimeout(()=>{
            this.props.history.push('/address')
          },1000)
        }
      };
     

    render() {
        
        return (
            <div className="login" style={{ textAlign:'center' }}>
            <Form onSubmit={(e)=>{ this.handleSubmit(e) }} className="login-form" style={{ marginTop:'45%' }}>
            <h1>登录</h1>
            <Form.Item>
                <Input
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)'}} />}
                  placeholder="用户名"
                  style={{ width:'70%' }}
                  name="username"
                />
                <Input
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type="password"
                  placeholder="密码"
                  style={{ width:'70%' }}
                  name="password"
                 /><br/>
                 <input type="hidden" name="cap_token" ref="token"/>
                 <input type="hidden" name="cap" ref="cap"/>
          <a className="login-form-forgot" onClick={ ()=>{ this.props.history.push('/ponelogin') } } style={{ marginRight:60 }} >
             手机验证码登录
          </a>
          <a className="login-form-forgot" onClick={ ()=>{ this.props.history.push('/register') } } >
             注册新用户
          </a><br/>
          <Button type="primary" htmlType="submit" className="login-form-button" style={{ width:'70%' }}>
            登录
          </Button>
          
        </Form.Item>
          </Form>
            </div>
        )
    }

    //获取登录token
     async componentDidMount(){
      var { data } = await this.$axios.get(this.$baseurl+'/svgcaptcha')
       this.refs.token.value=data.captcha
       this.refs.cap.value=data.text
    }
}
export default Login
