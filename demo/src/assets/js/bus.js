import { Component } from 'react'
import { EventEmitter } from 'events'

const bus =new EventEmitter()

Component.prototype.$bus=bus

export default bus