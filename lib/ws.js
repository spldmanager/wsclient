/**
 * File Created by Lenovo at 2018/12/20.
 * Copyright 2016 CMCC Corporation Limited.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information").  You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license.
 *
 *
 * @Desc
 * @author Lenovo
 * @date 2018/12/20
 * @version
 */
const WebSocket = require('ws')
module.exports = function ({onMessage,onInterval,beforeOpen,onOpen},interval) {
    interval = interval || 5000
    this.ws ={};
    this.wsInterval;
    this.mac;
    this.onMessage = onMessage || function (){};
    this.onInterval = onInterval || function (){};
    this.beforeOpen = beforeOpen || function (){}
    this.onOpen = onOpen || function (){}
    this.intervalObj = null;
    this.startSocket = async (url)=>{
        clearInterval(this.intervalObj)
        try {
            let info = await this.beforeOpen() || {}
            this.mac =info.deviceId|| 'default'
            url = url || info.connection
            this.ws = new WebSocket(url)
            this.ws.isAlive = true;
            this.intervalObj = setInterval(()=>{
                this.onInterval(this.ws,()=>{
                    this.startSocket(url)
                })
            },interval)
            this.ws.onopen = ()=>{
                this.onOpen()
                console.debug('ws open')
            }
            this.ws.onerror = ({message}) =>{
                this.ws.isAlive = false
                console.error(message)
            }
            this.ws.isAlive = true
            this.ws.onmessage = ({data})=>{
                if (data == 'pong') {
                    console.debug('Get pong from server')
                    this.ws.isAlive = true
                    return
                } else console.log(data)
                this.onMessage(data,(content)=>{
                    this.ws.send(content)
                })
            }
        }catch(err){
            console.error(err)
            this.startSocket(url)
        }
    };
}
