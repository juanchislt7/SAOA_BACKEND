import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import { Op } from 'sequelize';

const Cita = sequelize.define('Cita', {
  Id_cita: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Entidad: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  Servicio_Agendado: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  Fecha_cita: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  Observaciones: {
    type: DataTypes.STRING(60),
    allowNull: true
  },
  Usuarios_Id_Usuarios: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'Id_Usuario'
    }
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
  tableName: 'citas',
  timestamps: false
});

// Método para verificar si existe una cita en la misma fecha y hora
Cita.checkExistingAppointment = async function(fecha, hora, excludeId = null) {
  const where = {
    Fecha_cita: fecha,
    hora
  };
  
  if (excludeId) {
    where.Id_cita = { [Op.ne]: excludeId };
  }
  
  return await this.findOne({ where });
};

export default Cita; 