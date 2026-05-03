import dns from "node:dns";
import 'dotenv/config';
import { connectMongo } from './infrastructure/database/mongo/connection.js';
import { connectMysql } from './infrastructure/database/mysql/connection.js';
import { createServer } from './config/server.js';
import { config } from './config/index.js';

dns.setServers(['8.8.8.8', '8.8.4.4']);
dns.setDefaultResultOrder('ipv4first');

// Conectar a la base de datos
await connectMongo();
// await connectMysql();

// Crear el servidor Express configurado
const app = createServer();

// Iniciar el servidor
app.listen(config.port, () => {
    console.log(`Servidor escuchando en el puerto ${config.port} en modo ${config.env}`);
});