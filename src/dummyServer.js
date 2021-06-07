const WebSocket = require('ws');
var {spawn} = require('child_process')

// create websocket server
// open "client.html" in a browser and see how the images flaps between two
const wss = new WebSocket.Server({
    port: 8080
});

// feedback
wss.on("connection", function connection(ws) {
    console.log("Client conneted to websocket");
});

// spawn python child process
const py2 = spawn("python",["dummyServer.py"]);

const rl  = require('readline').createInterface({ input: py2.stdout });

console.log("Python process has pid:", py2.pid)

// listen for the new image
rl.on("line", (line) => {
    console.log(line)
    // broadcast the new binary image to all clients
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(line);
        }
    });
});


py2.stderr.on("data", (data) => {
    console.error(data.toString());
});
