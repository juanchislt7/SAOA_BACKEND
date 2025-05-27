import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import { Op } from 'sequelize';

const Cita = sequelize.define('Cita', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cliente_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  hora: {
    type: DataTypes.TIME,
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM('PENDING', 'COMPLETED', 'CANCELLED'),
    defaultValue: 'PENDING'
  },
  observaciones: {
    type: DataTypes.TEXT
  }
});

// Método para verificar si existe una cita en la misma fecha y hora
Cita.checkExistingAppointment = async function(fecha, hora, excludeId = null) {
  const where = {
    fecha,
    hora
  };
  
  if (excludeId) {
    where.id = { [Op.ne]: excludeId };
  }
  
  return await this.findOne({ where });
};

export default Cita; 