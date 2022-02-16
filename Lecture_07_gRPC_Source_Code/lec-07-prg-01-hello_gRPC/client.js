var PROTO_PATH = __dirname + '/hello_grpc.proto'


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
var hello_grpc = grpc.loadPackageDefinition(packageDefinition).hello_grpc;

function main(){
    var client = new hello_grpc.MyService('localhost:50051', grpc.credentials.createInsecure());
    var inputnum = 4;
    client.MyFunction({value: inputnum}, function(err, response) {
        console.log('gRPC result:', response.value);
    });
}

main();