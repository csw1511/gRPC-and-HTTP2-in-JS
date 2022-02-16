var PROTO_PATH = __dirname + '/serverstreaming.proto'

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
var serverstreaming_grpc = grpc.loadPackageDefinition(packageDefinition).serverstreaming;

function* generate_messages(){
    var messages = [
        "message #1", 
        "message #2", 
        "message #3", 
        "message #4", 
        "message #5"
    ]
    for(var i =0; i<messages.length; i++){
        yield messages[i];
    }
}

function GetServerResponse(call){
    let gen = generate_messages();
    console.log('Server processing gRPC server-streaming',call.request.value)

    for(var i=0; i<call.request.value;i++){
        var note = gen.next().value
        call.write({message:note})
    }
    call.end();
}


function main(){
    var server = new grpc.Server();
    server.addService(serverstreaming_grpc.ServerStreaming.service, {GetServerResponse: GetServerResponse});
    server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(),()=>{
        server.start();
        console.log('Starting server. Listening on port 50051.')
    })
}

main();

exports.main = main;