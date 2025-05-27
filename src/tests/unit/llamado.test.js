import { jest } from '@jest/globals';
import llamadoController from '../../controllers/llamadoController.js';
import LlamadoTurno from '../../models/llamadoTurno.js';
import Cita from '../../models/cita.js';
import Usuario from '../../models/usuario.js';

jest.mock('../../models/llamadoTurno.js');
jest.mock('../../models/cita.js');
jest.mock('../../models/usuario.js');

describe('LlamadoController', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockReq = {
      body: {},
      params: {},
      query: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('list', () => {
    it('debería listar llamados con paginación', async () => {
      const mockLlamados = [
        { id: 1, cita: { id: 1 }, usuario: { nombre: 'Usuario 1' } },
        { id: 2, cita: { id: 2 }, usuario: { nombre: 'Usuario 2' } }
      ];
      mockReq.query = { page: 1, limit: 10 };
      LlamadoTurno.findAndCountAll.mockResolvedValue({
        count: 2,
        rows: mockLlamados
      });

      await llamadoController.list(mockReq, mockRes);
      expect(mockRes.json).toHaveBeenCalledWith({
        data: mockLlamados,
        pagination: {
          total: 2,
          page: 1,
          limit: 10,
          totalPages: 1
        }
      });
    });

    it('debería filtrar por fecha si se proporciona', async () => {
      mockReq.query = { fecha: '2024-03-20' };
      await llamadoController.list(mockReq, mockRes);
      expect(LlamadoTurno.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.any(Object)
        })
      );
    });
  });

  describe('getById', () => {
    it('debería retornar 404 si el llamado no existe', async () => {
      mockReq.params.id = 1;
      LlamadoTurno.findByPk.mockResolvedValue(null);

      await llamadoController.getById(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Llamado no encontrado' });
    });

    it('debería retornar el llamado si existe', async () => {
      const mockLlamado = {
        id: 1,
        cita: { id: 1 },
        usuario: { nombre: 'Test Usuario' }
      };
      mockReq.params.id = 1;
      LlamadoTurno.findByPk.mockResolvedValue(mockLlamado);

      await llamadoController.getById(mockReq, mockRes);
      expect(mockRes.json).toHaveBeenCalledWith(mockLlamado);
    });
  });

  describe('create', () => {
    it('debería retornar 404 si la cita no existe', async () => {
      mockReq.body = { cita_id: 1 };
      Cita.findByPk.mockResolvedValue(null);

      await llamadoController.create(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Cita no encontrada' });
    });

    it('debería retornar 404 si el usuario no existe', async () => {
      mockReq.body = { cita_id: 1, usuario_id: 1 };
      Cita.findByPk.mockResolvedValue({ id: 1 });
      Usuario.findByPk.mockResolvedValue(null);

      await llamadoController.create(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Usuario no encontrado' });
    });

    it('debería crear un nuevo llamado correctamente', async () => {
      const mockLlamado = {
        id: 1,
        cita_id: 1,
        usuario_id: 1,
        fecha: '2024-03-20',
        hora: '10:00',
        tipo_llamado: 'PRIMERO'
      };
      mockReq.body = {
        cita_id: 1,
        usuario_id: 1,
        fecha: '2024-03-20',
        hora: '10:00',
        tipo_llamado: 'PRIMERO'
      };
      Cita.findByPk.mockResolvedValue({ id: 1 });
      Usuario.findByPk.mockResolvedValue({ id: 1 });
      LlamadoTurno.create.mockResolvedValue(mockLlamado);

      await llamadoController.create(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Llamado registrado correctamente',
        llamado: mockLlamado
      });
    });
  });

  describe('update', () => {
    it('debería retornar 404 si el llamado no existe', async () => {
      mockReq.params.id = 1;
      LlamadoTurno.findByPk.mockResolvedValue(null);

      await llamadoController.update(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Llamado no encontrado' });
    });

    it('debería actualizar el llamado correctamente', async () => {
      const mockLlamado = {
        id: 1,
        hora: '10:00',
        observaciones: 'Test',
        update: jest.fn()
      };
      mockReq.params.id = 1;
      mockReq.body = {
        hora: '11:00',
        observaciones: 'Updated'
      };
      LlamadoTurno.findByPk.mockResolvedValue(mockLlamado);

      await llamadoController.update(mockReq, mockRes);
      expect(mockLlamado.update).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Llamado actualizado correctamente',
        llamado: mockLlamado
      });
    });
  });

  describe('delete', () => {
    it('debería retornar 404 si el llamado no existe', async () => {
      mockReq.params.id = 1;
      LlamadoTurno.findByPk.mockResolvedValue(null);

      await llamadoController.delete(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Llamado no encontrado' });
    });

    it('debería eliminar el llamado correctamente', async () => {
      const mockLlamado = {
        id: 1,
        destroy: jest.fn()
      };
      mockReq.params.id = 1;
      LlamadoTurno.findByPk.mockResolvedValue(mockLlamado);

      await llamadoController.delete(mockReq, mockRes);
      expect(mockLlamado.destroy).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Llamado eliminado correctamente'
      });
    });
  });

  describe('getByCita', () => {
    it('debería retornar 404 si la cita no existe', async () => {
      mockReq.params.cita_id = 1;
      Cita.findByPk.mockResolvedValue(null);

      await llamadoController.getByCita(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Cita no encontrada' });
    });

    it('debería listar los llamados de una cita específica', async () => {
      const mockLlamados = [
        { id: 1, hora: '10:00' },
        { id: 2, hora: '11:00' }
      ];
      mockReq.params.cita_id = 1;
      Cita.findByPk.mockResolvedValue({ id: 1 });
      LlamadoTurno.findAll.mockResolvedValue(mockLlamados);

      await llamadoController.getByCita(mockReq, mockRes);
      expect(mockRes.json).toHaveBeenCalledWith(mockLlamados);
    });
  });

  describe('getByFecha', () => {
    it('debería listar los llamados de una fecha específica con paginación', async () => {
      const mockLlamados = [
        { id: 1, hora: '10:00' },
        { id: 2, hora: '11:00' }
      ];
      mockReq.params.fecha = '2024-03-20';
      mockReq.query = { page: 1, limit: 10 };
      LlamadoTurno.findAndCountAll.mockResolvedValue({
        count: 2,
        rows: mockLlamados
      });

      await llamadoController.getByFecha(mockReq, mockRes);
      expect(mockRes.json).toHaveBeenCalledWith({
        data: mockLlamados,
        pagination: {
          total: 2,
          page: 1,
          limit: 10,
          totalPages: 1
        }
      });
    });
  });
}); 