var PROTO_PATH = __dirname + '/bidirectional.proto'


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
var bidirectional_grpc = grpc.loadPackageDefinition(packageDefinition).bidirectional;

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


function main(){
    var client = new bidirectional_grpc.Bidirectional('localhost:50051', grpc.credentials.createInsecure());
    var call = client.GetServerResponse();
    
    call.on('data', function(note){
        console.log('[server to client]', note.message);
    })
    //call.on('end', callback);

    let gen = generate_messages();
    for(var i=0;i<5;i++){
        var note = gen.next().value
        call.write({message: note})
    }
    //call.end();
}


main();
