import { Op } from 'sequelize';
import Asistencia from '../models/asistencia.js';
import Cliente from '../models/cliente.js';
import Cita from '../models/cita.js';

class AsistenciaController {
  async list(req, res) {
    try {
      const { fecha, page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const where = {};
      if (fecha) {
        where.fecha = fecha;
      }

      const { count, rows: asistencias } = await Asistencia.findAndCountAll({
        where,
        include: [
          {
            model: Cliente,
            attributes: ['documento', 'nombre', 'apellido']
          },
          {
            model: Cita,
            attributes: ['id', 'fecha', 'hora', 'estado']
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['fecha', 'DESC'], ['hora_llegada', 'DESC']]
      });

      return res.json({
        data: asistencias,
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
  }

  async getById(req, res) {
    try {
      const asistencia = await Asistencia.findByPk(req.params.id, {
        include: [
          {
            model: Cliente,
            attributes: ['documento', 'nombre', 'apellido']
          },
          {
            model: Cita,
            attributes: ['id', 'fecha', 'hora', 'estado']
          }
        ]
      });
      
      if (!asistencia) {
        return res.status(404).json({ error: 'Asistencia no encontrada' });
      }

      return res.json(asistencia);
    } catch (error) {
      console.error('Error al obtener asistencia:', error);
      return res.status(500).json({ error: 'Error al obtener asistencia' });
    }
  }

  async create(req, res) {
    try {
      const {
        cliente_documento,
        cita_id,
        fecha,
        hora_llegada,
        observaciones
      } = req.body;

      // Verificar si el cliente existe
      const cliente = await Cliente.findByPk(cliente_documento);
      if (!cliente) {
        return res.status(404).json({ error: 'Cliente no encontrado' });
      }

      // Verificar si la cita existe
      const cita = await Cita.findByPk(cita_id);
      if (!cita) {
        return res.status(404).json({ error: 'Cita no encontrada' });
      }

      // Verificar si ya existe una asistencia para esta cita
      const asistenciaExistente = await Asistencia.findOne({
        where: { cita_id }
      });
      if (asistenciaExistente) {
        return res.status(400).json({ error: 'Ya existe una asistencia registrada para esta cita' });
      }

      const asistencia = await Asistencia.create({
        cliente_documento,
        cita_id,
        fecha,
        hora_llegada,
        observaciones
      });

      // Actualizar el estado de la cita a 'ATENDIDA'
      await cita.update({ estado: 'ATENDIDA' });

      return res.status(201).json(asistencia);
    } catch (error) {
      console.error('Error al crear asistencia:', error);
      return res.status(500).json({ error: 'Error al crear asistencia' });
    }
  }

  async update(req, res) {
    try {
      const asistencia = await Asistencia.findByPk(req.params.id);
      
      if (!asistencia) {
        return res.status(404).json({ error: 'Asistencia no encontrada' });
      }

      const {
        hora_llegada,
        observaciones
      } = req.body;

      await asistencia.update({
        hora_llegada,
        observaciones
      });

      return res.json(asistencia);
    } catch (error) {
      console.error('Error al actualizar asistencia:', error);
      return res.status(500).json({ error: 'Error al actualizar asistencia' });
    }
  }

  async delete(req, res) {
    try {
      const asistencia = await Asistencia.findByPk(req.params.id, {
        include: [{ model: Cita }]
      });
      
      if (!asistencia) {
        return res.status(404).json({ error: 'Asistencia no encontrada' });
      }

      // Actualizar el estado de la cita a 'PENDIENTE'
      await asistencia.Cita.update({ estado: 'PENDIENTE' });

      // Eliminar la asistencia
      await asistencia.destroy();

      return res.json({ message: 'Asistencia eliminada correctamente' });
    } catch (error) {
      console.error('Error al eliminar asistencia:', error);
      return res.status(500).json({ error: 'Error al eliminar asistencia' });
    }
  }

  async getByCliente(req, res) {
    try {
      const { documento } = req.params;
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const { count, rows: asistencias } = await Asistencia.findAndCountAll({
        where: { cliente_documento: documento },
        include: [
          {
            model: Cita,
            attributes: ['id', 'fecha', 'hora', 'estado']
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['fecha', 'DESC'], ['hora_llegada', 'DESC']]
      });

      return res.json({
        data: asistencias,
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
  }

  async getByFecha(req, res) {
    try {
      const { fecha } = req.params;
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const { count, rows: asistencias } = await Asistencia.findAndCountAll({
        where: { fecha },
        include: [
          {
            model: Cliente,
            attributes: ['documento', 'nombre', 'apellido']
          },
          {
            model: Cita,
            attributes: ['id', 'fecha', 'hora', 'estado']
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['hora_llegada', 'ASC']]
      });

      return res.json({
        data: asistencias,
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
}

export default new AsistenciaController();