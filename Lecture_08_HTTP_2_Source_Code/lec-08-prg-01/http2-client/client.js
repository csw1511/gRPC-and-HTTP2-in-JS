const http2 = require('http2');
const fs = require('fs');
var url = 'https://localhost:8080'

const client = http2.connect(url, {
  ca: fs.readFileSync('server.crt')
});

client.on('error', (err) => console.error(err));

const req = client.request({ ':path': '/' });

var resstatus = ''
var resdata = []
req.on('response', (headers, flags) => {
    if(process.argv[2] == '-version' && process.argv[3] == 1){
        console.log("Connect to "+ url +" over TLS using HTTP/1.1")
    }
    else{
        console.log("Connect to "+ url +" over TLS using HTTP/2")
    }
    resstatus = headers[":status"]
});

req.setEncoding('utf8');
req.on('data', (chunk) => { resdata.push(chunk)});
req.on('end', () => {
  console.log(`Got response ${resstatus}: ${resdata[0]} ${resdata[1]}`)
  client.close();
});
req.end();