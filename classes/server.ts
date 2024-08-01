import express from "express";
import http from "http";
import { Server as IOServer } from "socket.io";
import { SERVER_PORT } from "../global/environment";
import * as socket from "../sockets/socket";
export default class Server {

  private static _intance: Server;
  public app: express.Application;
  public port: number;
  public io: IOServer;
  private httpServer: http.Server;

  private constructor() {

    this.app = express();
    this.port = SERVER_PORT;

    this.httpServer = new http.Server(this.app);
    this.io = new IOServer(this.httpServer, {
      cors: {
        origin: "*",  // Permitir todos los orígenes
        methods: ["GET", "POST"],  // Métodos permitidos
        credentials: true
      }
    });
    this.escucharSockets();
  }

  public static get instance() {
    return this._intance || (this._intance = new this());
  }

  private escucharSockets() {
    console.log("Escuchando conexiones - sockets");
    this.io.on('connection', cliente => {
      console.log("Cliente conectado");

      // CONECTAR A UNA SALA
      socket.entrarSala(cliente, this.io);
      socket.salirSala(cliente, this.io);

      // DATA DE SALA
      socket.dataSala(cliente, this.io);

      // Mensaje 
      socket.mensaje(cliente, this.io);

      // Desconectar
      socket.desconectar(cliente);

      // Mensaje Prueba Cliente
      socket.mensajePrueba(cliente, this.io);

      // Colaboradores Sala
      // socket.colaboradoresSala(cliente, this.io);
    });
  }

  start(callBack: () => void) {
    this.httpServer.listen(this.port, callBack);
  }
}
