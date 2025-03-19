import request from 'supertest';
import app from '../app'; // Importa o app
import sequelize from '../config/database'; // Conexão com o banco

describe('Consulta Entidades (real, somente leitura)', () => {
  beforeAll(async () => {
    // Verifica se a conexão com o banco está funcional
    await sequelize.authenticate();
  });

  it('Deve retornar todas as entidades existentes no banco como JSON', async () => {
    const response = await request(app).get('/entidades');

    // Exibe os dados retornados no console
    console.log('Dados retornados pela API:', response.body);

    
    expect(response.status).toBe(200);

   
    expect(Array.isArray(response.body)).toBe(true);

    
    response.body.forEach((entidade: any) => {
      expect(entidade).toHaveProperty('id');
      expect(entidade).toHaveProperty('nome');
      expect(entidade).toHaveProperty('slug');
      expect(entidade).toHaveProperty('database');
      expect(entidade).toHaveProperty('username');
      expect(entidade).toHaveProperty('host');
      expect(entidade).toHaveProperty('port');
    });
  });

  afterAll(async () => {
    // Fecha a conexão com o banco após os testes
    await sequelize.close();
  });
});
