import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const LlamadoTurno = sequelize.define('LlamadoTurno', {
  Id_Llamado: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Fecha_Atencion: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  Hora_Atencion: {
    type: DataTypes.TIME,
    allowNull: true
  },
  Servicio_Atendido: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  Cliente_Id_Cliente: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'cliente',
      key: 'Id_Cliente'
    }
  }
}, {
  tableName: 'llamado_turnos',
  timestamps: false
});

export default LlamadoTurno; 