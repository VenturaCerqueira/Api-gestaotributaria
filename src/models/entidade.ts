import { Sequelize, DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

class Entidade extends Model {
  public id!: number;
  public nome!: string;
  public host!: string;
  public database!: string;
  public port!: number;
}

Entidade.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    host: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    database: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    port: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'entidades',
    timestamps: false,  // Desabilita as colunas `createdAt` e `updatedAt`
    paranoid: false,    // Impede o uso de exclusões lógicas com `deletedAt`
  }
);

export default Entidade;
