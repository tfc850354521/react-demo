import React, { Component } from 'react'
import { Spin } from 'antd';
export default class Await extends Component {
    render() {
        return (
            <Spin style={{ position:'fixed',top:'50%',left:'50%', transform:'translate(-50%,-50%)' }}/>
        )
    }
}
