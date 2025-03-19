// src/models/indiceFinanceiro.ts
import { Sequelize, DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

class IndiceFinanceiro extends Model {
  public id!: number;
  public nome!: string;
}

IndiceFinanceiro.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'indice_financeiro',
    timestamps: false, // Caso você não tenha timestamps na tabela
  }
);

export default IndiceFinanceiro;
