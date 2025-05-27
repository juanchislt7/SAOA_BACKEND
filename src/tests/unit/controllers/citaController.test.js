const { Cita, Cliente } = require('../../../models');
const citaController = require('../../../controllers/citaController');
const { Op } = require('sequelize');

describe('CitaController', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('create()', () => {
    it('debería agendar cita para cliente existente', async () => {
      mockReq = {
        body: {
          cliente_documento: '12345678',
          fecha_hora: '2023-06-15T10:00:00',
          tipo_tramite: 'Registro Civil'
        }
      };

      Cliente.findByPk.mockResolvedValue({ documento: '12345678' });
      Cita.create.mockResolvedValue(mockReq.body);

      await citaController.create(mockReq, mockRes);

      expect(Cita.create).toHaveBeenCalledWith(mockReq.body);
      expect(mockRes.status).toHaveBeenCalledWith(201);
    });
  });

  describe('cambiarEstado()', () => {
    it('debería cambiar estado a "confirmada"', async () => {
      const mockCita = {
        id: 1,
        estado: 'pendiente',
        update: jest.fn()
      };

      mockReq = {
        params: { id: 1 },
        body: { estado: 'confirmada' }
      };

      Cita.findByPk.mockResolvedValue(mockCita);

      await citaController.cambiarEstado(mockReq, mockRes);

      expect(mockCita.update).toHaveBeenCalledWith({ estado: 'confirmada' });
    });

    it('debería rechazar estado inválido', async () => {
      mockReq = {
        params: { id: 1 },
        body: { estado: 'invalido' }
      };

      await citaController.cambiarEstado(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });
  });

  // Tests adicionales para list(), getById(), update(), delete()
});