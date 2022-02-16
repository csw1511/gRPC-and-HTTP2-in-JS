var PROTO_PATH = __dirname + '/bidirectional.proto'

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
var bidirec_proto = grpc.loadPackageDefinition(packageDefinition).bidirectional;

function GetServerResponse(call){
    console.log('Server processing gRPC bidirectional streaming.')
    call.on('data', function(note){
        call.write(note)
    })/*
    call.on('end', function(){
        call.end();
    })*/
}


function main(){
    var server = new grpc.Server();
    server.addService(bidirec_proto.Bidirectional.service, {GetServerResponse: GetServerResponse});
    server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(),()=>{
        server.start();
        console.log('Starting server. Listening on port 50051.')
    })
}

main();

exports.main = main;