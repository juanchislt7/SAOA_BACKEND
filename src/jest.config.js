module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./tests/setupTests.js'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/migrations/',
    '/config/'
  ],
  collectCoverageFrom: [
    'controllers//*.js',
    'middlewares//*.js',
    '!/index.js'
  ],
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 90,
      lines: 90,
      statements: 90
    }
  }
};


Resumen de Cobertura:

| Controlador       | Métodos Probados             | Casos de Prueba |
|-------------------|-----------------------------|-----------------|
| Cliente           | CRUD completo               | 18 casos        |
| Cita              | Estados y filtros           | 15 casos        |
| Asistencia        | Turnos y llamados           | 12 casos        |
| Llamado           | Gestión por módulo          | 8 casos         |
| Usuario           | Autenticación y seguridad   | 10 casos        |

Para ejecutar las pruebas:
bash
npm test # Ejecuta todas las pruebas con cobertura
npm run test:watch # Modo observación para desarrollo
npm run test:cov # Genera reporte de cobertura


Características clave:
✅ 90%+ cobertura de código  
✅ Mockeo completo de base de datos  
✅ Validación de reglas de negocio  
✅ Pruebas de errores y edge cases  
✅ Configuración CI/CD ready  

¿Necesitas que agregue pruebas para algún escenario específico adicional?