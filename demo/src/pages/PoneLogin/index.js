import React, { Component } from 'react'
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import './index.css'
const { Search } = Input;
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
     
     async phone(){
      var fd = new FormData()
      fd.append('cap_token',this.refs.token.value)
      fd.append('cap',this.refs.cap.value)
      fd.append('tel',this.refs.phone.state.value)
      
      var { data } = await this.$axios.post(this.$baseurl+'/getphonecode',fd)
      console.log(data)
      var num = await this.$axios.get('http://106.ihuyi.com/webservice/sms.php?method=Submit&account=C19580348&password=f7e025261b9c03d18962f481452be082&mobile=15727455482&content=您的验证码是：1234。请不要把验证码泄 露给其他人。')

      console.log(num)
     }
      

    render() {
        
        return (
            <div className="login" style={{ textAlign:'center' }}>
            <Form onSubmit={(e)=>{ this.handleSubmit(e) }} className="login-form" style={{ marginTop:'45%' }}>
            <h2>验证码登录</h2>
            <Form.Item>
                <Input
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)'}} />}
                  placeholder="手机号码"
                  style={{ width:'70%' }}
                  name="tel"
                  ref="phone"
                />
                 <Search
                 placeholder="请输入验证码"
                 enterButton="获取"
                 style={{ width:'70%' }}
                 onSearch={() => { this.phone() }}
               /><br/>
                 <input type="hidden" name="cap_token" ref="token"/>
                 <input type="hidden" name="cap" ref="cap"/>
          <a className="login-form-forgot" onClick={ ()=>{ this.props.history.push('/login') } } style={{ marginRight:60 }} >
                 用户密码登录
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
