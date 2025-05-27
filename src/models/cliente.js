import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import { Op } from 'sequelize';

const Cliente = sequelize.define('Cliente', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  apellido: {
    type: DataTypes.STRING,
    allowNull: false
  },
  documento: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true
    }
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: true
  },
  direccion: {
    type: DataTypes.STRING,
    allowNull: true
  },
  fecha_nacimiento: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true
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