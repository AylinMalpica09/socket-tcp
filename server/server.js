const net = require("net");
const { send } = require("process");

const server = net.createServer();
const serverPort = 2008;

const connections = new Map();




const sendMessage = (message, origin) => { //ESTE AYUDA A ENVIAR LOS MENSAJES QUE RECIBE EL SERVER A LOS DEMAS
    for (const socket of connections.keys()) {
        if (socket !== origin) {
            socket.write(message);
        }
};}

server.listen(serverPort, () => {
    console.log("Chat conecatdo en el puerto : ", server.address().port); //SEÑALA EL PUERTO DE CONEXION
    server.on("connection", (socket) => {
        const remoteSocket = `${socket.remoteAddress}:${socket.remotePort}`; 
        socket.setEncoding('utf-8')
        socket.on("data", (data) => {
            if ( !connections.has(socket)) { //validacion de nombres 
                let isRegistered =false;
                connections.forEach((nickname) => {
                    if (nickname == data) {
                        socket.write(' ---------------NOTA---------------\n El nombre ya esta en uso.\nPor favor escriba otro : ');
                        isRegistered=true;
                    }
                });

            if(!isRegistered) {
                connections.set(socket, data); 
                console.log(remoteSocket, " se conecto con el nombre de ---> ", data);
                socket.write('****CONEXIÓN EXITOSA****\n');
                socket.write(`---------Nota : Si desea salir de chat digite exit---------`);
                const userConnected = data;
                sendMessage("{ "+userConnected + " se conecto }", socket) //notifica la conexion 
            }
            }else {
                
                console.log(`|${connections.get(socket)}| : ${data}`); 
                console.log('------------------------------------------')
                const fullMessage = `[${connections.get(socket)}]: ${data}`; //MUESTRA EL MENSAJE A LOS DEMAS CONECTADOS
                console.log(`${remoteSocket} -> ${fullMessage}`);
                sendMessage(fullMessage, socket);
            }
        });
        socket.on("error", (err) => { //MUESTRA ALGUN ERROR 
            console.error(err.message);
            process.exit(1);
        });
    
        socket.on("close", () => { //AQUI NOTIFICA SI EXISTE ALGUNA DESCONEXION DEL CHAT
            console.log(connections.get(socket), " Finalizo la Comunicacion");
            const disconnectedUser = `${connections.get(socket)}`;
            sendMessage(disconnectedUser +" se desconecto");
            connections.delete(socket);
        });
    });
});