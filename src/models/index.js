import sequelize from '../config/database.js';
import Usuario from './usuario.js';
import Cliente from './cliente.js';
import Cita from './cita.js';
import Asistencia from './asistencia.js';
import LlamadoTurno from './llamadoTurno.js';

// Relaciones Cliente
Cliente.hasMany(Cita, { foreignKey: 'Cliente_Id_cliente' });
Cliente.hasMany(Asistencia, { foreignKey: 'Cliente_Id_cliente' });
Cliente.hasMany(LlamadoTurno, { foreignKey: 'Cliente_Id_Cliente' });

// Relaciones Usuario
Usuario.hasMany(Cita, { foreignKey: 'Usuarios_Id_Usuarios' });

// Relaciones Cita
Cita.belongsTo(Cliente, { foreignKey: 'Cliente_Id_cliente' });
Cita.belongsTo(Usuario, { foreignKey: 'Usuarios_Id_Usuarios' });

// Relaciones Asistencia
Asistencia.belongsTo(Cliente, { foreignKey: 'Cliente_Id_cliente' });

// Relaciones LlamadoTurno
LlamadoTurno.belongsTo(Cliente, { foreignKey: 'Cliente_Id_Cliente' });

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