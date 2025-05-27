import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const LlamadoTurno = sequelize.define('LlamadoTurno', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  asistencia_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Asistencias',
      key: 'id'
    }
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Usuarios',
      key: 'id'
    }
  },
  hora_llamado: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  modulo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  numero_llamado: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  atendido: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  timestamps: true
});

export default LlamadoTurno; 