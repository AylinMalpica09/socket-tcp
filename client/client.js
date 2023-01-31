

const { Socket } = require("net");
const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
});

const exit = "exit";



const error = (message) => {
    console.error(message);
    process.exit(1);
};

const connect = (host, port) => { //muestra donde se conecta
    console.log(`Conectado desde --- ${host}:${port}`);

    const socket = new Socket();
    socket.connect({ host, port });
    socket.setEncoding("utf-8");

    socket.on("connect", () => { //registra el cliente
        console.log('********* Bienvenido al chat *********')
        readline.question("Escriba su nombre :  ", (username) => {
            socket.write(username);
        });

    readline.on("line", (message) => { //SI ESCRIBE LA CONDICIONAL SALE DEL CHAT
        //commandsUser(message);
        socket.write(message);
        if (message === exit) {
            socket.end();
        }
    });

    socket.on("data", (data) => { //MUESTRA LOS MENSAJES 
        console.log(data);
        });
    });

    socket.on("error", (err) => error(err.message)); //MANDA MENSAJE DE ERROR

    socket.on("close", () => {//NOTIFICA CUANDO TERMINAS CONEXION
        console.log("Terminaste Conexion");
        process.exit(0);
    });
};

connect("127.0.0.1" ,2008); // IP Y PUERTO DE CONEXION