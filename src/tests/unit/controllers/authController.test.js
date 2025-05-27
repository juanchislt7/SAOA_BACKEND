const jwt = require('jsonwebtoken');
const { Usuario } = require('../../../models');
const authController = require('../../../controllers/authController');

describe('AuthController', () => {
  describe('login()', () => {
    it('debería retornar token con credenciales válidas', async () => {
      const mockUsuario = {
        id: 1,
        username: 'admin',
        password: 'hash123',
        activo: true,
        checkPassword: jest.fn().mockResolvedValue(true)
      };

      const mockReq = {
        body: { username: 'admin', password: '123456' }
      };

      const mockRes = {
        json: jest.fn()
      };

      Usuario.findOne.mockResolvedValue(mockUsuario);
      jwt.sign.mockReturnValue('fake.token.123');

      await authController.login(mockReq, mockRes);

      expect(jwt.sign).toHaveBeenCalledWith(
        { id: 1, rol: undefined },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
      );
      expect(mockRes.json).toHaveBeenCalledWith({
        token: 'fake.token.123',
        usuario: expect.anything()
      });
    });
  });
});