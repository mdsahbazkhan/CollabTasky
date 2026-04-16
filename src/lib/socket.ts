import { io } from "socket.io-client";

export const socket = io(`${process.env.NEXT_PUBLIC_API_URL}`, {
  transports: ["websocket", "polling"],
  autoConnect: false,
  withCredentials: true,
});
