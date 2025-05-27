const bcrypt = require('bcryptjs');
const { Usuario } = require('../../../models');
const usuarioController = require('../../../controllers/usuarioController');

describe('UsuarioController', () => {
  describe('changePassword()', () => {
    it('debería actualizar contraseña correctamente', async () => {
      const mockUsuario = {
        id: 1,
        password: 'oldHash',
        update: jest.fn()
      };

      const mockReq = {
        params: { id: 1 },
        body: {
          currentPassword: 'oldPass',
          newPassword: 'newPass123'
        }
      };

      const mockRes = {
        json: jest.fn()
      };

      Usuario.findByPk.mockResolvedValue(mockUsuario);
      bcrypt.compare.mockResolvedValue(true);
      bcrypt.hash.mockResolvedValue('newHash');

      await usuarioController.changePassword(mockReq, mockRes);

      expect(bcrypt.compare).toHaveBeenCalledWith('oldPass', 'oldHash');
      expect(mockUsuario.update).toHaveBeenCalledWith({ password: 'newHash' });
    });
  });

  // Tests adicionales para list(), getById(), create(), update(), delete()
});