import React, { Component } from 'react'
import './index.css'
import { Input, Button  } from 'antd';

const { TextArea } = Input;


export default class AddItem extends Component {
    constructor(){
        super()

        this.state={
            load:'/img1.jpg'
        }
    }

    upload(){
        var This=this
        var file = document.getElementById('add-img').files[0]
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


    async subList(e){

      e.preventDefault();
      var fd =new FormData(e.target)
     
      var { data } = await this.$axios.post(this.$baseurl+'/topic',fd)
      console.log(data)
      this.$hint(data)
      this.props.history.push('/social')
    }
    render() {
        return (
            <div className="add-list">
            <form onSubmit={ (e)=>{ this.subList(e) } }>
            <TextArea placeholder="书写你的生活..." allowClear  name="content" style={{ height:100 }}/>
            <div className="add-photograph"  >
            <input type="file" ref="upload" onChange={ (e)=>{ this.upload(e) } }  id="add-img" name="file1" />
            <img src={ this.state.load } alt="" className="add-img" />
            <input type="hidden" name="token" ref="token"/>
            <Button type="primary"id="sub" htmlType="submit" block>提交</Button>
           </div>
            </form>
            </div>
        )
    }

    componentDidMount(){
      this.refs.token.value=JSON.parse(localStorage.getItem('user_token'))
    }
}
