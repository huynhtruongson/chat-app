import { CREATE_SOCKET_INSTANCE } from "./type";

export const createSocket = (socket) => ({
    type : CREATE_SOCKET_INSTANCE,
    payload : socket
})