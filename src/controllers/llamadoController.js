import { LlamadoTurno, Cita, Usuario } from '../models/index.js';

const llamadoController = {
  async list(req, res) {
    try {
      const { page = 1, limit = 10, fecha } = req.query;
      const offset = (page - 1) * limit;

      const where = {};
      if (fecha) {
        where.fecha = fecha;
      }

      const { count, rows } = await LlamadoTurno.findAndCountAll({
        where,
        include: [{
          model: Cita,
          as: 'cita',
          include: [{
            model: Usuario,
            as: 'usuario',
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
      console.error('Error al listar llamados:', error);
      return res.status(500).json({ error: 'Error al listar llamados' });
    }
  },

  async getById(req, res) {
    try {
      const llamado = await LlamadoTurno.findByPk(req.params.id, {
        include: [{
          model: Cita,
          as: 'cita',
          include: [{
            model: Usuario,
            as: 'usuario',
            attributes: ['nombre', 'apellido', 'documento']
          }]
        }]
      });

      if (!llamado) {
        return res.status(404).json({ error: 'Llamado no encontrado' });
      }

      return res.json(llamado);
    } catch (error) {
      console.error('Error al obtener llamado:', error);
      return res.status(500).json({ error: 'Error al obtener llamado' });
    }
  },

  async create(req, res) {
    try {
      const { cita_id, usuario_id, fecha, hora, observaciones } = req.body;

      const cita = await Cita.findByPk(cita_id);
      if (!cita) {
        return res.status(404).json({ error: 'Cita no encontrada' });
      }

      const usuario = await Usuario.findByPk(usuario_id);
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      const llamado = await LlamadoTurno.create({
        cita_id,
        usuario_id,
        fecha,
        hora,
        observaciones,
        estado: 'PENDING'
      });

      return res.status(201).json({
        message: 'Llamado creado correctamente',
        llamado
      });
    } catch (error) {
      console.error('Error al crear llamado:', error);
      return res.status(500).json({ error: 'Error al crear llamado' });
    }
  },

  async update(req, res) {
    try {
      const { estado, observaciones } = req.body;
      const llamado = await LlamadoTurno.findByPk(req.params.id);

      if (!llamado) {
        return res.status(404).json({ error: 'Llamado no encontrado' });
      }

      await llamado.update({
        estado,
        observaciones
      });

      return res.json({
        message: 'Llamado actualizado correctamente',
        llamado
      });
    } catch (error) {
      console.error('Error al actualizar llamado:', error);
      return res.status(500).json({ error: 'Error al actualizar llamado' });
    }
  },

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
  },

  async getByCita(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const cita = await Cita.findByPk(req.params.citaId);
      if (!cita) {
        return res.status(404).json({ error: 'Cita no encontrada' });
      }

      const { count, rows } = await LlamadoTurno.findAndCountAll({
        where: { cita_id: req.params.citaId },
        include: [{
          model: Usuario,
          as: 'usuario',
          attributes: ['nombre', 'apellido', 'documento']
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
      console.error('Error al obtener llamados de la cita:', error);
      return res.status(500).json({ error: 'Error al obtener llamados de la cita' });
    }
  },

  async getByFecha(req, res) {
    try {
      const { fecha, page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const { count, rows } = await LlamadoTurno.findAndCountAll({
        where: { fecha },
        include: [{
          model: Cita,
          as: 'cita',
          include: [{
            model: Usuario,
            as: 'usuario',
            attributes: ['nombre', 'apellido', 'documento']
          }]
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
      console.error('Error al obtener llamados por fecha:', error);
      return res.status(500).json({ error: 'Error al obtener llamados por fecha' });
    }
  }
};

export default llamadoController;