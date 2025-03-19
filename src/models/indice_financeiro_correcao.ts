import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';  // Se você já tem um arquivo de configuração para o sequelize, use-o

class IndiceFinanceiroCorrecao extends Model {
  public id!: number;
  public fk_indice!: number;
  public competencia!: Date;
  public percentual!: number;
}

IndiceFinanceiroCorrecao.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    fk_indice: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    competencia: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    percentual: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'indice_financeiro_correcao',
    timestamps: false,  // Se não houver campos de criação e atualização no banco
  }
);

export default IndiceFinanceiroCorrecao;
