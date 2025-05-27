const { LlamadoTurno, Asistencia } = require('../../../models');
const llamadoController = require('../../../controllers/llamadoController');

describe('LlamadoController', () => {
  describe('listByModulo()', () => {
    it('debería filtrar llamados por módulo', async () => {
      const mockReq = {
        params: { modulo: 'Modulo1' }
      };
      const mockRes = {
        json: jest.fn()
      };

      await llamadoController.listByModulo(mockReq, mockRes);

      expect(LlamadoTurno.findAll).toHaveBeenCalledWith({
        where: { modulo: 'Modulo1' },
        include: expect.anything(),
        order: [['hora_llamado', 'DESC']]
      });
    });
  });

  // Tests adicionales para list(), listToday()
});