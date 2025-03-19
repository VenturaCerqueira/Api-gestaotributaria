import { Sequelize } from 'sequelize';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Função para gerar um .env temporário para a conexão
const generateTempEnvFile = (config: any): string => {
  const tempEnvPath = path.resolve(__dirname, '..', '.env.temp');
  const envContent = `
    DB_HOST=${config.host}
    DB_USER=${process.env.DB_USER}    # Mantém o usuário do .env original
    DB_PASS=${process.env.DB_PASS}    # Mantém a senha do .env original
    DB_NAME=${config.database}        # Muda para o DB_NAME da entidade
    DB_PORT=${config.port}
  `;
  fs.writeFileSync(tempEnvPath, envContent);
  return tempEnvPath;
};

// Função para conectar ao banco de dados utilizando Sequelize
export const connectToDatabase = async (config: any): Promise<Sequelize> => {
  const tempEnvPath = generateTempEnvFile(config);

  // Carregar as variáveis do .env temporário
  dotenv.config({ path: tempEnvPath });

  // Conectar usando Sequelize
  const sequelize = new Sequelize(process.env.DB_NAME!, process.env.DB_USER!, process.env.DB_PASS!, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: parseInt(process.env.DB_PORT || '3306'),
  });

  try {
    await sequelize.authenticate();
    console.log(`Conectado ao banco ${config.database} com sucesso!`);
  } catch (error) {
    console.error(`Erro ao conectar ao banco ${config.database}:`, error);
  }

  // Exclui o arquivo .env temporário após a conexão
  fs.unlinkSync(tempEnvPath);

  return sequelize;
};

// Função para desconectar do banco de dados
export const disconnectFromDatabase = async (sequelize: Sequelize): Promise<void> => {
  try {
    await sequelize.close();
    console.log('Desconectado do banco de dados.');
  } catch (error) {
    console.error('Erro ao desconectar do banco de dados:', error);
  }
};
