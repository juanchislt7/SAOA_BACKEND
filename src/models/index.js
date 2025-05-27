import sequelize from '../config/database.js';
import Usuario from './usuario.js';
import Cliente from './cliente.js';
import Cita from './cita.js';
import Asistencia from './asistencia.js';
import LlamadoTurno from './llamadoTurno.js';

// Relaciones Cliente-Cita
Cliente.hasMany(Cita, {
  foreignKey: 'cliente_id',
  as: 'citas'
});

Cita.belongsTo(Cliente, {
  foreignKey: 'cliente_id',
  as: 'cliente'
});

// Relaciones Cita-Asistencia
Cita.hasOne(Asistencia, {
  foreignKey: 'cita_id',
  as: 'asistencia'
});

Asistencia.belongsTo(Cita, {
  foreignKey: 'cita_id',
  as: 'cita'
});

// Relaciones Cita-LlamadoTurno
Cita.hasMany(LlamadoTurno, {
  foreignKey: 'cita_id',
  as: 'llamados'
});

LlamadoTurno.belongsTo(Cita, {
  foreignKey: 'cita_id',
  as: 'cita'
});

// Relaciones Usuario-LlamadoTurno
Usuario.hasMany(LlamadoTurno, {
  foreignKey: 'usuario_id',
  as: 'llamados'
});

LlamadoTurno.belongsTo(Usuario, {
  foreignKey: 'usuario_id',
  as: 'usuario'
});

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