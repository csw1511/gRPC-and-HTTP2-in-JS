const http2 = require('http2');
const fs = require('fs');
const { mainModule } = require('process');

var ip = 0
var port = 0

const server = http2.createSecureServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.crt')
}, (req,res)=>{
    ip = req.socket.remoteAddress;
    port = req.socket.remotePort;
});
server.on('error', (err) => console.error(err));


server.on('stream', (stream, headers) => {
  stream.respond({
    'content-type': 'text/plain',
    ':status': 200
  });
  const http2session = stream.session
  const alpnProtocol = http2session.alpnProtocol;

  console.log("Got connection: " +alpnProtocol + " from ["+ip+']:'+ port)
  
  stream.write(alpnProtocol)
  stream.write('Hello');
  stream.end();
});

function main(){
    server.listen(8080);
    console.log('Serving on https://0.0.0.0:8080');
}

main();