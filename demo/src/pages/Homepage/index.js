import React, { Component } from 'react'

import { Icon,Button  } from 'antd'
export default class Homepage extends Component {

    constructor(){
      super()

      this.state={
        newNnf:[]
      }
    }

    async collect(item){
       var fd=new FormData()
       fd.append('topicid',item._id)
       fd.append('token',JSON.parse(localStorage.getItem('user_token')))
       var { data } = await this.$axios.post(this.$baseurl+'/collect',fd)
       console.log(data)
       if (data.text==="收藏成功") {
        document.getElementById(item._id).style.color='red'

       }else{

        document.getElementById(item._id).style.color=''

       }
       
    }
    //获取评论
    async getComment(id){

        var  { data }  = await this.$axios.get(this.$baseurl+'/comments?topicid='+id+'&token='+JSON.parse(localStorage.getItem('user_token')))
        var newHtml=''
        data.data[0].comments.forEach(item => {
            newHtml+=`
            <div className='comment-item'>
                <span className='comment-item-name'>${ item.username }：</span>
                <span className='comment-item-content'>${ item.content }</span>
            </div>
            `
        })
        document.getElementById('item'+id).innerHTML=newHtml
    }

    //评论开关
    async comment(id){
        var n=document.getElementsByClassName(id)[0].style.display
        if(n==="none"){
            document.getElementsByClassName(id)[0].style.display="block"
        }else{
            document.getElementsByClassName(id)[0].style.display='none'
        }
        
        this.getComment(id)
        
    }
    //添加评论
    async addComment(id){
        var fd = new FormData()
        fd.append('token',JSON.parse(localStorage.getItem('user_token')))
        fd.append('topicid',id)
        fd.append('content',document.getElementById('ref'+id).value)

        var { data } = await this.$axios.post(this.$baseurl+'/comment',fd)
        this.getComment(id)
        console.log(data)
    }

    render() {
        return (
            <div className="homepage">

            { this.state.newNnf.map(item=>{
                 if (item.file.split('.')[1]==='mp4') {
                     item.isVideo=true
                 }else{
                    item.isVideo=false
                 }
                 return (
                    <div className="social-item" key={ item.addtime }>
                    <div className="social-item-photo"><img src={ 'http://localhost:100/'+item.user.userimg }/></div>
    
                    <div className="social-item-content" >
                        <div className="social-item-name">{ item.user.username }</div>
                        <div className="social-item-text">{ item.content }</div>
                        <div className="social-item-img">{ item.isVideo ? <video src={ 'http://localhost:100/'+item.file } controls/>:<img src={ 'http://localhost:100/'+item.file }/> }</div>
                        <div className="social-item-interact">
                        <Icon type="heart"  onClick={ ()=>{ this.collect(item) } } id={ item._id } style={item.isSelect?{color:'red'}:{color:''}}/>
                        <span className='social-item-comment' onClick={ ()=>{ this.comment(item._id) } } >&nbsp;&nbsp;评论&nbsp;</span>
                        <div style={{ textAlign:'left',
                        background:'#ececf0',
                        padding:5,
                        borderRadius:3,
                        boxShadow:'1px 1px 1px #b4b4b6',
                        position:'relative',
                        marginTop:10,
                        display:'none'
                    }} className={ item._id } >
                            <div className='item-triangle'></div>
                            <div id={ 'item'+item._id }>
                            </div>
                            <div className="add-comment" >
                                <input type="text" id={ 'ref'+item._id }/>
                                <Button type="primary" onClick={ ()=>{ this.addComment(item._id) } }>
                                评论
                              </Button>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
                 )
            }
            ) }
                
            </div>
        )
    }

     async componentDidMount(){

        this.$route('我的动态')
        var { data } = await this.$axios.get(this.$baseurl+'/topics?page=1&num=10&userid='+JSON.parse(localStorage.getItem('user_information'))._id)
        console.log(data)


        var token=JSON.parse(localStorage.getItem('user_token'))
        var num = await this.$axios.get(this.$baseurl+'/collects?page=1&num=10&token='+token)

        //数据本地化
     

        if(localStorage.getItem('user_collect')!==null){

        var arr=JSON.parse(localStorage.getItem('user_collect')).map(item=>(item._id))
        console.log(arr)
        var newData=data.data.map(item=>{
            console.log(arr.indexOf(item._id))
            if (arr.indexOf(item._id)!== -1) {
                item.isSelect=true
            }else{
                item.isSelect=false
            }
            return item
        })
        this.setState({
            newNnf:newData
        })
        console.log(this.state.newNnf)

        }
 
      



    }
}
