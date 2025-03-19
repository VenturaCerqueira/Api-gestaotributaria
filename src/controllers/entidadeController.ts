// src/controllers/entidadeController.ts
import { Request, Response } from 'express';
import Entidade from '../models/entidade';

export const consultarEntidades = async (req: Request, res: Response) => {
  try {
    const entidades = await Entidade.findAll();  // Busca todas as entidades no banco de dados
    res.json(entidades);  // Retorna as entidades como resposta em formato JSON
  } catch (error) {
    console.error('Erro ao consultar entidades:', error);
    res.status(500).json({ message: 'Erro ao consultar entidades' });  // Retorna erro caso aconteça algum problema
  }
};
