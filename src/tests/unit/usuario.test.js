import { jest } from '@jest/globals';
import usuarioController from '../../controllers/usuarioController.js';
import Usuario from '../../models/usuario.js';
import bcrypt from 'bcryptjs';

jest.mock('../../models/usuario.js');
jest.mock('bcryptjs');

describe('UsuarioController', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockReq = {
      body: {},
      params: {},
      userId: 1
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('registro', () => {
    it('debería retornar 400 si el email ya está registrado', async () => {
      mockReq.body = { email: 'test@test.com' };
      Usuario.findOne.mockResolvedValue({ id: 1 });

      await usuarioController.registro(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'El email ya está registrado' });
    });

    it('debería crear un nuevo usuario correctamente', async () => {
      const mockUsuario = {
        id: 1,
        nombre: 'Test User',
        email: 'test@test.com',
        rol: 'usuario'
      };
      mockReq.body = {
        nombre: 'Test User',
        email: 'test@test.com',
        password: 'password'
      };
      Usuario.findOne.mockResolvedValue(null);
      Usuario.create.mockResolvedValue(mockUsuario);

      await usuarioController.registro(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Usuario registrado correctamente',
        usuario: {
          id: mockUsuario.id,
          nombre: mockUsuario.nombre,
          email: mockUsuario.email,
          rol: mockUsuario.rol
        }
      });
    });
  });

  describe('list', () => {
    it('debería listar usuarios con paginación', async () => {
      const mockUsuarios = [
        { id: 1, nombre: 'User 1' },
        { id: 2, nombre: 'User 2' }
      ];
      mockReq.query = { page: 1, limit: 10 };
      Usuario.findAndCountAll.mockResolvedValue({
        count: 2,
        rows: mockUsuarios
      });

      await usuarioController.list(mockReq, mockRes);
      expect(mockRes.json).toHaveBeenCalledWith({
        data: mockUsuarios,
        pagination: {
          total: 2,
          page: 1,
          limit: 10,
          totalPages: 1
        }
      });
    });
  });

  describe('getById', () => {
    it('debería retornar 404 si el usuario no existe', async () => {
      mockReq.params.id = 1;
      Usuario.findByPk.mockResolvedValue(null);

      await usuarioController.getById(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Usuario no encontrado' });
    });

    it('debería retornar el usuario si existe', async () => {
      const mockUsuario = {
        id: 1,
        nombre: 'Test User',
        email: 'test@test.com'
      };
      mockReq.params.id = 1;
      Usuario.findByPk.mockResolvedValue(mockUsuario);

      await usuarioController.getById(mockReq, mockRes);
      expect(mockRes.json).toHaveBeenCalledWith(mockUsuario);
    });
  });

  describe('create', () => {
    it('debería retornar 400 si el email ya existe', async () => {
      mockReq.body = { email: 'test@test.com' };
      Usuario.findOne.mockResolvedValue({ id: 1 });

      await usuarioController.create(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'El email ya está registrado' });
    });

    it('debería crear un nuevo usuario correctamente', async () => {
      const mockUsuario = {
        id: 1,
        nombre: 'Test User',
        email: 'test@test.com',
        rol: 'admin'
      };
      mockReq.body = {
        nombre: 'Test User',
        email: 'test@test.com',
        password: 'password',
        rol: 'admin'
      };
      Usuario.findOne.mockResolvedValue(null);
      Usuario.create.mockResolvedValue(mockUsuario);

      await usuarioController.create(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Usuario creado correctamente',
        usuario: {
          id: mockUsuario.id,
          nombre: mockUsuario.nombre,
          email: mockUsuario.email,
          rol: mockUsuario.rol
        }
      });
    });
  });

  describe('update', () => {
    it('debería retornar 404 si el usuario no existe', async () => {
      mockReq.params.id = 1;
      Usuario.findByPk.mockResolvedValue(null);

      await usuarioController.update(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Usuario no encontrado' });
    });

    it('debería retornar 400 si el nuevo email ya existe', async () => {
      mockReq.params.id = 1;
      mockReq.body = { email: 'new@test.com' };
      Usuario.findByPk.mockResolvedValue({ id: 1, email: 'old@test.com' });
      Usuario.findOne.mockResolvedValue({ id: 2 });

      await usuarioController.update(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'El email ya está en uso' });
    });

    it('debería actualizar el usuario correctamente', async () => {
      const mockUsuario = {
        id: 1,
        nombre: 'Test User',
        email: 'test@test.com',
        rol: 'admin',
        activo: true,
        update: jest.fn()
      };
      mockReq.params.id = 1;
      mockReq.body = {
        nombre: 'Updated User',
        email: 'test@test.com',
        rol: 'admin',
        activo: true
      };
      Usuario.findByPk.mockResolvedValue(mockUsuario);
      Usuario.findOne.mockResolvedValue(null);

      await usuarioController.update(mockReq, mockRes);
      expect(mockUsuario.update).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Usuario actualizado correctamente',
        usuario: {
          id: mockUsuario.id,
          nombre: mockUsuario.nombre,
          email: mockUsuario.email,
          rol: mockUsuario.rol,
          activo: mockUsuario.activo
        }
      });
    });
  });

  describe('delete', () => {
    it('debería retornar 404 si el usuario no existe', async () => {
      mockReq.params.id = 1;
      Usuario.findByPk.mockResolvedValue(null);

      await usuarioController.delete(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Usuario no encontrado' });
    });

    it('debería desactivar el usuario correctamente', async () => {
      const mockUsuario = {
        id: 1,
        activo: true,
        update: jest.fn()
      };
      mockReq.params.id = 1;
      Usuario.findByPk.mockResolvedValue(mockUsuario);

      await usuarioController.delete(mockReq, mockRes);
      expect(mockUsuario.update).toHaveBeenCalledWith({ activo: false });
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Usuario desactivado correctamente'
      });
    });
  });
}); 