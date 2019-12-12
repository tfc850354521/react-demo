import React, { Component } from 'react'
import { Form, Icon, Input, Button } from 'antd';
import { Toast } from 'antd-mobile';
import './index.css'
export default class Register extends Component {
    constructor(){
      super()

      this.state={
        load:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1574401299817&di=918aed51f4cc0201926674033c3a0669&imgtype=0&src=http%3A%2F%2Fku.90sjimg.com%2Felement_origin_min_pic%2F01%2F37%2F84%2F07573c641f08c46.jpg'
      }
    }
    //注册提交
    async handleSubmit(e){
        e.preventDefault();
        console.log(e.target)
        var fd = new FormData(e.target)
        let { data } = await this.$axios.post(this.$baseurl+'/user',fd) 
        this.showToast(data)
        

      };
      //加载本机图片
      upload(){
        var This=this
        var file = document.getElementById('file').files[0]
        if (file) {
          var reader = new FileReader();
          reader.onload = function (event) {
              var txt = event.target.result;
              var img = document.createElement("img");
              img.src = txt;//将图片base64字符串赋值给img的src
              This.setState({
              load:txt
            })
          }
        }
        reader.readAsDataURL(file);
      }
      //提示
      showToast(data) {
        if(data.code===1){
           Toast.success(data.text, 1);;
           setTimeout(()=>{
             this.props.history.push('/')
           },1000)
           
        }else{
          Toast.fail(data.text, 1);
        }
       
      }


     render() {
      
        return (
            <div className="register" style={{ textAlign:'center' }}>
            <Form onSubmit={(e)=>{ this.handleSubmit(e) }} className="login-form" style={{ marginTop:'40%' }}>
            <h2 >注册新用户</h2>
            <Form.Item>
                 <div className="upload"  >
                  <input type="file" ref="upload" onChange={ (e)=>{ this.upload(e) } }  id="file" name="file1" />
                  <img src={ this.state.load } alt=""/>
                  
                 </div>
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
                 <Input
                  prefix={<Icon type="phone" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type="phone"
                  placeholder="电话号码"
                  style={{ width:'70%' }}
                  name="tel"
                 /><br/>
                 <input type="hidden" ref="captcha" name="cap_token"/>
                 <input type="hidden" ref="code"  name="cap"/>
                 
          <Button type="primary" htmlType="submit" className="login-form-button" style={{ width:'70%' }} >
            注册
          </Button>
     
         </Form.Item>
           </Form>
            </div>
        )
    }

    async componentDidMount(){
      var { data } = await this.$axios.get(this.$baseurl+'/svgcaptcha')
      console.log(data)
      this.refs.captcha.value=data.captcha
      this.refs.code.value=data.text
    }
}

