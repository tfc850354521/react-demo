import { Component } from 'react'
import axios from 'axios'

const baseurl='http://localhost:100'  //请求地址
const chaturl = 'ws://localhost:1001' //聊天接口地址

Component.prototype.$axios = axios;
Component.prototype.$baseurl = baseurl;
Component.prototype.$chaturl = chaturl;

export { axios,baseurl }


