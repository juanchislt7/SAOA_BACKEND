import { Cita, Cliente, Usuario } from '../models/index.js';
import { Op } from 'sequelize';

const citaController = {
  async list(req, res) {
    try {
      const { page = 1, limit = 10, fecha, estado } = req.query;
      const offset = (page - 1) * limit;

      const where = {};
      if (fecha) {
        where.fecha = fecha;
      }
      if (estado) {
        where.estado = estado;
      }

      const { count, rows } = await Cita.findAndCountAll({
        where,
        include: [{
          model: Cliente,
          as: 'cliente',
          attributes: ['nombre', 'apellido', 'documento']
        }, {
          model: Usuario,
          attributes: ['id', 'nombre', 'apellido', 'entidad']
        }],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['fecha', 'ASC'], ['hora', 'ASC']]
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
          model: Cliente,
          as: 'cliente',
          attributes: ['nombre', 'apellido', 'documento']
        }, {
          model: Usuario,
          attributes: ['id', 'nombre', 'apellido', 'entidad']
        }],
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
      const { cliente_id, fecha, hora } = req.body;

      const cliente = await Cliente.findByPk(cliente_id);
      if (!cliente) {
        return res.status(404).json({ error: 'Cliente no encontrado' });
      }

      const existingCita = await Cita.checkExistingAppointment(fecha, hora);
      if (existingCita) {
        return res.status(400).json({ error: 'Ya existe una cita para esta fecha y hora' });
      }

      const cita = await Cita.create({
        cliente_id,
        fecha,
        hora,
        estado: 'PENDING'
      });

      const citaConRelaciones = await Cita.findByPk(cita.id, {
        include: [{
          model: Cliente,
          attributes: ['id', 'nombre', 'apellido', 'documento']
        }, {
          model: Usuario,
          attributes: ['id', 'nombre', 'apellido', 'entidad']
        }],
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
      const { fecha, hora } = req.body;
      const cita = await Cita.findByPk(req.params.id);

      if (!cita) {
        return res.status(404).json({ error: 'Cita no encontrada' });
      }

      const existingCita = await Cita.checkExistingAppointment(fecha, hora, req.params.id);
      if (existingCita) {
        return res.status(400).json({ error: 'Ya existe una cita para esta fecha y hora' });
      }

      await cita.update({
        fecha,
        hora
      });

      const citaActualizada = await Cita.findByPk(cita.id, {
        include: [{
          model: Cliente,
          attributes: ['id', 'nombre', 'apellido', 'documento']
        }, {
          model: Usuario,
          attributes: ['id', 'nombre', 'apellido', 'entidad']
        }],
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

  async getByCliente(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const cliente = await Cliente.findByPk(req.params.clienteId);
      if (!cliente) {
        return res.status(404).json({ error: 'Cliente no encontrado' });
      }

      const { count, rows } = await Cita.findAndCountAll({
        where: { cliente_id: req.params.clienteId },
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['fecha', 'DESC'], ['hora', 'DESC']]
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
      console.error('Error al obtener citas del cliente:', error);
      return res.status(500).json({ error: 'Error al obtener citas del cliente' });
    }
  },

  async getByFecha(req, res) {
    try {
      const { fecha, page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const { count, rows } = await Cita.findAndCountAll({
        where: { fecha },
        include: [{
          model: Cliente,
          as: 'cliente',
          attributes: ['nombre', 'apellido', 'documento']
        }, {
          model: Usuario,
          attributes: ['id', 'nombre', 'apellido', 'entidad']
        }],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['hora', 'ASC']]
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
            model: Cliente,
            attributes: ['id', 'nombre', 'apellido', 'email']
          },
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
            model: Cliente,
            attributes: ['id', 'nombre', 'apellido', 'email']
          },
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
  }
};

export default citaController;

// DONE