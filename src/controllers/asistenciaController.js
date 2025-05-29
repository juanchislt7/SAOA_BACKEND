import { Asistencia, Cliente } from '../models/index.js';
import { Op } from 'sequelize';

const asistenciaController = {
  async list(req, res) {
    try {
      const { page = 1, limit = 10, fecha } = req.query;
      const offset = (page - 1) * limit;

      const where = {};
      if (fecha) {
        where.Fecha_Asistencia = fecha;
      }

      const { count, rows } = await Asistencia.findAndCountAll({
        where,
        include: [{
          model: Cliente,
          attributes: ['Id_Cliente', 'Nombre_Cliente', 'Apellido_Cliente', 'Email_Cliente']
        }],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['Fecha_Asistencia', 'DESC']]
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
      console.error('Error al listar asistencias:', error);
      return res.status(500).json({ error: 'Error al listar asistencias' });
    }
  },

  async getById(req, res) {
    try {
      const asistencia = await Asistencia.findByPk(req.params.id, {
        include: [{
          model: Cliente,
          attributes: ['Id_Cliente', 'Nombre_Cliente', 'Apellido_Cliente', 'Email_Cliente']
        }]
      });

      if (!asistencia) {
        return res.status(404).json({ error: 'Asistencia no encontrada' });
      }

      return res.json(asistencia);
    } catch (error) {
      console.error('Error al obtener asistencia:', error);
      return res.status(500).json({ error: 'Error al obtener asistencia' });
    }
  },

  async create(req, res) {
    try {
      const asistencia = await Asistencia.create(req.body);
      const asistenciaConRelaciones = await Asistencia.findByPk(asistencia.Turno_Asignado, {
        include: [{
          model: Cliente,
          attributes: ['Id_Cliente', 'Nombre_Cliente', 'Apellido_Cliente', 'Email_Cliente']
        }]
      });

      return res.status(201).json({
        message: 'Asistencia registrada correctamente',
        asistencia: asistenciaConRelaciones
      });
    } catch (error) {
      console.error('Error al crear asistencia:', error);
      return res.status(500).json({ error: 'Error al crear asistencia' });
    }
  },

  async update(req, res) {
    try {
      const asistencia = await Asistencia.findByPk(req.params.id);
      if (!asistencia) {
        return res.status(404).json({ error: 'Asistencia no encontrada' });
      }

      await asistencia.update(req.body);
      const asistenciaActualizada = await Asistencia.findByPk(asistencia.Turno_Asignado, {
        include: [{
          model: Cliente,
          attributes: ['Id_Cliente', 'Nombre_Cliente', 'Apellido_Cliente', 'Email_Cliente']
        }]
      });

      return res.json({
        message: 'Asistencia actualizada correctamente',
        asistencia: asistenciaActualizada
      });
    } catch (error) {
      console.error('Error al actualizar asistencia:', error);
      return res.status(500).json({ error: 'Error al actualizar asistencia' });
    }
  },

  async delete(req, res) {
    try {
      const asistencia = await Asistencia.findByPk(req.params.id);
      if (!asistencia) {
        return res.status(404).json({ error: 'Asistencia no encontrada' });
      }

      await asistencia.destroy();
      return res.json({ message: 'Asistencia eliminada correctamente' });
    } catch (error) {
      console.error('Error al eliminar asistencia:', error);
      return res.status(500).json({ error: 'Error al eliminar asistencia' });
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

      const { count, rows } = await Asistencia.findAndCountAll({
        where: { Cliente_Id_cliente: req.params.clienteId },
        include: [{
          model: Cliente,
          attributes: ['Id_Cliente', 'Nombre_Cliente', 'Apellido_Cliente', 'Email_Cliente']
        }],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['Fecha_Asistencia', 'DESC']]
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
      console.error('Error al obtener asistencias del cliente:', error);
      return res.status(500).json({ error: 'Error al obtener asistencias del cliente' });
    }
  },

  async getByFecha(req, res) {
    try {
      const { fecha, page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const { count, rows } = await Asistencia.findAndCountAll({
        where: { Fecha_Asistencia: fecha },
        include: [{
          model: Cliente,
          attributes: ['Id_Cliente', 'Nombre_Cliente', 'Apellido_Cliente', 'Email_Cliente']
        }],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['Hora_Asistencia', 'ASC']]
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
      console.error('Error al obtener asistencias por fecha:', error);
      return res.status(500).json({ error: 'Error al obtener asistencias por fecha' });
    }
  },

  async getAllAsistencias(req, res) {
    try {
      const asistencias = await Asistencia.findAll({
        include: [
          {
            model: Cliente,
            attributes: ['Id_Cliente', 'Nombre_Cliente', 'Apellido_Cliente', 'Email_Cliente']
          }
        ]
      });
      res.json(asistencias);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener las asistencias', error: error.message });
    }
  },

  async getAsistenciaById(req, res) {
    try {
      const asistencia = await Asistencia.findByPk(req.params.id, {
        include: [
          {
            model: Cliente,
            attributes: ['Id_Cliente', 'Nombre_Cliente', 'Apellido_Cliente', 'Email_Cliente']
          }
        ]
      });
      if (!asistencia) {
        return res.status(404).json({ mensaje: 'Asistencia no encontrada' });
      }
      res.json(asistencia);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener la asistencia', error: error.message });
    }
  },

  async createAsistencia(req, res) {
    try {
      const asistencia = await Asistencia.create(req.body);
      const asistenciaConRelaciones = await Asistencia.findByPk(asistencia.Turno_Asignado, {
        include: [
          {
            model: Cliente,
            attributes: ['Id_Cliente', 'Nombre_Cliente', 'Apellido_Cliente', 'Email_Cliente']
          }
        ]
      });
      res.status(201).json(asistenciaConRelaciones);
    } catch (error) {
      res.status(400).json({ mensaje: 'Error al crear la asistencia', error: error.message });
    }
  },

  async updateAsistencia(req, res) {
    try {
      const asistencia = await Asistencia.findByPk(req.params.id);
      if (!asistencia) {
        return res.status(404).json({ mensaje: 'Asistencia no encontrada' });
      }
      await asistencia.update(req.body);
      const asistenciaActualizada = await Asistencia.findByPk(asistencia.Turno_Asignado, {
        include: [
          {
            model: Cliente,
            attributes: ['Id_Cliente', 'Nombre_Cliente', 'Apellido_Cliente', 'Email_Cliente']
          }
        ]
      });
      res.json(asistenciaActualizada);
    } catch (error) {
      res.status(400).json({ mensaje: 'Error al actualizar la asistencia', error: error.message });
    }
  },

  async deleteAsistencia(req, res) {
    try {
      const asistencia = await Asistencia.findByPk(req.params.id);
      if (!asistencia) {
        return res.status(404).json({ mensaje: 'Asistencia no encontrada' });
      }
      await asistencia.destroy();
      res.json({ mensaje: 'Asistencia eliminada correctamente' });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al eliminar la asistencia', error: error.message });
    }
  },

  async searchAsistenciasByDate(req, res) {
    try {
      const { fecha } = req.query;
      const asistencias = await Asistencia.findAll({
        where: {
          Fecha_Asistencia: fecha
        },
        include: [
          {
            model: Cliente,
            attributes: ['Id_Cliente', 'Nombre_Cliente', 'Apellido_Cliente', 'Email_Cliente']
          }
        ]
      });
      res.json(asistencias);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al buscar asistencias', error: error.message });
    }
  }
};

export default asistenciaController;