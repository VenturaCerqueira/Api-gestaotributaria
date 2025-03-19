import express from 'express';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';
import winston from 'winston';
import { Request, Response } from 'express';
import { swaggerDocument } from '../swagger';
import Entidade from './models/entidade';

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

// Endpoints
app.get('/entidades', async (req: Request, res: Response) => {
  try {
    const entidades = await Entidade.findAll();
    res.json(entidades);
  } catch (error) {
    logger.error('Erro ao consultar entidades:', error);
    res.status(500).json({ message: 'Erro ao consultar entidades' });
  }
});

// Apenas exporta o app sem iniciar o servidor
export default app;
export { logger };
