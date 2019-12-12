import React, { Component } from 'react'
import './index.css'
export default class AddressList extends Component {

    constructor(){
        super()

        this.state={
            userList:[]
        }
    }

    render() {
        return (
            <div className="address-list">
            { this.state.userList.map(item=>(
                <div className="user-item" key={ item._id } onClick={ ()=> {this.props.history.push('/chat?id='+item._id)} }>
                    <div className="user-item-upload"><img src={'http://localhost:100/'+item.img }/></div>
                    <div className="user-item-name">{ item.username }</div>
                </div>
            )) }
                
              
            </div>
        )
    }
    async componentDidMount(){
      this.$route('通讯录')
      var {data} =await this.$axios.get(this.$baseurl+'/users?page=1&num=100')
      this.setState({
          userList:data.data
      })

    }
}
