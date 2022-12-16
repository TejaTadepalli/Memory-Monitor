const http = require('http');
const socketio = require('socket.io');
const os = require('os');
console.log(os.freemem(),os.totalmem());    // to check the memory usage & print on the console

const fs = require('fs');

const server = http.createServer(function (req,res){
    //console.log(req);             // req is request object

    fs.readFile(__dirname + '/public/index.html',function(err,data){
        res.writeHead(200);
        res.end(data);              // res is response object
    });
});

const io = socketio(server);        // listen to the server
io.on('connection',function(socket){
    //console.log(socket);          listen to the event for the socket... 
    /* 'connection' is the event name based on the information we get from "socket", 
    we will be able to used it to send the data to the client for various applications */
    setInterval(() => {             // it will run a function that we pass after every
        const availableMem = os.freemem()
        const totalMem = os.totalmem()
        const percent = availableMem / totalMem * 100

        socket.emit('memory-update',{   // emit the event to the client
            // "percent" if we type this we will get a huge number... hence we will make it upto 2 decimal places
            percent: percent.toFixed(2) // toFixed() is a method that will round off the number to 2 decimal places
        });      
    }, 1000);                       // it will run a function that we pass after every time interval (1sec)
    
    socket.emit('connected',{
        message: 'You are connected!'   // with every "event" (refresh), it will print on the console
    })
});                         


server.listen(5000);                // listen to port 3000

// if we want to have listen to the file changes and restart it automatically: use the command in terminal
// "node --watch index.js"

//socket is "event-driven"