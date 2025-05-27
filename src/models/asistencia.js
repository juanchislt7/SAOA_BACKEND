import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Asistencia = sequelize.define('Asistencia', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cita_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  hora_llegada: {
    type: DataTypes.TIME,
    allowNull: false
  },
  observaciones: {
    type: DataTypes.TEXT
  }
});

// Método para verificar si existe una asistencia para una cita
Asistencia.checkExistingAttendance = async function(citaId) {
  return await this.findOne({
    where: { cita_id: citaId }
  });
};

export default Asistencia; 