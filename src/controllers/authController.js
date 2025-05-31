import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Usuario } from '../models/index.js';

const authController = {
  async login(req, res) {
    try {
      const { email, password } = req.body;
      console.log('Intento de login:', { email, password });

      const usuario = await Usuario.findOne({ where: { Email: email } });
      console.log('Usuario encontrado:', {
        id: usuario?.Id_Usuario,
        email: usuario?.Email,
        contraseñaHasheada: usuario?.Contraseña
      });

      if (!usuario) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      // Debug de la verificación de contraseña
      console.log('Iniciando verificación de contraseña...');
      console.log('Contraseña ingresada:', password);
      console.log('Contraseña hasheada en BD:', usuario.Contraseña);
      
      const isValidPassword = await usuario.verifyPassword(password);
      console.log('Resultado de verificación:', isValidPassword);

      if (!isValidPassword) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      const token = jwt.sign(
        { 
          id: usuario.Id_Usuario, 
          rol: usuario.Tipo_Usuario 
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.json({
        token,
        usuario: {
          id: usuario.Id_Usuario,
          nombre: usuario.Nombre,
          apellido: usuario.Apellido,
          email: usuario.Email,
          tipo_usuario: usuario.Tipo_Usuario
        }
      });
    } catch (error) {
      console.error('Error en login:', error);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
  },

  async getProfile(req, res) {
    try {
      const usuario = await Usuario.findByPk(req.userId, {
        attributes: { exclude: ['Contraseña'] }
      });

      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      return res.json(usuario);
    } catch (error) {
      console.error('Error al obtener perfil:', error);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
  },

  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const usuario = await Usuario.findByPk(req.userId);

      const isValidPassword = await usuario.verifyPassword(currentPassword);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Contraseña actual incorrecta' });
      }

      usuario.Contraseña = newPassword;
      await usuario.save();

      return res.json({ message: 'Contraseña actualizada correctamente' });
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
  }
};

export default authController; 