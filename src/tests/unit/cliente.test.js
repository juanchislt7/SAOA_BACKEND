import { jest } from '@jest/globals';
import clienteController from '../../controllers/clienteController.js';
import Cliente from '../../models/cliente.js';

jest.mock('../../models/cliente.js');

describe('ClienteController', () => {
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
    it('debería listar clientes con paginación', async () => {
      const mockClientes = [
        { id: 1, nombre: 'Cliente 1' },
        { id: 2, nombre: 'Cliente 2' }
      ];
      mockReq.query = { page: 1, limit: 10 };
      Cliente.findAndCountAll.mockResolvedValue({
        count: 2,
        rows: mockClientes
      });

      await clienteController.list(mockReq, mockRes);
      expect(mockRes.json).toHaveBeenCalledWith({
        data: mockClientes,
        pagination: {
          total: 2,
          page: 1,
          limit: 10,
          totalPages: 1
        }
      });
    });

    it('debería filtrar por búsqueda si se proporciona', async () => {
      mockReq.query = { search: 'test' };
      await clienteController.list(mockReq, mockRes);
      expect(Cliente.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.any(Object)
        })
      );
    });
  });

  describe('getById', () => {
    it('debería retornar 404 si el cliente no existe', async () => {
      mockReq.params.documento = '12345678';
      Cliente.findOne.mockResolvedValue(null);

      await clienteController.getById(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Cliente no encontrado' });
    });

    it('debería retornar el cliente si existe', async () => {
      const mockCliente = {
        documento: '12345678',
        nombre: 'Test Cliente',
        apellido: 'Test'
      };
      mockReq.params.documento = '12345678';
      Cliente.findOne.mockResolvedValue(mockCliente);

      await clienteController.getById(mockReq, mockRes);
      expect(mockRes.json).toHaveBeenCalledWith(mockCliente);
    });
  });

  describe('create', () => {
    it('debería retornar 400 si el documento ya existe', async () => {
      mockReq.body = { documento: '12345678' };
      Cliente.findOne.mockResolvedValue({ id: 1 });

      await clienteController.create(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'El documento ya está registrado' });
    });

    it('debería crear un nuevo cliente correctamente', async () => {
      const mockCliente = {
        documento: '12345678',
        nombre: 'Test Cliente',
        apellido: 'Test',
        activo: true
      };
      mockReq.body = {
        documento: '12345678',
        nombre: 'Test Cliente',
        apellido: 'Test'
      };
      Cliente.findOne.mockResolvedValue(null);
      Cliente.create.mockResolvedValue(mockCliente);

      await clienteController.create(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Cliente creado correctamente',
        cliente: mockCliente
      });
    });
  });

  describe('update', () => {
    it('debería retornar 404 si el cliente no existe', async () => {
      mockReq.params.documento = '12345678';
      Cliente.findOne.mockResolvedValue(null);

      await clienteController.update(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Cliente no encontrado' });
    });

    it('debería actualizar el cliente correctamente', async () => {
      const mockCliente = {
        documento: '12345678',
        nombre: 'Test Cliente',
        apellido: 'Test',
        update: jest.fn()
      };
      mockReq.params.documento = '12345678';
      mockReq.body = {
        nombre: 'Updated Cliente',
        apellido: 'Updated'
      };
      Cliente.findOne.mockResolvedValue(mockCliente);

      await clienteController.update(mockReq, mockRes);
      expect(mockCliente.update).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Cliente actualizado correctamente',
        cliente: mockCliente
      });
    });
  });

  describe('delete', () => {
    it('debería retornar 404 si el cliente no existe', async () => {
      mockReq.params.documento = '12345678';
      Cliente.findOne.mockResolvedValue(null);

      await clienteController.delete(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Cliente no encontrado' });
    });

    it('debería desactivar el cliente correctamente', async () => {
      const mockCliente = {
        documento: '12345678',
        activo: true,
        update: jest.fn()
      };
      mockReq.params.documento = '12345678';
      Cliente.findOne.mockResolvedValue(mockCliente);

      await clienteController.delete(mockReq, mockRes);
      expect(mockCliente.update).toHaveBeenCalledWith({ activo: false });
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Cliente desactivado correctamente'
      });
    });
  });

  describe('search', () => {
    it('debería buscar clientes por nombre, apellido o documento', async () => {
      const mockClientes = [
        { documento: '12345678', nombre: 'Test', apellido: 'Cliente' }
      ];
      mockReq.query = { query: 'test' };
      Cliente.findAll.mockResolvedValue(mockClientes);

      await clienteController.search(mockReq, mockRes);
      expect(mockRes.json).toHaveBeenCalledWith(mockClientes);
    });

    it('debería limitar los resultados a 10', async () => {
      mockReq.query = { query: 'test' };
      await clienteController.search(mockReq, mockRes);
      expect(Cliente.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          limit: 10
        })
      );
    });
  });
}); 