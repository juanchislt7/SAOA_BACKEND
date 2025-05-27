import sequelize from '../config/database.js';
import Usuario from './usuario.js';
import Cliente from './cliente.js';
import Cita from './cita.js';
import Asistencia from './asistencia.js';
import LlamadoTurno from './llamado.js';

// Definir las relaciones entre modelos
Cliente.hasMany(Cita, { foreignKey: 'cliente_documento' });
Cita.belongsTo(Cliente, { foreignKey: 'cliente_documento' });

Cliente.hasMany(Asistencia, { foreignKey: 'cliente_documento' });
Asistencia.belongsTo(Cliente, { foreignKey: 'cliente_documento' });

Asistencia.hasMany(LlamadoTurno, { foreignKey: 'asistencia_id' });
LlamadoTurno.belongsTo(Asistencia, { foreignKey: 'asistencia_id' });

// Sincronizar modelos con la base de datos
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('Base de datos sincronizada correctamente');
  } catch (error) {
    console.error('Error al sincronizar la base de datos:', error);
  }
};

syncDatabase();

export {
  sequelize,
  Usuario,
  Cliente,
  Cita,
  Asistencia,
  LlamadoTurno
}; 