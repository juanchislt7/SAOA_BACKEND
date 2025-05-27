import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Asistencia = sequelize.define('Asistencia', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cliente_documento: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'Clientes',
      key: 'documento'
    }
  },
  hora_llegada: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  hora_atencion: {
    type: DataTypes.DATE,
    allowNull: true
  },
  estado: {
    type: DataTypes.ENUM('esperando', 'en_atencion', 'atendido', 'ausente'),
    allowNull: false,
    defaultValue: 'esperando'
  },
  modulo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true
});

export default Asistencia; 