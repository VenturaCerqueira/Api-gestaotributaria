import express from 'express';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';
import winston from 'winston';
import { Request, Response } from 'express';
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

// Rota de consulta de entidades
app.get('/entidades', consultarEntidades);

// Inicia o servidor na porta configurada no .env
const port = process.env.PORT || 3000;
app.listen(port, () => {
  logger.info(`Servidor rodando na porta ${port}`);
});

export default app;
