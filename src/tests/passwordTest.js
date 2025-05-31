import bcrypt from 'bcryptjs';
import Usuario from '../models/usuario.js';

// Ejemplo de uso
async function testPassword() {
  try {
    // 1. Crear un usuario de prueba
    const password = '123456';
    console.log('Contraseña original:', password);

    // 2. Crear hash directamente con bcrypt
    const hash = await bcrypt.hash(password, 10);
    console.log('Hash generado:', hash);

    // 3. Crear usuario en la base de datos
    const usuario = await Usuario.create({
      Nombre: 'Test',
      Apellido: 'User',
      Email: 'test@example.com',
      Contraseña: password,
      Tipo_Usuario: 'admin',
      Estado_Usuario: 'activo'
    });

    console.log('Usuario creado:', {
      id: usuario.Id_Usuario,
      email: usuario.Email,
      contraseñaHasheada: usuario.Contraseña
    });

    // 4. Intentar verificar la contraseña
    const isValid = await usuario.verifyPassword(password);
    console.log('¿Contraseña válida?:', isValid);

    // 5. Intentar verificar con bcrypt.compare directamente
    const directCompare = await bcrypt.compare(password, usuario.Contraseña);
    console.log('Comparación directa con bcrypt:', directCompare);

  } catch (error) {
    console.error('Error en la prueba:', error);
  }
}

// Ejecutar la prueba
testPassword(); 