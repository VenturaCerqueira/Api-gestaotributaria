import express from 'express';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';
import winston from 'winston';
import { swaggerDocument } from '../swagger';
import { consultarEntidades } from './controllers/entidadeController';

dotenv.config();

const app = express();

// Logger
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({ format: winston.format.simple() }),
  ],
});

// Middleware
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rota de consulta de entidades utilizando o controlador
app.get('/entidades', consultarEntidades);

// Inicializa o servidor na porta definida no .env ou na porta 3001 por padrão
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}`);
});

export default app;
export { logger };
