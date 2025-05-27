import { Op } from 'sequelize';
import { Cliente } from '../models/index.js';

const clienteController = {
  async list(req, res) {
    try {
      const { page = 1, limit = 10, search } = req.query;
      const offset = (page - 1) * limit;

      const where = {};
      if (search) {
        where[Op.or] = [
          { nombre: { [Op.like]: `%${search}%` } },
          { apellido: { [Op.like]: `%${search}%` } },
          { documento: { [Op.like]: `%${search}%` } }
        ];
      }

      const { count, rows } = await Cliente.findAndCountAll({
        where,
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
      console.error('Error al listar clientes:', error);
      return res.status(500).json({ error: 'Error al listar clientes' });
    }
  },

  async getById(req, res) {
    try {
      const cliente = await Cliente.findByPk(req.params.id);
      if (!cliente) {
        return res.status(404).json({ error: 'Cliente no encontrado' });
      }
      return res.json(cliente);
    } catch (error) {
      console.error('Error al obtener cliente:', error);
      return res.status(500).json({ error: 'Error al obtener cliente' });
    }
  },

  async create(req, res) {
    try {
      const { nombre, apellido, documento } = req.body;

      const existingCliente = await Cliente.checkExistingDocument(documento);
      if (existingCliente) {
        return res.status(400).json({ error: 'El documento ya está registrado' });
      }

      const cliente = await Cliente.create({
        nombre,
        apellido,
        documento
      });

      return res.status(201).json({
        message: 'Cliente creado correctamente',
        cliente
      });
    } catch (error) {
      console.error('Error al crear cliente:', error);
      return res.status(500).json({ error: 'Error al crear cliente' });
    }
  },

  async update(req, res) {
    try {
      const { nombre, apellido, documento } = req.body;
      const cliente = await Cliente.findByPk(req.params.id);

      if (!cliente) {
        return res.status(404).json({ error: 'Cliente no encontrado' });
      }

      const existingCliente = await Cliente.checkExistingDocument(documento, req.params.id);
      if (existingCliente) {
        return res.status(400).json({ error: 'El documento ya está registrado' });
      }

      await cliente.update({
        nombre,
        apellido,
        documento
      });

      return res.json({
        message: 'Cliente actualizado correctamente',
        cliente
      });
    } catch (error) {
      console.error('Error al actualizar cliente:', error);
      return res.status(500).json({ error: 'Error al actualizar cliente' });
    }
  },

  async delete(req, res) {
    try {
      const cliente = await Cliente.findByPk(req.params.id);
      if (!cliente) {
        return res.status(404).json({ error: 'Cliente no encontrado' });
      }

      await cliente.update({ activo: false });
      return res.json({ message: 'Cliente desactivado correctamente' });
    } catch (error) {
      console.error('Error al desactivar cliente:', error);
      return res.status(500).json({ error: 'Error al desactivar cliente' });
    }
  },

  async search(req, res) {
    try {
      const { query } = req.query;
      const clientes = await Cliente.findAll({
        where: {
          [Op.or]: [
            { nombre: { [Op.like]: `%${query}%` } },
            { apellido: { [Op.like]: `%${query}%` } },
            { documento: { [Op.like]: `%${query}%` } }
          ]
        },
        limit: 10
      });

      return res.json(clientes);
    } catch (error) {
      console.error('Error al buscar clientes:', error);
      return res.status(500).json({ error: 'Error al buscar clientes' });
    }
  }
};

export default clienteController; 