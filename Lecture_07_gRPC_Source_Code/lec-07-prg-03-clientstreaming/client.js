var PROTO_PATH = __dirname + '/clientstreaming.proto'


var grpc = require('@grpc/grpc-js')
var protoLoader = require('@grpc/proto-loader')
var async = require('async');
var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    }
)
var clientstreaming_grpc = grpc.loadPackageDefinition(packageDefinition).clientstreaming;

function* generate_messages(){
    var messages = [
        "message #1", 
        "message #2", 
        "message #3", 
        "message #4", 
        "message #5"
    ]
    for(var i =0; i<messages.length; i++){
        console.log("[client to server]",  messages[i])
        yield messages[i];
    }
}

function clientstreaming(callback){
    var client = new clientstreaming_grpc.ClientStreaming('localhost:50051', grpc.credentials.createInsecure());
    var call = client.GetServerResponse(function(error, stats){
        if (error){
            callback(error);
            return;
        }
        console.log('[server to client]',stats.value)
        callback();
    });

    /**
     * 
     call.on('data', function(note){
        console.log('[server to client]', note.message);
    })
     * 
     */

    let gen = generate_messages();
    for(var i=0;i<5;i++){
        var note = gen.next().value
        call.write({message: note})
    }
/*
    client.GetServerResponse(null, function(err,response){
        console.log(response.value)
    })*/
    call.end();
}

function main() {
    async.series([
        clientstreaming
    ]);
}

main();