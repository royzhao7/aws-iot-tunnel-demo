const WebSocket = require('ws')
const token = 'AQGAAXizfwFm0D6iOnYq8m8m-GmSABsAAgABQQAMMDc5NDk2MTE5OTEyAAFUAANDQVQAAQAHYXdzLWttcwBPYXJuOmF3cy1jbjprbXM6Y24tbm9ydGgtMTowNDE3MDgzNDY5NzU6a2V5LzFlMDk3Y2U3LTU1NTQtNGVhZi04ZjQ2LWNiNGUxMzIyMzI0NAD2AQED_zdieBFC0Io946rT9Ewc_Kf5ad2QKe_6Z0PBXDG6RE05tgAAAM0BAISdT8kStgWWe_BoEPp_-lNKKBk8eLd_AABQGTx4t38AAGAWqOOcHpER3Snub-VBv1WJ7s6p84il8wfLLUZrj4WepngAAAAAAAABAAAAAAAAAIAWPHi3fwAAAAAAAAAAAAD4iAGgztnYC-adOW0c4Rhz8Hex7IhISiNfB6x8ROiFz5A9HCQAMIHR60DHJJimQPbk9pyvY6Ma0JmVMANe0WY9vSZ56bh0mKRc1id_oeYQ5xSVzbu-kQAQiLPKX_AI9flrf0Eo4v39QwAAAgAAAAAMAAAQAAAAAAAAAAAAAAAAACirLaZ5wJTbORaTDG230_L_____AAAAAQAAAAAAAAAAAAAAAQAAAC99kkONcS98QCon5GkQhz-hxo7V2Ncygfcrw4TkbyfYdDvfsx7JAk_hy09FdGYjheF21fMHOFYR0e-tDosr5-8='
const aws_region = 'cn-north-1'
const mode = 'source'

let url = `wss://data.tunneling.iot.${aws_region}.amazonaws.com.cn:443/tunnel?local-proxy-mode=${mode}`

console.log(url)
const connection = new WebSocket(url, `aws.iot.securetunneling-2.0`, {
    headers: { 
            'access-token': token
    }
})

connection.onopen = async () => {
    console.log('Source is connected to the tunneling service')
}
connection.onmessage= async (event) => {
    console.log(event.data)
}