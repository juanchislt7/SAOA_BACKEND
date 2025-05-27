import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Cita = sequelize.define('Cita', {
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
  fecha_hora: {
    type: DataTypes.DATE,
    allowNull: false
  },
  tipo_servicio: {
    type: DataTypes.STRING,
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'confirmada', 'cancelada', 'atendida'),
    allowNull: false,
    defaultValue: 'pendiente'
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  duracion: {
    type: DataTypes.INTEGER, // duración en minutos
    allowNull: false,
    defaultValue: 30
  }
}, {
  timestamps: true
});

export default Cita; 