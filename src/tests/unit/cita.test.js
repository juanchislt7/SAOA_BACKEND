import { jest } from '@jest/globals';
import citaController from '../../controllers/citaController.js';
import Cita from '../../models/cita.js';
import Cliente from '../../models/cliente.js';

jest.mock('../../models/cita.js');
jest.mock('../../models/cliente.js');

describe('CitaController', () => {
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
    it('debería listar citas con paginación', async () => {
      const mockCitas = [
        { id: 1, cliente: { nombre: 'Cliente 1' } },
        { id: 2, cliente: { nombre: 'Cliente 2' } }
      ];
      mockReq.query = { page: 1, limit: 10 };
      Cita.findAndCountAll.mockResolvedValue({
        count: 2,
        rows: mockCitas
      });

      await citaController.list(mockReq, mockRes);
      expect(mockRes.json).toHaveBeenCalledWith({
        data: mockCitas,
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
      await citaController.list(mockReq, mockRes);
      expect(Cita.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.any(Object)
        })
      );
    });

    it('debería filtrar por estado si se proporciona', async () => {
      mockReq.query = { estado: 'PENDING' };
      await citaController.list(mockReq, mockRes);
      expect(Cita.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.any(Object)
        })
      );
    });
  });

  describe('getById', () => {
    it('debería retornar 404 si la cita no existe', async () => {
      mockReq.params.id = 1;
      Cita.findByPk.mockResolvedValue(null);

      await citaController.getById(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Cita no encontrada' });
    });

    it('debería retornar la cita si existe', async () => {
      const mockCita = {
        id: 1,
        cliente: { nombre: 'Test Cliente' },
        fecha: '2024-03-20',
        hora: '10:00'
      };
      mockReq.params.id = 1;
      Cita.findByPk.mockResolvedValue(mockCita);

      await citaController.getById(mockReq, mockRes);
      expect(mockRes.json).toHaveBeenCalledWith(mockCita);
    });
  });

  describe('create', () => {
    it('debería retornar 404 si el cliente no existe', async () => {
      mockReq.body = { cliente_documento: '12345678' };
      Cliente.findOne.mockResolvedValue(null);

      await citaController.create(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Cliente no encontrado' });
    });

    it('debería retornar 400 si ya existe una cita para la fecha y hora', async () => {
      mockReq.body = {
        cliente_documento: '12345678',
        fecha: '2024-03-20',
        hora: '10:00'
      };
      Cliente.findOne.mockResolvedValue({ id: 1 });
      Cita.findOne.mockResolvedValue({ id: 1 });

      await citaController.create(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Ya existe una cita para esta fecha y hora' });
    });

    it('debería crear una nueva cita correctamente', async () => {
      const mockCita = {
        id: 1,
        cliente_documento: '12345678',
        fecha: '2024-03-20',
        hora: '10:00',
        estado: 'PENDING'
      };
      mockReq.body = {
        cliente_documento: '12345678',
        fecha: '2024-03-20',
        hora: '10:00'
      };
      Cliente.findOne.mockResolvedValue({ id: 1 });
      Cita.findOne.mockResolvedValue(null);
      Cita.create.mockResolvedValue(mockCita);

      await citaController.create(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Cita creada correctamente',
        cita: mockCita
      });
    });
  });

  describe('update', () => {
    it('debería retornar 404 si la cita no existe', async () => {
      mockReq.params.id = 1;
      Cita.findByPk.mockResolvedValue(null);

      await citaController.update(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Cita no encontrada' });
    });

    it('debería retornar 400 si ya existe una cita para la nueva fecha y hora', async () => {
      mockReq.params.id = 1;
      mockReq.body = {
        fecha: '2024-03-20',
        hora: '10:00'
      };
      Cita.findByPk.mockResolvedValue({ id: 1 });
      Cita.findOne.mockResolvedValue({ id: 2 });

      await citaController.update(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Ya existe una cita para esta fecha y hora' });
    });

    it('debería actualizar la cita correctamente', async () => {
      const mockCita = {
        id: 1,
        fecha: '2024-03-20',
        hora: '10:00',
        estado: 'PENDING',
        update: jest.fn()
      };
      mockReq.params.id = 1;
      mockReq.body = {
        fecha: '2024-03-21',
        hora: '11:00',
        estado: 'CONFIRMED'
      };
      Cita.findByPk.mockResolvedValue(mockCita);
      Cita.findOne.mockResolvedValue(null);

      await citaController.update(mockReq, mockRes);
      expect(mockCita.update).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Cita actualizada correctamente',
        cita: mockCita
      });
    });
  });

  describe('delete', () => {
    it('debería retornar 404 si la cita no existe', async () => {
      mockReq.params.id = 1;
      Cita.findByPk.mockResolvedValue(null);

      await citaController.delete(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Cita no encontrada' });
    });

    it('debería eliminar la cita correctamente', async () => {
      const mockCita = {
        id: 1,
        destroy: jest.fn()
      };
      mockReq.params.id = 1;
      Cita.findByPk.mockResolvedValue(mockCita);

      await citaController.delete(mockReq, mockRes);
      expect(mockCita.destroy).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Cita eliminada correctamente'
      });
    });
  });

  describe('getByCliente', () => {
    it('debería retornar 404 si el cliente no existe', async () => {
      mockReq.params.documento = '12345678';
      Cliente.findOne.mockResolvedValue(null);

      await citaController.getByCliente(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Cliente no encontrado' });
    });

    it('debería listar las citas del cliente con paginación', async () => {
      const mockCitas = [
        { id: 1, fecha: '2024-03-20' },
        { id: 2, fecha: '2024-03-21' }
      ];
      mockReq.params.documento = '12345678';
      mockReq.query = { page: 1, limit: 10 };
      Cliente.findOne.mockResolvedValue({ id: 1 });
      Cita.findAndCountAll.mockResolvedValue({
        count: 2,
        rows: mockCitas
      });

      await citaController.getByCliente(mockReq, mockRes);
      expect(mockRes.json).toHaveBeenCalledWith({
        data: mockCitas,
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
    it('debería listar las citas de una fecha específica con paginación', async () => {
      const mockCitas = [
        { id: 1, hora: '10:00' },
        { id: 2, hora: '11:00' }
      ];
      mockReq.params.fecha = '2024-03-20';
      mockReq.query = { page: 1, limit: 10 };
      Cita.findAndCountAll.mockResolvedValue({
        count: 2,
        rows: mockCitas
      });

      await citaController.getByFecha(mockReq, mockRes);
      expect(mockRes.json).toHaveBeenCalledWith({
        data: mockCitas,
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