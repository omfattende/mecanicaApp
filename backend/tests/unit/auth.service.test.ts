import { AuthService } from '../../src/services/auth.service';
import { UsuarioRepository } from '../../src/repositories/usuario.repository';
import { ApiError } from '../../src/middlewares/error.middleware';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Mocks
jest.mock('../../src/repositories/usuario.repository');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashedpassword',
      nombre: 'Test User',
      telefono: '555-1234',
      tipo: 'CLIENTE' as const,
      foto: null,
      created_at: new Date(),
      updated_at: new Date(),
    };

    it('debería hacer login exitosamente con credenciales válidas', async () => {
      (UsuarioRepository.findByUsernameWithPassword as jest.Mock).mockResolvedValue(mockUser);
      (bcryptjs.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('mocked-token');

      const result = await AuthService.login({
        username: 'testuser',
        password: 'password123',
      });

      expect(result.token).toBe('mocked-token');
      expect(result.user).not.toHaveProperty('password');
      expect(result.user.username).toBe('testuser');
    });

    it('debería lanzar error si el usuario no existe', async () => {
      (UsuarioRepository.findByUsernameWithPassword as jest.Mock).mockResolvedValue(null);

      await expect(
        AuthService.login({ username: 'nonexistent', password: 'password' })
      ).rejects.toThrow(ApiError);
    });

    it('debería lanzar error si la contraseña es incorrecta', async () => {
      (UsuarioRepository.findByUsernameWithPassword as jest.Mock).mockResolvedValue(mockUser);
      (bcryptjs.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        AuthService.login({ username: 'testuser', password: 'wrongpassword' })
      ).rejects.toThrow(ApiError);
    });
  });

  describe('register', () => {
    const registerData = {
      username: 'newuser',
      email: 'new@example.com',
      password: 'password123',
      nombre: 'New User',
      telefono: '555-5678',
    };

    it('debería registrar un usuario exitosamente', async () => {
      (UsuarioRepository.findByUsernameOrEmail as jest.Mock).mockResolvedValue(null);
      (UsuarioRepository.create as jest.Mock).mockResolvedValue({
        id: 1,
        ...registerData,
        tipo: 'CLIENTE',
        foto: null,
        created_at: new Date(),
        updated_at: new Date(),
      });

      const result = await AuthService.register(registerData);

      expect(result).not.toHaveProperty('password');
      expect(result.username).toBe(registerData.username);
    });

    it('debería lanzar error si el username ya existe', async () => {
      (UsuarioRepository.findByUsernameOrEmail as jest.Mock).mockResolvedValue({
        username: 'newuser',
        email: 'other@example.com',
      });

      await expect(AuthService.register(registerData)).rejects.toThrow(ApiError);
    });

    it('debería lanzar error si el email ya existe', async () => {
      (UsuarioRepository.findByUsernameOrEmail as jest.Mock).mockResolvedValue({
        username: 'otheruser',
        email: 'new@example.com',
      });

      await expect(AuthService.register(registerData)).rejects.toThrow(ApiError);
    });
  });

  describe('verifyToken', () => {
    it('debería verificar un token válido', async () => {
      const mockPayload = { id: 1, username: 'test', tipo: 'CLIENTE' };
      (jwt.verify as jest.Mock).mockReturnValue(mockPayload);
      (UsuarioRepository.findById as jest.Mock).mockResolvedValue({
        id: 1,
        username: 'test',
        nombre: 'Test',
      });

      const result = await AuthService.verifyToken('valid-token');

      expect(result.id).toBe(1);
    });

    it('debería lanzar error si el token está expirado', async () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new jwt.TokenExpiredError('Token expired', new Date());
      });

      await expect(AuthService.verifyToken('expired-token')).rejects.toThrow(ApiError);
    });
  });
});
