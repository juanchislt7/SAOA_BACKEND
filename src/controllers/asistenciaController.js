import { Asistencia, Cita, Cliente } from '../models/index.js';
import { Op } from 'sequelize';

const asistenciaController = {
  async list(req, res) {
    try {
      const { page = 1, limit = 10, fecha } = req.query;
      const offset = (page - 1) * limit;

      const where = {};
      if (fecha) {
        where['$cita.fecha$'] = fecha;
      }

      const { count, rows } = await Asistencia.findAndCountAll({
        where,
        include: [{
          model: Cita,
          as: 'cita',
          include: [{
            model: Cliente,
            as: 'cliente',
            attributes: ['nombre', 'apellido', 'documento']
          }]
        }],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']]
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
          model: Cita,
          as: 'cita',
          include: [{
            model: Cliente,
            as: 'cliente',
            attributes: ['nombre', 'apellido', 'documento']
          }]
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
      const { cita_id, hora_llegada, observaciones } = req.body;

      const cita = await Cita.findByPk(cita_id);
      if (!cita) {
        return res.status(404).json({ error: 'Cita no encontrada' });
      }

      const existingAsistencia = await Asistencia.checkExistingAttendance(cita_id);
      if (existingAsistencia) {
        return res.status(400).json({ error: 'Ya existe una asistencia para esta cita' });
      }

      const asistencia = await Asistencia.create({
        cita_id,
        hora_llegada,
        observaciones
      });

      await cita.update({ estado: 'COMPLETED' });

      return res.status(201).json({
        message: 'Asistencia registrada correctamente',
        asistencia
      });
    } catch (error) {
      console.error('Error al crear asistencia:', error);
      return res.status(500).json({ error: 'Error al crear asistencia' });
    }
  },

  async update(req, res) {
    try {
      const { hora_llegada, observaciones } = req.body;
      const asistencia = await Asistencia.findByPk(req.params.id);

      if (!asistencia) {
        return res.status(404).json({ error: 'Asistencia no encontrada' });
      }

      await asistencia.update({
        hora_llegada,
        observaciones
      });

      return res.json({
        message: 'Asistencia actualizada correctamente',
        asistencia
      });
    } catch (error) {
      console.error('Error al actualizar asistencia:', error);
      return res.status(500).json({ error: 'Error al actualizar asistencia' });
    }
  },

  async delete(req, res) {
    try {
      const asistencia = await Asistencia.findByPk(req.params.id, {
        include: [{
          model: Cita,
          as: 'cita'
        }]
      });

      if (!asistencia) {
        return res.status(404).json({ error: 'Asistencia no encontrada' });
      }

      await asistencia.destroy();
      await asistencia.cita.update({ estado: 'PENDING' });

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
        include: [{
          model: Cita,
          as: 'cita',
          where: { cliente_id: req.params.clienteId },
          include: [{
            model: Cliente,
            as: 'cliente',
            attributes: ['nombre', 'apellido', 'documento']
          }]
        }],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']]
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
        include: [{
          model: Cita,
          as: 'cita',
          where: { fecha },
          include: [{
            model: Cliente,
            as: 'cliente',
            attributes: ['nombre', 'apellido', 'documento']
          }]
        }],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['hora_llegada', 'ASC']]
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
  }
};

export default asistenciaController;