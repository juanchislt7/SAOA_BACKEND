const { Asistencia, Cliente, LlamadoTurno } = require('../../../models');
const asistenciaController = require('../../../controllers/asistenciaController');

describe('AsistenciaController', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    jest.clearAllMock();
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('create()', () => {
    it('debería registrar nueva asistencia', async () => {
      mockReq = {
        body: {
          cliente_documento: '12345678',
          tipo_tramite: 'Cédula',
          modulo: 'Modulo1'
        }
      };

      Cliente.findByPk.mockResolvedValue({ documento: '12345678' });
      Asistencia.create.mockResolvedValue(mockReq.body);

      await asistenciaController.create(mockReq, mockRes);

      expect(Asistencia.create).toHaveBeenCalledWith({
        ...mockReq.body,
        estado: 'espera'
      });
    });
  });

  describe('llamarTurno()', () => {
    it('debería registrar llamado y cambiar estado', async () => {
      const mockAsistencia = {
        id: 1,
        estado: 'espera',
        update: jest.fn()
      };

      mockReq = {
        params: { id: 1 },
        user: { id: 1 }
      };

      Asistencia.findByPk.mockResolvedValue(mockAsistencia);
      LlamadoTurno.create.mockResolvedValue({});

      await asistenciaController.llamarTurno(mockReq, mockRes);

      expect(mockAsistencia.update).toHaveBeenCalledWith({
        estado: 'en_atencion'
      });
      expect(LlamadoTurno.create).toHaveBeenCalled();
    });
  });

  // Tests adicionales para list(), getById(), update()
});