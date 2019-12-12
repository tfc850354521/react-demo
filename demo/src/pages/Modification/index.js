import React, { Component } from 'react'
import { Input,Button } from 'antd';
import './index.css'


export default class Modification extends Component {

    constructor(){
        super()

        this.state={
            load:'http://localhost:100/'+JSON.parse(localStorage.getItem('user_information')).img
        }
    }

    upload(){
        var This=this
        var file = document.getElementById('newFile').files[0]
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

      changePass(){
        var p1=document.getElementsByClassName('pass1')[0].children[0].value
        var p2=document.getElementsByClassName('pass2')[0].children[0].value
        if (p1===p2) {
            document.getElementsByClassName('passBtn')[0].removeAttribute('disabled')
        }else{
            document.getElementsByClassName('passBtn')[0].setAttribute('disabled','disabled')
        }
      }


      async setPass(){
          var token=JSON.parse(localStorage.getItem('user_token'))
          
          //修改用户名
          var fdName = new FormData()
          fdName.append('newusername',document.getElementsByClassName('newName')[0].value)
          fdName.append('token',token)
          var name = await this.$axios.post(this.$baseurl+'/modifyusername',fdName)
          console.log(name.data.code)
          
          if (name.data.code===1) {
               //修改密码
                var fdPass = new FormData()
                fdPass.append('newuserpwd',document.getElementsByClassName('pass2')[0].children[0].value)
                fdPass.append('token',token)
                var password = await this.$axios.post(this.$baseurl+'/modifyuserpwd',fdPass)
               
                //修改头像
                var fdLoad = new FormData(document.getElementsByClassName('newFile')[0])
                fdLoad.append('token',token)
                var password = await this.$axios.post(this.$baseurl+'/modifyuserimg',fdLoad)

                this.$hint(name.data)
                localStorage.removeItem('user_token')
                setTimeout(()=>{
                    this.props.history.push('/')
                },1000)
                
          }else{

                 this.$hint(name.data)

          }

      }
    render() {
        return (
            <div className="modification">
                <div className="modification-content">

                    <form className='newFile'>
                        <div className="upload"  >
                            <input type="file" ref="upload" onChange={ ()=>{ this.upload() } }  id="newFile" name="file1" />
                            <img src={ this.state.load } alt=""/>
                        </div>
                    </form>
                    <Input placeholder="新用户名" style={{ margin:'10px 0' }} className="newName"/><br/>
                    <Input.Password placeholder="请输入新密码" className="pass1" onChange={ (e)=>{this.changePass(e)} }/>
                    <Input.Password placeholder="再次确认新密码" style={{ margin:'10px 0' }} className="pass2" onChange={ (e)=>{this.changePass(e)}  }/>
                    <Button type="primary" block    onClick={ ()=>{ this.setPass() } }  className="passBtn" >确认修改</Button>
                </div>
            </div>
        )
    }

    componentDidMount(){

        document.getElementsByClassName('passBtn')[0].setAttribute('disabled','disabled')

    }
}
