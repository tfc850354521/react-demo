import React, { Component } from 'react'
import'./index.css'
export default class Dialogue extends Component {
    constructor(){
      super()

      this.state={
        infList:[]
      }
    }
    render() {
      console.log(this.state.infList)
      // if (this.state.infList!=={}) {
      //   var Mound
      //  if (this.props.inf.status==='发送') {
      //    Mound=(
          // <div className="user-dialogue-right">
          //     <div className="content-right">
          //         <div className="user-name-right">{ this.state.infList.myuser.username }</div>
          //         <div className="information-right">{ this.state.infList.content }</div>
          //     </div>
          //  <div className="user-upload-right"><img src={ 'http://localhost:100/' +this.state.infList.myuser.userimg}/></div>
          // </div>
      //    )
         
      //  }else{
      //    Mound = (
      //     <div className="user-dialogue">
      //     <div className="user-upload"><img src={ 'http://localhost:100/' +this.state.infList.myuser.userimg}/></div>
      //     <div className="content">
      //         <div className="user-name">{ this.state.infList.myuser.username }</div>
      //         <div className="information">{ this.state.infList.content }</div>
      //     </div>
      //   </div>
      //    )
      //  }
      //  }
        return (
            <div className="dialogue">
            
            </div>
        )
    
  }
       
    componentDidMount(){

      this.$bus.on('infList',(data)=>{
        console.log(data)
        this.setState({
          infList:data
        })
      })

      console.log(this.state.infList)
    }
}
