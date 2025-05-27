import { Op } from 'sequelize';
import LlamadoTurno from '../models/llamadoTurno.js';
import Usuario from '../models/usuario.js';
import Cita from '../models/cita.js';

class LlamadoController {
  async list(req, res) {
    try {
      const { fecha, page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const where = {};
      if (fecha) {
        where.fecha = fecha;
      }

      const { count, rows: llamados } = await LlamadoTurno.findAndCountAll({
        where,
        include: [
          {
            model: Usuario,
            attributes: ['id', 'nombre', 'apellido']
          },
          {
            model: Cita,
            attributes: ['id', 'fecha', 'hora', 'estado']
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['fecha', 'DESC'], ['hora', 'DESC']]
      });

      return res.json({
        data: llamados,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      });
    } catch (error) {
      console.error('Error al listar llamados:', error);
      return res.status(500).json({ error: 'Error al listar llamados' });
    }
  }

  async getById(req, res) {
    try {
      const llamado = await LlamadoTurno.findByPk(req.params.id, {
        include: [
          {
            model: Usuario,
            attributes: ['id', 'nombre', 'apellido']
          },
          {
            model: Cita,
            attributes: ['id', 'fecha', 'hora', 'estado']
          }
        ]
      });
      
      if (!llamado) {
        return res.status(404).json({ error: 'Llamado no encontrado' });
      }

      return res.json(llamado);
    } catch (error) {
      console.error('Error al obtener llamado:', error);
      return res.status(500).json({ error: 'Error al obtener llamado' });
    }
  }

  async create(req, res) {
    try {
      const {
        cita_id,
        usuario_id,
        fecha,
        hora,
        tipo_llamado,
        observaciones
      } = req.body;

      // Verificar si la cita existe
      const cita = await Cita.findByPk(cita_id);
      if (!cita) {
        return res.status(404).json({ error: 'Cita no encontrada' });
      }

      // Verificar si el usuario existe
      const usuario = await Usuario.findByPk(usuario_id);
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      const llamado = await LlamadoTurno.create({
        cita_id,
        usuario_id,
        fecha,
        hora,
        tipo_llamado,
        observaciones
      });

      return res.status(201).json(llamado);
    } catch (error) {
      console.error('Error al crear llamado:', error);
      return res.status(500).json({ error: 'Error al crear llamado' });
    }
  }

  async update(req, res) {
    try {
      const llamado = await LlamadoTurno.findByPk(req.params.id);
      
      if (!llamado) {
        return res.status(404).json({ error: 'Llamado no encontrado' });
      }

      const {
        tipo_llamado,
        observaciones
      } = req.body;

      await llamado.update({
        tipo_llamado,
        observaciones
      });

      return res.json(llamado);
    } catch (error) {
      console.error('Error al actualizar llamado:', error);
      return res.status(500).json({ error: 'Error al actualizar llamado' });
    }
  }

  async delete(req, res) {
    try {
      const llamado = await LlamadoTurno.findByPk(req.params.id);
      
      if (!llamado) {
        return res.status(404).json({ error: 'Llamado no encontrado' });
      }

      await llamado.destroy();

      return res.json({ message: 'Llamado eliminado correctamente' });
    } catch (error) {
      console.error('Error al eliminar llamado:', error);
      return res.status(500).json({ error: 'Error al eliminar llamado' });
    }
  }

  async getByCita(req, res) {
    try {
      const { cita_id } = req.params;
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const { count, rows: llamados } = await LlamadoTurno.findAndCountAll({
        where: { cita_id },
        include: [
          {
            model: Usuario,
            attributes: ['id', 'nombre', 'apellido']
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['fecha', 'DESC'], ['hora', 'DESC']]
      });

      return res.json({
        data: llamados,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      });
    } catch (error) {
      console.error('Error al obtener llamados de la cita:', error);
      return res.status(500).json({ error: 'Error al obtener llamados de la cita' });
    }
  }

  async getByFecha(req, res) {
    try {
      const { fecha } = req.params;
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const { count, rows: llamados } = await LlamadoTurno.findAndCountAll({
        where: { fecha },
        include: [
          {
            model: Usuario,
            attributes: ['id', 'nombre', 'apellido']
          },
          {
            model: Cita,
            attributes: ['id', 'fecha', 'hora', 'estado']
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['hora', 'ASC']]
      });

      return res.json({
        data: llamados,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      });
    } catch (error) {
      console.error('Error al obtener llamados por fecha:', error);
      return res.status(500).json({ error: 'Error al obtener llamados por fecha' });
    }
  }
}

export default new LlamadoController();