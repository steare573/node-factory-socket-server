/**
 * Entry point to backend websocket server supporting the node factory app frontend
 *
 * @author Sean Teare <steare573@gmail.com>
 * @since 2018-06-13
 */
import express from 'express';
import socketIo from 'socket.io';
import { Server } from 'http';
import config from './config';
import { registerEventHandlers } from './socket/eventHandlers';
import log from './lib/logger';

const app = express();
const http = Server(app);
const io = socketIo(http);

io.on('connection', (socket) => {
  registerEventHandlers(socket, io.emit.bind(io));
});

http.listen(config.http.port, () => {
  log.info(`listening port ${config.http.port}`);
});
