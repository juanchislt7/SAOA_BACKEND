import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Usuario from './usuario.js';
import Cita from './cita.js';

const LlamadoTurno = sequelize.define('LlamadoTurno', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cita_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Cita,
      key: 'id'
    }
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Usuario,
      key: 'id'
    }
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  hora: {
    type: DataTypes.TIME,
    allowNull: false
  },
  tipo_llamado: {
    type: DataTypes.ENUM('PRIMERO', 'SEGUNDO', 'TERCERO'),
    allowNull: false
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'llamados_turno',
  timestamps: true,
  createdAt: 'fecha_creacion',
  updatedAt: 'fecha_actualizacion'
});

// Definir relaciones
LlamadoTurno.belongsTo(Usuario, {
  foreignKey: 'usuario_id',
  as: 'usuario'
});

LlamadoTurno.belongsTo(Cita, {
  foreignKey: 'cita_id',
  as: 'cita'
});

export default LlamadoTurno; 