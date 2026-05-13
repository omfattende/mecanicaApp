// Configuración global para tests
import dotenv from 'dotenv';

// Cargar variables de entorno de test
dotenv.config({ path: '.env.test' });

// Mock de console para tests limpios
global.console = {
  ...console,
  // Descomentar para debuggear tests
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
};

// Cleanup después de todos los tests
afterAll(async () => {
  // Cerrar conexiones abiertas si es necesario
});
