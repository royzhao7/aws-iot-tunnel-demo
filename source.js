const WebSocket = require('ws')
const {load} = require('protobufjs')

const token = 'AQGAAXgLqiuBXsL8NoP7q6z_tU-1ABsAAgABQQAMMDc5NDk2MTE5OTEyAAFUAANDQVQAAQAHYXdzLWttcwBPYXJuOmF3cy1jbjprbXM6Y24tbm9ydGgtMTowNDE3MDgzNDY5NzU6a2V5LzFlMDk3Y2U3LTU1NTQtNGVhZi04ZjQ2LWNiNGUxMzIyMzI0NAD2AQED_zdieBFC0Io946rT9Ewc_Kf5ad2QKe_6Z0PBXDG6RE05tgAAAM0BAITCzvrM5N3p4QEAAAAAAAAAIAUsHI9_AAAAAAAAAAAAAFgQ-o-286SFBC8OV3Rpooe3th8FCyktyWji2pdzmZ4RIiuqHQQAAAAm5OWAkX8AAAAAAAAAAAAAMAOeHQQAAABQBSwcRy9l6EQwK7TwcHKFaHyBDRdEWpofO5wJdZI6w9NQFDkAMN_Q3Q8U2jFPMYfbqIF3eajDXueV-lpaLy-FDp8Ym4WnWLeqDaFySBHuIUYc1swoXgAQGJqrozn6RU1oHGrMrQMMygAAAgAAAAAMAAAQAAAAAAAAAAAAAAAAAFaysx-Zk-V5O-iVpvcIAOz_____AAAAAQAAAAAAAAAAAAAAAQAAAC8V67iaIftZoEvLLJ4PGa70YBsg4SBsXfgj09lm1YWFClqEug-ZNuT4pa6ev9d2Ov3USeq5gAL47Zc_uETJzKk='
const aws_region = 'cn-north-1'

const mode = 'source'
const protopath = './schema.proto'

let url = `wss://data.tunneling.iot.${aws_region}.amazonaws.com.cn:443/tunnel?local-proxy-mode=${mode}`
let Message

const hello = 'Hello from the source'

const connection = new WebSocket(url, `aws.iot.securetunneling-2.0`, {
    headers: { 
            'access-token': token
    }
})

connection.onopen = async () => {
    console.log('Source is connected to the tunneling service')
    Message = await load(protopath)
    Message = Message.root.lookupType('Message')

    // start the stream 
    let tunnel_message = {
        type: 2, // Stream Start
        streamId: Math.floor(Math.random() * 1000), 
        ignorable: false,
        payload: null // We don't send data yet as we only start the stream
    }
    sendData(tunnel_message)

    // // send the data 
    // tunnel_message.type = 1 // DATA
    // tunnel_message.payload = Buffer.from(hello, 'utf-8')
    // sendData(tunnel_message)
}

connection.onmessage = async ({data}) => {
    try {
        let decoded_message = Message?.decode(data)
        if(decoded_message?.payload){
            console.log(decoded_message.payload.toString('utf-8'))
        }
    } catch (e) {
        console.log(e)
    }
}

const sendData = (data) => {
    try {
            let protoMessage = Message.verify(data)
            let encodedMessage = Message.encode(data).finish()
            let arrayWrapper  = new Uint8Array( 2 + encodedMessage.byteLength );
            arrayWrapper.set( new Uint8Array( [ Math.floor(encodedMessage.byteLength / 256), encodedMessage.byteLength % 256 ] ))
            arrayWrapper.set(encodedMessage, 2);
            connection.send(arrayWrapper)
        
    } catch (e) {
        console.log(e)
    }
}