import { Cita, Usuario } from '../models/index.js';
import { Op } from 'sequelize';

const citaController = {
  async list(req, res) {
    try {
      const { page = 1, limit = 10, Fecha_cita, Identificacion_Cliente } = req.query;
      const offset = (page - 1) * limit;

      const where = {};
      if (Fecha_cita) {
        where.Fecha_cita = Fecha_cita;
      }
      if (Identificacion_Cliente) {
        where.Identificacion_Cliente = {
          [Op.like]: `%${Identificacion_Cliente}%`
        };
      }

      const { count, rows } = await Cita.findAndCountAll({
        where,
        include: [{
          model: Usuario,
          attributes: ['Id_Usuario', 'Nombre', 'Apellido', 'Entidad']
        }],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['Fecha_cita', 'ASC']]
      });

      return res.json({
        data: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      });
    } catch (error) {
      console.error('Error al listar citas:', error);
      return res.status(500).json({ error: 'Error al listar citas' });
    }
  },

  async getById(req, res) {
    try {
      const cita = await Cita.findByPk(req.params.id, {
        include: [{
          model: Usuario,
          attributes: ['Id_Usuario', 'Nombre', 'Apellido', 'Entidad']
        }]
      });

      if (!cita) {
        return res.status(404).json({ error: 'Cita no encontrada' });
      }

      return res.json(cita);
    } catch (error) {
      console.error('Error al obtener cita:', error);
      return res.status(500).json({ error: 'Error al obtener cita' });
    }
  },

  async create(req, res) {
    try {
      const { 
        Entidad, 
        Servicio_Agendado, 
        Fecha_cita, 
        Observaciones, 
        Identificacion_Cliente,
        Usuarios_Id_Usuarios
      } = req.body;

      // Verificar que el usuario existe
      const usuario = await Usuario.findByPk(Usuarios_Id_Usuarios);
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      // Verificar si ya existe una cita para esa fecha
      const existingCita = await Cita.checkExistingAppointment(Fecha_cita);
      if (existingCita) {
        return res.status(400).json({ error: 'Ya existe una cita para esta fecha' });
      }

      const cita = await Cita.create({
        Entidad,
        Servicio_Agendado,
        Fecha_cita,
        Observaciones,
        Identificacion_Cliente,
        Usuarios_Id_Usuarios
      });

      const citaConRelaciones = await Cita.findByPk(cita.Id_cita, {
        include: [{
          model: Usuario,
          attributes: ['Id_Usuario', 'Nombre', 'Apellido', 'Entidad']
        }]
      });

      return res.status(201).json({
        message: 'Cita creada correctamente',
        cita: citaConRelaciones
      });
    } catch (error) {
      console.error('Error al crear cita:', error);
      return res.status(500).json({ error: 'Error al crear cita' });
    }
  },

  async update(req, res) {
    try {
      const { 
        Entidad, 
        Servicio_Agendado, 
        Fecha_cita, 
        Observaciones, 
        Identificacion_Cliente,
        Usuarios_Id_Usuarios
      } = req.body;

      const cita = await Cita.findByPk(req.params.id);
      if (!cita) {
        return res.status(404).json({ error: 'Cita no encontrada' });
      }

      // Verificar que el usuario existe si se está actualizando
      if (Usuarios_Id_Usuarios) {
        const usuario = await Usuario.findByPk(Usuarios_Id_Usuarios);
        if (!usuario) {
          return res.status(404).json({ error: 'Usuario no encontrado' });
        }
      }

      // Verificar si ya existe otra cita para esa fecha
      if (Fecha_cita) {
        const existingCita = await Cita.checkExistingAppointment(Fecha_cita, req.params.id);
        if (existingCita) {
          return res.status(400).json({ error: 'Ya existe una cita para esta fecha' });
        }
      }

      await cita.update({
        Entidad,
        Servicio_Agendado,
        Fecha_cita,
        Observaciones,
        Identificacion_Cliente,
        Usuarios_Id_Usuarios
      });

      const citaActualizada = await Cita.findByPk(cita.Id_cita, {
        include: [{
          model: Usuario,
          attributes: ['Id_Usuario', 'Nombre', 'Apellido', 'Entidad']
        }]
      });

      return res.json({
        message: 'Cita actualizada correctamente',
        cita: citaActualizada
      });
    } catch (error) {
      console.error('Error al actualizar cita:', error);
      return res.status(500).json({ error: 'Error al actualizar cita' });
    }
  },

  async delete(req, res) {
    try {
      const cita = await Cita.findByPk(req.params.id);
      if (!cita) {
        return res.status(404).json({ error: 'Cita no encontrada' });
      }

      await cita.destroy();
      return res.json({ message: 'Cita eliminada correctamente' });
    } catch (error) {
      console.error('Error al eliminar cita:', error);
      return res.status(500).json({ error: 'Error al eliminar cita' });
    }
  },

  async getByFecha(req, res) {
    try {
      const { fecha } = req.params;
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const { count, rows } = await Cita.findAndCountAll({
        where: { Fecha_cita: fecha },
        include: [{
          model: Usuario,
          attributes: ['Id_Usuario', 'Nombre', 'Apellido', 'Entidad']
        }],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['Fecha_cita', 'ASC']]
      });

      return res.json({
        data: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      });
    } catch (error) {
      console.error('Error al obtener citas por fecha:', error);
      return res.status(500).json({ error: 'Error al obtener citas por fecha' });
    }
  },

  async getAllCitas(req, res) {
    try {
      const citas = await Cita.findAll({
        include: [
          {
            model: Usuario,
            attributes: ['id', 'nombre', 'apellido', 'entidad']
          }
        ]
      });
      res.json(citas);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener las citas', error: error.message });
    }
  },

  async searchCitasByDate(req, res) {
    try {
      const { fecha } = req.query;
      const citas = await Cita.findAll({
        where: {
          fecha: fecha
        },
        include: [
          {
            model: Usuario,
            attributes: ['id', 'nombre', 'apellido', 'entidad']
          }
        ]
      });
      res.json(citas);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al buscar citas', error: error.message });
    }
  },

  async getByIdentificacion(req, res) {
    try {
      const { identificacion } = req.params;
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const { count, rows } = await Cita.findAndCountAll({
        where: {
          Identificacion_Cliente: {
            [Op.like]: `%${identificacion}%`
          }
        },
        include: [{
          model: Usuario,
          attributes: ['Id_Usuario', 'Nombre', 'Apellido', 'Entidad']
        }],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['Fecha_cita', 'DESC']]
      });

      return res.json({
        data: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      });
    } catch (error) {
      console.error('Error al obtener citas por identificación:', error);
      return res.status(500).json({ error: 'Error al obtener citas por identificación' });
    }
  }
};

export default citaController;

// DONE