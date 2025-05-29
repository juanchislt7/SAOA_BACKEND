import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import bcrypt from 'bcryptjs';

const Usuario = sequelize.define('Usuario', {
  Id_Usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Nombre: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  Apellido: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  Entidad: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  Email: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  Celular: {
    type: DataTypes.BIGINT(20),
    allowNull: true
  },
  Tipo_Usuario: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  Estado_Usuario: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  Contraseña: {
    type: DataTypes.STRING(45),
    allowNull: true
  }
}, {
  tableName: 'usuarios',
  timestamps: false,
  hooks: {
    beforeCreate: async (usuario) => {
      if (usuario.Contraseña) {
        const salt = await bcrypt.genSalt(10);
        usuario.Contraseña = await bcrypt.hash(usuario.Contraseña, salt);
      }
    },
    beforeUpdate: async (usuario) => {
      if (usuario.changed('Contraseña')) {
        const salt = await bcrypt.genSalt(10);
        usuario.Contraseña = await bcrypt.hash(usuario.Contraseña, salt);
      }
    }
  }
});

// Método para verificar contraseña
Usuario.prototype.verifyPassword = async function(password) {
  return await bcrypt.compare(password, this.Contraseña);
};

export default Usuario; 