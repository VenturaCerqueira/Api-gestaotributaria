import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class Entidade extends Model {}

Entidade.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    database: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    host: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    port: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Entidade',
    tableName: 'entidades',
    timestamps: false, // Os timestamps automáticos continuam desativados
  }
);

export default Entidade;
