import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class Entidade extends Model {}

Entidade.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: 'Entidade',
    tableName: 'entidades',
    timestamps: false,
  }
);

export default Entidade;
