import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Usuario from '../models/usuario.js';

class UsuarioController {
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validar que se proporcionen las credenciales
      if (!email || !password) {
        return res.status(400).json({ error: 'Email y contraseña son requeridos' });
      }

      // Buscar usuario por email
      const usuario = await Usuario.findOne({ where: { email } });
      if (!usuario) {
        return res.status(401).json({ error: 'Credenciales inválidas.' });
      }

      // Verificar si el usuario está activo
      if (!usuario.activo) {
        return res.status(401).json({ error: 'Usuario inactivo' });
      }

      // Verificar contraseña
      const passwordValido = await bcrypt.compare(password, usuario.password);
      if (!passwordValido) {
        return res.status(401).json({ error: 'Credenciales inválidas..' });
      }

      // Generar token JWT
      const token = jwt.sign(
        { 
          id: usuario.id,
          email: usuario.email,
          rol: usuario.rol 
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      // Enviar respuesta
      return res.json({
        token,
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol
        }
      });
    } catch (error) {
      console.error('Error en login:', error);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
  }

  async registro(req, res) {
    try {
      const { nombre, apellido, email, password, tipo_usuario, estado_usuario } = req.body;
      console.log('*******',req.body)

      // Verificar si el email ya está registrado
      const usuarioExistente = await Usuario.findOne({ where: { email } });
      if (usuarioExistente) {
        return res.status(400).json({ error: 'El email ya está registrado' });
      }

      // Crear nuevo usuario
      const usuario = await Usuario.create({
        Nombre: nombre,
        Apellido: apellido,
        Email: email,
        Contraseña: password,
        Tipo_Usuario: tipo_usuario,
        Estado_Usuario: estado_usuario
      });
console.log('*******',usuario)
      return res.status(201).json({
        message: 'Usuario registrado correctamente',
        usuario: {
          id: usuario.Id_Usuario,
          nombre: usuario.Nombre,
          email: usuario.Email,
          rol: usuario.Tipo_Usuario
        }
      });
    } catch (error) {
      console.error('Error en registro:', error);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
  }

  async getProfile(req, res) {
    try {
      const usuario = await Usuario.findByPk(req.userId, {
        attributes: { exclude: ['password'] }
      });

      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      return res.json(usuario);
    } catch (error) {
      console.error('Error al obtener perfil:', error);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
  }

  async updateProfile(req, res) {
    try {
      const usuario = await Usuario.findByPk(req.userId);
      
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      const { nombre, email } = req.body;

      // Verificar si el nuevo email ya está en uso
      if (email && email !== usuario.email) {
        const emailExistente = await Usuario.findOne({ where: { email } });
        if (emailExistente) {
          return res.status(400).json({ error: 'El email ya está en uso' });
        }
      }

      await usuario.update({ nombre, email });

      return res.json({
        message: 'Perfil actualizado correctamente',
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol
        }
      });
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
  }

  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const usuario = await Usuario.findByPk(req.userId);

      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      // Verificar contraseña actual
      const passwordValido = await bcrypt.compare(currentPassword, usuario.password);
      if (!passwordValido) {
        return res.status(401).json({ error: 'Contraseña actual incorrecta' });
      }

      // Actualizar contraseña
      usuario.password = newPassword;
      await usuario.save();

      return res.json({ message: 'Contraseña actualizada correctamente' });
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
  }

  async list(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const { count, rows: usuarios } = await Usuario.findAndCountAll({
        attributes: { exclude: ['password'] },
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['nombre', 'ASC']]
      });

      return res.json({
        data: usuarios,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      });
    } catch (error) {
      console.error('Error al listar usuarios:', error);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
  }

  async getById(req, res) {
    try {
      const usuario = await Usuario.findByPk(req.params.id, {
        attributes: { exclude: ['password'] }
      });

      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      return res.json(usuario);
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
  }

  async create(req, res) {
    try {
      const { nombre, email, password, rol } = req.body;

      // Verificar si el email ya está registrado
      const usuarioExistente = await Usuario.findOne({ where: { email } });
      if (usuarioExistente) {
        return res.status(400).json({ error: 'El email ya está registrado' });
      }

      const usuario = await Usuario.create({
        nombre,
        email,
        password,
        rol,
        activo: true
      });

      return res.status(201).json({
        message: 'Usuario creado correctamente',
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol
        }
      });
    } catch (error) {
      console.error('Error al crear usuario:', error);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
  }

  async update(req, res) {
    try {
      const usuario = await Usuario.findByPk(req.params.id);
      
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      const { Nombre, Apellido, Email, Tipo_Usuario, Estado } = req.body;

      /*
      // Verificar si el nuevo email ya está en uso
      if (email && email !== usuario.Email) {
        const emailExistente = await Usuario.findOne({ where: { Email } });
        if (emailExistente) {
          return res.status(400).json({ error: 'El email ya está en uso' });
        }
      }*/

      await usuario.update({ Nombre, Apellido, Email, Tipo_Usuario, Estado });

      return res.json({
        message: 'Usuario actualizado correctamente'
      });
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
  }

  async delete(req, res) {
    try {
      const usuario = await Usuario.findByPk(req.params.id);
      
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      // Eliminar el usuario de la base de datos
      await usuario.destroy();

      return res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
  }
}

export default new UsuarioController();