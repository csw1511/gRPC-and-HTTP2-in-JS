var PROTO_PATH = __dirname + '/serverstreaming.proto'


var async = require('async');
var grpc = require('@grpc/grpc-js')
var protoLoader = require('@grpc/proto-loader')
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
var serverstreaming_grpc = grpc.loadPackageDefinition(packageDefinition).serverstreaming;


function serverstreaming(callback){
    var client = new serverstreaming_grpc.ServerStreaming('localhost:50051', grpc.credentials.createInsecure());
    var messageNum = 5
    var call = client.GetServerResponse({value:messageNum});
    
    call.on('data', function(mess){
        console.log('[server to client]', mess.message);
    })
    call.on('end', callback);

}

function main() {
    async.series([
        serverstreaming
    ]);
  }
main();
