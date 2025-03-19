import request from 'supertest';
import app from '../app'; // Importa apenas o app, sem iniciar o servidor

let server: any;

beforeAll((done) => {
  server = app.listen(3001, () => {
    console.log("Servidor de teste iniciado na porta 3001.");
    done();
  });
});

afterAll((done) => {
  server.close(() => {
    console.log("Servidor de teste fechado com sucesso.");
    done();
  });
});

describe('Testando os endpoints', () => {
  it('Deve retornar status 200 ao acessar /entidades', async () => {
    const response = await request(app).get('/entidades');
    expect(response.status).toBe(200);
  });
});
