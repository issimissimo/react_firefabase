import { io } from "socket.io-client";

const IP = "https://test.issimissimo.com:30000";
const roomName = "dakjhuishuiywuijhj742678uiwig";


const _socket = io.connect(IP);
_socket.emit('joinRoom', roomName);


_socket.on("send to all in room", function (msg) {
    console.log(msg)
});

_socket.on("send to others in room", function (msg) {
    console.log(msg)
});



const Socket = {

    SendToAllInRoom: () => {
        _socket.emit("send to all in room", { room: roomName, msg: "antani!" });
    },

    SendToOthersInRoom: () => {
        _socket.emit("send to others in room", { room: roomName, msg: "cippala!" });
    },
}