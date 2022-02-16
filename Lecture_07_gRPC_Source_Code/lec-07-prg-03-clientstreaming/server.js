var PROTO_PATH = __dirname + '/clientstreaming.proto'

var grpc = require('@grpc/grpc-js');
var protoLoader = require('@grpc/proto-loader');

var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
var clientstreaming_grpc = grpc.loadPackageDefinition(packageDefinition).clientstreaming;

function GetServerResponse(call, callback){
    var count = 0;
    console.log('Server processing gRPC client-streaming.')
    call.on('data', function(note){
        count += 1
    })

    call.on('end', function() {
        callback(null,{value:count});
    });
}


function main(){
    var server = new grpc.Server();
    server.addService(clientstreaming_grpc.ClientStreaming.service, {GetServerResponse: GetServerResponse});
    server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(),()=>{
        server.start();
        console.log('Starting server. Listening on port 50051.')
    })
}

main();

exports.main = main;