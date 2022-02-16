var PROTO_PATH = __dirname + '/hello_grpc.proto'

var grpc = require('@grpc/grpc-js');
var protoLoader = require('@grpc/proto-loader');
var hello_grpc = require('./hello_grpc');

var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
var hello_proto = grpc.loadPackageDefinition(packageDefinition).hello_grpc;


function MyFunction(call, callback){
    var tmpresult = hello_grpc.my_func(call.request.value);
    callback(null, {value: tmpresult});
}

function main(){
    var server = new grpc.Server();
    server.addService(hello_proto.MyService.service, {MyFunction: MyFunction});
    server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(),()=>{
        server.start();
        console.log('Starting server. Listening on port 50051.')
    })
}

main();