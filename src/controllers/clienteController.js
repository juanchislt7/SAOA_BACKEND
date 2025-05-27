import { Op } from 'sequelize';
import Cliente from '../models/cliente.js';

class ClienteController {
  async list(req, res) {
    try {
      const { search, page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const where = {};
      if (search) {
        where[Op.or] = [
          { nombre: { [Op.like]: `%${search}%` } },
          { apellido: { [Op.like]: `%${search}%` } },
          { documento: { [Op.like]: `%${search}%` } }
        ];
      }

      const { count, rows: clientes } = await Cliente.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['nombre', 'ASC']]
      });

      return res.json({
        data: clientes,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      });
    } catch (error) {
      console.error('Error al listar clientes:', error);
      return res.status(500).json({ error: 'Error al listar clientes' });
    }
  }

  async getById(req, res) {
    try {
      const cliente = await Cliente.findByPk(req.params.documento);
      
      if (!cliente) {
        return res.status(404).json({ error: 'Cliente no encontrado' });
      }

      return res.json(cliente);
    } catch (error) {
      console.error('Error al obtener cliente:', error);
      return res.status(500).json({ error: 'Error al obtener cliente' });
    }
  }

  async create(req, res) {
    try {
      const {
        documento,
        nombre,
        apellido,
        email,
        telefono,
        direccion,
        fecha_nacimiento
      } = req.body;

      // Verificar si ya existe un cliente con ese documento
      const clienteExistente = await Cliente.findByPk(documento);
      if (clienteExistente) {
        return res.status(400).json({ error: 'Ya existe un cliente con ese documento' });
      }

      const cliente = await Cliente.create({
        documento,
        nombre,
        apellido,
        email,
        telefono,
        direccion,
        fecha_nacimiento,
        activo: true
      });

      return res.status(201).json(cliente);
    } catch (error) {
      console.error('Error al crear cliente:', error);
      return res.status(500).json({ error: 'Error al crear cliente' });
    }
  }

  async update(req, res) {
    try {
      const cliente = await Cliente.findByPk(req.params.documento);
      
      if (!cliente) {
        return res.status(404).json({ error: 'Cliente no encontrado' });
      }

      const {
        nombre,
        apellido,
        email,
        telefono,
        direccion,
        fecha_nacimiento,
        activo
      } = req.body;

      await cliente.update({
        nombre,
        apellido,
        email,
        telefono,
        direccion,
        fecha_nacimiento,
        activo
      });

      return res.json(cliente);
    } catch (error) {
      console.error('Error al actualizar cliente:', error);
      return res.status(500).json({ error: 'Error al actualizar cliente' });
    }
  }

  async delete(req, res) {
    try {
      const cliente = await Cliente.findByPk(req.params.documento);
      
      if (!cliente) {
        return res.status(404).json({ error: 'Cliente no encontrado' });
      }

      // En lugar de eliminar físicamente, marcamos como inactivo
      await cliente.update({ activo: false });

      return res.json({ message: 'Cliente desactivado correctamente' });
    } catch (error) {
      console.error('Error al desactivar cliente:', error);
      return res.status(500).json({ error: 'Error al desactivar cliente' });
    }
  }

  async search(req, res) {
    try {
      const { query } = req.query;
      
      if (!query) {
        return res.status(400).json({ error: 'Término de búsqueda requerido' });
      }

      const clientes = await Cliente.findAll({
        where: {
          [Op.or]: [
            { nombre: { [Op.like]: `%${query}%` } },
            { apellido: { [Op.like]: `%${query}%` } },
            { documento: { [Op.like]: `%${query}%` } }
          ],
          activo: true
        },
        limit: 10,
        order: [['nombre', 'ASC']]
      });

      return res.json(clientes);
    } catch (error) {
      console.error('Error en búsqueda de clientes:', error);
      return res.status(500).json({ error: 'Error en la búsqueda' });
    }
  }
}

export default new ClienteController(); 