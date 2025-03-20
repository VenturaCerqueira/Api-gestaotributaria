import { Request, Response } from 'express';
import Entidade from '../models/entidade';
import { Sequelize, QueryTypes } from 'sequelize'; // Importar o QueryTypes
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import IndiceFinanceiro from '../models/indicesFinanceiros'; // Importação do modelo

// Carregar variáveis do .env do banco matriz
dotenv.config();

// Função para gerar um .env temporário para a conexão com cada banco de dados
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

// Função para conectar ao banco de dados usando o Sequelize
const connectToDatabase = async (config: any): Promise<Sequelize> => {
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

// Função para consultar a tabela indice_financeiro de um banco
const consultarIndiceFinanceiro = async (sequelize: Sequelize): Promise<any[]> => {
  try {
    // Consultar a tabela 'indice_financeiro' e fazer o JOIN otimizado com CTE para pegar o último registro
    const query = `
      WITH MaxCompetencia AS (
        SELECT 
          fk_indice, 
          MAX(competencia) AS max_competencia
        FROM 
          indice_financeiro_correcao
        GROUP BY 
          fk_indice
      )
      SELECT 
          i.id, 
          i.nome, 
          c.percentual, 
          c.competencia
      FROM 
          indice_financeiro AS i
      JOIN 
          indice_financeiro_correcao AS c 
          ON i.id = c.fk_indice
      JOIN 
          MaxCompetencia AS mc
          ON c.fk_indice = mc.fk_indice AND c.competencia = mc.max_competencia;
    `;

    // Executando a consulta
    const indices = await sequelize.query(query, {
      type: QueryTypes.SELECT, // Define que a consulta é de seleção
    });

    return indices || []; // Retorna os resultados ou um array vazio se não encontrar nada
  } catch (error) {
    console.error('Erro ao consultar a tabela indice_financeiro:', error);
    throw new Error('Erro ao consultar a tabela indice_financeiro');
  }
};



// Controlador para consultar as entidades e seus dados financeiros
export const consultarEntidades = async (req: Request, res: Response) => {
  try {
    // Consulta as entidades no banco de dados matriz
    const entidades = await Entidade.findAll();

    // Para armazenar os dados financeiros de cada entidade
    const resultadosFinanceiros: any[] = [];

    // Para cada entidade, conecte-se ao banco correspondente
    for (let i = 0; i < entidades.length; i++) {
      const entidade = entidades[i];

      const config = {
        host: entidade.host,
        database: entidade.database,
        port: entidade.port,
      };

      // Conectar ao banco da entidade
      console.log(`Conectando ao banco de dados ${entidade.nome} (ID: ${entidade.id})...`);
      const sequelize = await connectToDatabase(config);

      // Consultar a tabela 'indice_financeiro' com os dados de correção
      const indicesFinanceiros = await consultarIndiceFinanceiro(sequelize);
      resultadosFinanceiros.push({
        entidade: entidade.nome,
        indicesFinanceiros,
      });

      // Desconectar após a consulta
      await sequelize.close();
      console.log(`Desconectado do banco de dados ${entidade.nome} (ID: ${entidade.id})`);
    }

    // Retornar os resultados financeiros de todas as entidades
    res.json(resultadosFinanceiros);
  } catch (error) {
    console.error('Erro ao consultar entidades:', error);
    res.status(500).json({ message: 'Erro ao consultar entidades' });
  }
};
