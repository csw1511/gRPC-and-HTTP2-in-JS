const http2 = require('http2');
const http = require('http')
const fs = require('fs');
var EventEmitter = require('events');
var custom_event = new EventEmitter();
const { mainModule } = require('process');

const options = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.crt')
}

var ip = 0
var port = 0
var server

server = http2.createSecureServer(options, (req,res)=>{
    ip = req.socket.remoteAddress;
    port = req.socket.remotePort; 
});
server.on('error', (err) => {
});


server.on('stream', (stream, headers) => {
  stream.respond({
    'content-type': 'text/plain',
    ':status': 200
  });
  const http2session = stream.session
  const alpnProtocol = http2session.alpnProtocol;

  console.log("Got connection: " +alpnProtocol + " from [" + ip+']:'+ port)
  
  stream.write(alpnProtocol)
  stream.write('Procotol: '+alpnProtocol);
  stream.end();
});


function main(){
    server.listen(8080);
    console.log('Serving on https://0.0.0.0:8080');
}

main();