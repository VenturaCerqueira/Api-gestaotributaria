import { sequelize } from '../config/database';  // CORRETO: importação nomeada
import { DataTypes } from 'sequelize';

const IndiceFinanceiro = sequelize.define('IndiceFinanceiro', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  nome: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
});

export default IndiceFinanceiro;
