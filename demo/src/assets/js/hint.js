import { Toast } from 'antd-mobile';
import { Component } from 'react'

 function showToast(data) {
    if(data.code===1){
       Toast.success(data.text, 1)
    }else{
      Toast.fail(data.text, 1)
    }
   
  }

  function rout(data) {

    document.getElementsByClassName('am-navbar-title')[0].innerHTML=data

  }
  
  Component.prototype.$route=rout
  Component.prototype.$hint=showToast

  export default showToast