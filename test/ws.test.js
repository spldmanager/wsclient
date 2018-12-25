/**
 * @Desc
 * @author Lenovo
 * @date 2018/12/20
 * @version
 */
var expect  = require('chai').expect
var ws = require('../lib/ws')
const WebSocket = require('ws');
describe('websocket',function () {
    let wsMock;
    let events = {}
    before(function () {
        //mock local ws server
        const wss = new WebSocket.Server({ port: 8080 });
        wss.on('connection', function connection(ws) {
            ws.on('message', function incoming(message) {
                console.log('received: %s', message);
                if(message == 'ping')
                    ws.send('pong')
            });
            ws.send('something');
        });
        wsMock = wss
    })
    it('should get ws object',function () {
        let wsObject = new ws(events)
        wsObject.startSocket('ws://localhost:8080/ws')
        expect(wsObject.ws).not.to.be.equal(undefined)
    })
    it('should get ws error',function (done) {
        let wsObject = new ws(events)
        wsObject.startSocket('ws://localhost/ws')
        setTimeout(()=>{
            clearInterval(wsObject.intervalObj)
            expect(wsObject.ws.isAlive).not.to.be.equal(true)
            done()
        },2000)

    })
    it('should get ws message',function (done) {
        let wsObject = new ws(events)
        wsObject.startSocket('ws://localhost:8080/ws')
        setTimeout(()=>{
            clearInterval(wsObject.intervalObj)
            expect(wsObject.ws.isAlive).not.to.be.equal(false)
            done()
        },2000)
    })
    it('should not get ws message',function (done) {
        let wsObject = new ws(events)
        wsObject.startSocket('ws://localhost/ws')
        setTimeout(()=>{
            clearInterval(wsObject.intervalObj)
            expect(wsObject.ws.isAlive).to.be.equal(false)
            done()
        },2000)
    })
})
