import app, { logger } from './app';

const port = process.env.PORT || 300;

app.listen(port, () => {
  logger.info(`Servidor rodando na porta ${port}`);
});
