import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import { Op } from 'sequelize';

const Cliente = sequelize.define('Cliente', {
  Id_Cliente: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Nombre_Cliente: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  Apellido_Cliente: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  Email_Cliente: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  Telefono_cliente: {
    type: DataTypes.INTEGER(10),
    allowNull: true
  },
  Estado_Cliente: {
    type: DataTypes.STRING(10),
    allowNull: true
  }
}, {
  tableName: 'cliente',
  timestamps: false
});

// Método para verificar si existe un cliente con el mismo documento
Cliente.checkExistingDocument = async function(documento, excludeId = null) {
  const where = {
    documento
  };
  
  if (excludeId) {
    where.id = { [Op.ne]: excludeId };
  }
  
  return await this.findOne({ where });
};

export default Cliente; 