const { Cliente } = require('../../../models');
const clienteController = require('../../../controllers/clienteController');

describe('ClienteController', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('create()', () => {
    it('debería crear cliente con datos válidos', async () => {
      mockReq = {
        body: {
          documento: '12345678',
          nombre: 'María',
          apellido: 'Gómez',
          email: 'maria@example.com',
          telefono: '3001234567'
        }
      };

      Cliente.findByPk.mockResolvedValue(null);
      Cliente.create.mockResolvedValue(mockReq.body);

      await clienteController.create(mockReq, mockRes);

      expect(Cliente.create).toHaveBeenCalledWith(mockReq.body);
      expect(mockRes.status).toHaveBeenCalledWith(201);
    });

    it('debería rechazar cliente con documento existente', async () => {
      mockReq = { body: { documento: '12345678' } };
      Cliente.findByPk.mockResolvedValue({});

      await clienteController.create(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: 'Cliente ya existe' })
      );
    });
  });

  describe('update()', () => {
    it('debería actualizar datos del cliente', async () => {
      const mockCliente = {
        documento: '12345678',
        update: jest.fn().mockResolvedValue(true)
      };

      mockReq = {
        params: { documento: '12345678' },
        body: { nombre: 'María Updated' }
      };

      Cliente.findByPk.mockResolvedValue(mockCliente);

      await clienteController.update(mockReq, mockRes);

      expect(mockCliente.update).toHaveBeenCalledWith(mockReq.body);
      expect(mockRes.json).toHaveBeenCalled();
    });
  });

  // Tests adicionales para list(), getById(), delete()
});