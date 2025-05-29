import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Asistencia = sequelize.define('Asistencia', {
  Turno_Asignado: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Estado_Cliente: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  Fecha_Asistencia: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  Hora_Asistencia: {
    type: DataTypes.TIME,
    allowNull: true
  },
  Cliente_Id_cliente: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'cliente',
      key: 'Id_Cliente'
    }
  }
}, {
  tableName: 'asistencia',
  timestamps: false
});

// Método para verificar si existe una asistencia para una cita
Asistencia.checkExistingAttendance = async function(citaId) {
  return await this.findOne({
    where: { cita_id: citaId }
  });
};

export default Asistencia; 