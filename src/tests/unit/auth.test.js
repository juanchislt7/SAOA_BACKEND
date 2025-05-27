import { jest } from '@jest/globals';
import authController from '../../controllers/authController.js';
import Usuario from '../../models/usuario.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Mock de los módulos
jest.mock('../../models/usuario.js');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('AuthController', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockReq = {
      body: {},
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

  describe('login', () => {
    it('debería retornar 400 si faltan credenciales', async () => {
      await authController.login(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Email y contraseña son requeridos' });
    });

    it('debería retornar 401 si el usuario no existe', async () => {
      mockReq.body = { email: 'test@test.com', password: 'password' };
      Usuario.findOne.mockResolvedValue(null);

      await authController.login(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Credenciales inválidas' });
    });

    it('debería retornar 401 si el usuario está inactivo', async () => {
      mockReq.body = { email: 'test@test.com', password: 'password' };
      Usuario.findOne.mockResolvedValue({ activo: false });

      await authController.login(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Usuario inactivo' });
    });

    it('debería retornar 401 si la contraseña es incorrecta', async () => {
      mockReq.body = { email: 'test@test.com', password: 'wrong' };
      Usuario.findOne.mockResolvedValue({ activo: true });
      bcrypt.compare.mockResolvedValue(false);

      await authController.login(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Credenciales inválidas' });
    });

    it('debería retornar token y datos del usuario si las credenciales son correctas', async () => {
      const mockUsuario = {
        id: 1,
        nombre: 'Test User',
        email: 'test@test.com',
        rol: 'usuario',
        activo: true
      };
      mockReq.body = { email: 'test@test.com', password: 'password' };
      Usuario.findOne.mockResolvedValue(mockUsuario);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('mock-token');

      await authController.login(mockReq, mockRes);
      expect(mockRes.json).toHaveBeenCalledWith({
        token: 'mock-token',
        usuario: {
          id: mockUsuario.id,
          nombre: mockUsuario.nombre,
          email: mockUsuario.email,
          rol: mockUsuario.rol
        }
      });
    });
  });

  describe('getProfile', () => {
    it('debería retornar 404 si el usuario no existe', async () => {
      Usuario.findByPk.mockResolvedValue(null);

      await authController.getProfile(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Usuario no encontrado' });
    });

    it('debería retornar los datos del usuario sin la contraseña', async () => {
      const mockUsuario = {
        id: 1,
        nombre: 'Test User',
        email: 'test@test.com',
        rol: 'usuario',
        password: 'hashed-password'
      };
      Usuario.findByPk.mockResolvedValue(mockUsuario);

      await authController.getProfile(mockReq, mockRes);
      expect(mockRes.json).toHaveBeenCalledWith(mockUsuario);
    });
  });

  describe('changePassword', () => {
    it('debería retornar 404 si el usuario no existe', async () => {
      Usuario.findByPk.mockResolvedValue(null);

      await authController.changePassword(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Usuario no encontrado' });
    });

    it('debería retornar 401 si la contraseña actual es incorrecta', async () => {
      mockReq.body = { currentPassword: 'wrong', newPassword: 'new' };
      Usuario.findByPk.mockResolvedValue({ password: 'hashed-password' });
      bcrypt.compare.mockResolvedValue(false);

      await authController.changePassword(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Contraseña actual incorrecta' });
    });

    it('debería actualizar la contraseña si todo es correcto', async () => {
      const mockUsuario = {
        password: 'hashed-password',
        save: jest.fn()
      };
      mockReq.body = { currentPassword: 'current', newPassword: 'new' };
      Usuario.findByPk.mockResolvedValue(mockUsuario);
      bcrypt.compare.mockResolvedValue(true);

      await authController.changePassword(mockReq, mockRes);
      expect(mockUsuario.save).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Contraseña actualizada correctamente' });
    });
  });
}); 