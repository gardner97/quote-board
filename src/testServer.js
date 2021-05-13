const WebSocket = require('ws');
var {spawn} = require('child_process')
// require("child_process").spawn('python', ['./kinesisStream.py'], {
//     cwd: process.cwd(),
//     detached: true,
//     stdio: "inherit"
//   });
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
const py = spawn("python", ["kinesisStream.py"]);
const rl  = require('readline').createInterface({ input: py.stdout });

console.log("Python process has pid:", py.pid)

// listen for the new image
rl.on("line", (line) => {
    //console.log("NEW DATA: ")
    //xsconsole.log(typeof line)
    console.log(line)
    // broadcast the new binary image to all clients
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(line);
        }
    });
});

py.stderr.on("data", (data) => {
    console.error(data.toString());
});

export default wss;