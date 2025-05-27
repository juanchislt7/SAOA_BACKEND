import { jest } from '@jest/globals';
import asistenciaController from '../../controllers/asistenciaController.js';
import Asistencia from '../../models/asistencia.js';
import Cliente from '../../models/cliente.js';
import Cita from '../../models/cita.js';

jest.mock('../../models/asistencia.js');
jest.mock('../../models/cliente.js');
jest.mock('../../models/cita.js');

describe('AsistenciaController', () => {
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
    it('debería listar asistencias con paginación', async () => {
      const mockAsistencias = [
        { id: 1, cliente: { nombre: 'Cliente 1' } },
        { id: 2, cliente: { nombre: 'Cliente 2' } }
      ];
      mockReq.query = { page: 1, limit: 10 };
      Asistencia.findAndCountAll.mockResolvedValue({
        count: 2,
        rows: mockAsistencias
      });

      await asistenciaController.list(mockReq, mockRes);
      expect(mockRes.json).toHaveBeenCalledWith({
        data: mockAsistencias,
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
      await asistenciaController.list(mockReq, mockRes);
      expect(Asistencia.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.any(Object)
        })
      );
    });
  });

  describe('getById', () => {
    it('debería retornar 404 si la asistencia no existe', async () => {
      mockReq.params.id = 1;
      Asistencia.findByPk.mockResolvedValue(null);

      await asistenciaController.getById(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Asistencia no encontrada' });
    });

    it('debería retornar la asistencia si existe', async () => {
      const mockAsistencia = {
        id: 1,
        cliente: { nombre: 'Test Cliente' },
        cita: { id: 1 }
      };
      mockReq.params.id = 1;
      Asistencia.findByPk.mockResolvedValue(mockAsistencia);

      await asistenciaController.getById(mockReq, mockRes);
      expect(mockRes.json).toHaveBeenCalledWith(mockAsistencia);
    });
  });

  describe('create', () => {
    it('debería retornar 404 si el cliente no existe', async () => {
      mockReq.body = { cliente_documento: '12345678' };
      Cliente.findOne.mockResolvedValue(null);

      await asistenciaController.create(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Cliente no encontrado' });
    });

    it('debería retornar 404 si la cita no existe', async () => {
      mockReq.body = { cliente_documento: '12345678', cita_id: 1 };
      Cliente.findOne.mockResolvedValue({ id: 1 });
      Cita.findByPk.mockResolvedValue(null);

      await asistenciaController.create(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Cita no encontrada' });
    });

    it('debería retornar 400 si ya existe una asistencia para la cita', async () => {
      mockReq.body = { cliente_documento: '12345678', cita_id: 1 };
      Cliente.findOne.mockResolvedValue({ id: 1 });
      Cita.findByPk.mockResolvedValue({ id: 1 });
      Asistencia.findOne.mockResolvedValue({ id: 1 });

      await asistenciaController.create(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Ya existe una asistencia para esta cita' });
    });

    it('debería crear una nueva asistencia correctamente', async () => {
      const mockAsistencia = {
        id: 1,
        cliente_documento: '12345678',
        cita_id: 1,
        fecha: '2024-03-20',
        hora_llegada: '10:00'
      };
      mockReq.body = {
        cliente_documento: '12345678',
        cita_id: 1,
        fecha: '2024-03-20',
        hora_llegada: '10:00'
      };
      Cliente.findOne.mockResolvedValue({ id: 1 });
      Cita.findByPk.mockResolvedValue({ id: 1, update: jest.fn() });
      Asistencia.findOne.mockResolvedValue(null);
      Asistencia.create.mockResolvedValue(mockAsistencia);

      await asistenciaController.create(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Asistencia registrada correctamente',
        asistencia: mockAsistencia
      });
    });
  });

  describe('update', () => {
    it('debería retornar 404 si la asistencia no existe', async () => {
      mockReq.params.id = 1;
      Asistencia.findByPk.mockResolvedValue(null);

      await asistenciaController.update(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Asistencia no encontrada' });
    });

    it('debería actualizar la asistencia correctamente', async () => {
      const mockAsistencia = {
        id: 1,
        hora_llegada: '10:00',
        observaciones: 'Test',
        update: jest.fn()
      };
      mockReq.params.id = 1;
      mockReq.body = {
        hora_llegada: '11:00',
        observaciones: 'Updated'
      };
      Asistencia.findByPk.mockResolvedValue(mockAsistencia);

      await asistenciaController.update(mockReq, mockRes);
      expect(mockAsistencia.update).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Asistencia actualizada correctamente',
        asistencia: mockAsistencia
      });
    });
  });

  describe('delete', () => {
    it('debería retornar 404 si la asistencia no existe', async () => {
      mockReq.params.id = 1;
      Asistencia.findByPk.mockResolvedValue(null);

      await asistenciaController.delete(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Asistencia no encontrada' });
    });

    it('debería eliminar la asistencia y actualizar la cita correctamente', async () => {
      const mockAsistencia = {
        id: 1,
        cita_id: 1,
        destroy: jest.fn()
      };
      const mockCita = {
        id: 1,
        update: jest.fn()
      };
      mockReq.params.id = 1;
      Asistencia.findByPk.mockResolvedValue(mockAsistencia);
      Cita.findByPk.mockResolvedValue(mockCita);

      await asistenciaController.delete(mockReq, mockRes);
      expect(mockAsistencia.destroy).toHaveBeenCalled();
      expect(mockCita.update).toHaveBeenCalledWith({ estado: 'PENDING' });
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Asistencia eliminada correctamente'
      });
    });
  });

  describe('getByCliente', () => {
    it('debería retornar 404 si el cliente no existe', async () => {
      mockReq.params.documento = '12345678';
      Cliente.findOne.mockResolvedValue(null);

      await asistenciaController.getByCliente(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Cliente no encontrado' });
    });

    it('debería listar las asistencias del cliente con paginación', async () => {
      const mockAsistencias = [
        { id: 1, fecha: '2024-03-20' },
        { id: 2, fecha: '2024-03-21' }
      ];
      mockReq.params.documento = '12345678';
      mockReq.query = { page: 1, limit: 10 };
      Cliente.findOne.mockResolvedValue({ id: 1 });
      Asistencia.findAndCountAll.mockResolvedValue({
        count: 2,
        rows: mockAsistencias
      });

      await asistenciaController.getByCliente(mockReq, mockRes);
      expect(mockRes.json).toHaveBeenCalledWith({
        data: mockAsistencias,
        pagination: {
          total: 2,
          page: 1,
          limit: 10,
          totalPages: 1
        }
      });
    });
  });

  describe('getByFecha', () => {
    it('debería listar las asistencias de una fecha específica con paginación', async () => {
      const mockAsistencias = [
        { id: 1, hora_llegada: '10:00' },
        { id: 2, hora_llegada: '11:00' }
      ];
      mockReq.params.fecha = '2024-03-20';
      mockReq.query = { page: 1, limit: 10 };
      Asistencia.findAndCountAll.mockResolvedValue({
        count: 2,
        rows: mockAsistencias
      });

      await asistenciaController.getByFecha(mockReq, mockRes);
      expect(mockRes.json).toHaveBeenCalledWith({
        data: mockAsistencias,
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