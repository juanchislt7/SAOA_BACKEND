import { Op } from 'sequelize';
import Cita from '../models/cita.js';
import Cliente from '../models/cliente.js';

class CitaController {
  async list(req, res) {
    try {
      const { fecha, estado, cliente } = req.query;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      const where = {};
      
      if (fecha) {
        where.fecha_hora = {
          [Op.between]: [
            new Date(`${fecha}T00:00:00`),
            new Date(`${fecha}T23:59:59`)
          ]
        };
      }

      if (estado) {
        where.estado = estado;
      }

      if (cliente) {
        where.cliente_documento = cliente;
      }

      const citas = await Cita.findAll({
        where,
        limit,
        offset,
        include: [{ model: Cliente, as: 'cliente' }],
        order: [['fecha_hora', 'ASC']]
      });

      const total = await Cita.count({ where });
      const totalPages = Math.ceil(total / limit);

      return res.json({
        data: citas,
        pagination: {
          total,
          page,
          limit,
          totalPages
        }
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al listar citas' });
    }
  }

  async getById(req, res) {
    try {
      const cita = await Cita.findByPk(req.params.id, {
        include: [{ model: Cliente, as: 'cliente' }]
      });
      
      if (!cita) {
        return res.status(404).json({ error: 'Cita no encontrada' });
      }

      return res.json(cita);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al obtener cita' });
    }
  }

  async create(req, res) {
    try {
      const cliente = await Cliente.findByPk(req.body.cliente_documento);
      
      if (!cliente) {
        return res.status(404).json({ error: 'Cliente no encontrado' });
      }

      const cita = await Cita.create(req.body);
      return res.status(201).json(cita);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al crear cita' });
    }
  }

  async update(req, res) {
    try {
      const cita = await Cita.findByPk(req.params.id);
      
      if (!cita) {
        return res.status(404).json({ error: 'Cita no encontrada' });
      }

      await cita.update(req.body);
      return res.json(cita);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al actualizar cita' });
    }
  }

  async delete(req, res) {
    try {
      const cita = await Cita.findByPk(req.params.id);
      
      if (!cita) {
        return res.status(404).json({ error: 'Cita no encontrada' });
      }

      await cita.destroy();
      return res.json({ message: 'Cita eliminada correctamente' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al eliminar cita' });
    }
  }

  async cambiarEstado(req, res) {
    try {
      const cita = await Cita.findByPk(req.params.id);
      
      if (!cita) {
        return res.status(404).json({ error: 'Cita no encontrada' });
      }

      const { estado } = req.body;
      if (!['pendiente', 'confirmada', 'cancelada', 'atendida'].includes(estado)) {
        return res.status(400).json({ error: 'Estado no válido' });
      }

      await cita.update({ estado });
      return res.json(cita);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al cambiar estado de cita' });
    }
  }
}

export default new CitaController();

// DONE