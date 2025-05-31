import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

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
    type: DataTypes.STRING(30),
    allowNull: true
  },
  Estado_Usuario: {
    type: DataTypes.STRING(30),
    allowNull: true
  },
  Contraseña: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
}, {
  tableName: 'usuarios',
  timestamps: false,
  hooks: {
    beforeCreate: async (usuario) => {
      if (usuario.Contraseña) {
        usuario.Contraseña = await bcrypt.hash(usuario.Contraseña, SALT_ROUNDS);
      }
    },
    beforeUpdate: async (usuario) => {
      if (usuario.changed('Contraseña')) {
        usuario.Contraseña = await bcrypt.hash(usuario.Contraseña, SALT_ROUNDS);
      }
    }
  }
});

// Método para verificar contraseña
Usuario.prototype.verifyPassword = async function(password) {
  try {
    console.log('verifyPassword - Iniciando verificación');
    console.log('Contraseña a verificar:', password);

    console.log('Hash almacenado:', this.Contraseña);
    
    const result = await bcrypt.compare(password, this.Contraseña);
    console.log('Resultado de bcrypt.compare:', result);
    
    return result;
  } catch (error) {
    console.error('Error en verifyPassword:', error);
    return false;
  }
};

export default Usuario; 