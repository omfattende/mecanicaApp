import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UsuarioRepository } from '../repositories/usuario.repository';
import { LoginInput, RegisterInput, UsuarioSafe, JwtPayload, TipoUsuario } from '../types';
import { ApiError } from '../middlewares/error.middleware';
import logger from '../config/logger';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '24h') as jwt.SignOptions['expiresIn'];

// Opciones de cookie
export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 24 * 60 * 60 * 1000, // 24 horas
};

export const AuthService = {
  // Login de usuario
  async login(data: LoginInput): Promise<{ token: string; user: UsuarioSafe }> {
    const { username, password } = data;

    // Buscar usuario con password
    const usuario = await UsuarioRepository.findByUsernameWithPassword(username);

    if (!usuario) {
      logger.warn('Intento de login con usuario inexistente', { username });
      throw new ApiError(401, 'Usuario o contraseña incorrectos');
    }

    // Verificar contraseña
    const validPassword = await bcryptjs.compare(password, usuario.password);

    if (!validPassword) {
      logger.warn('Intento de login con contraseña incorrecta', { username, userId: usuario.id });
      throw new ApiError(401, 'Usuario o contraseña incorrectos');
    }

    // Generar token
    const payload: JwtPayload = {
      id: usuario.id,
      username: usuario.username,
      tipo: (usuario.tipo as TipoUsuario | null) || TipoUsuario.CLIENTE,
    };

    const token = jwt.sign(payload, JWT_SECRET as jwt.Secret, { expiresIn: JWT_EXPIRES_IN });

    // Eliminar password del usuario
    const { password: _, ...userWithoutPassword } = usuario;

    logger.info('Login exitoso', { userId: usuario.id, username });

    return {
      token,
      user: userWithoutPassword as UsuarioSafe,
    };
  },

  // Registro de usuario
  async register(data: RegisterInput): Promise<UsuarioSafe> {
    const { username, email, password, nombre, telefono } = data;

    // Verificar si ya existe
    const existingUser = await UsuarioRepository.findByUsernameOrEmail(username, email);

    if (existingUser) {
      if (existingUser.username === username) {
        throw new ApiError(400, 'El nombre de usuario ya está en uso');
      }
      if (existingUser.email === email) {
        throw new ApiError(400, 'El email ya está registrado');
      }
    }

    // Hashear contraseña
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Crear usuario
    const usuario = await UsuarioRepository.create({
      username,
      email,
      password: hashedPassword,
      nombre,
      telefono,
    });

    logger.info('Usuario registrado', { userId: usuario.id, username, email });

    return usuario;
  },

  // Verificar token
  async verifyToken(token: string): Promise<UsuarioSafe> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

      // Buscar usuario actualizado
      const usuario = await UsuarioRepository.findById(decoded.id);

      if (!usuario) {
        throw new ApiError(401, 'Usuario no encontrado');
      }

      return usuario;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new ApiError(401, 'Token expirado');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new ApiError(401, 'Token inválido');
      }
      throw error;
    }
  },

  // Logout (para logging principalmente)
  logout(userId: number): void {
    logger.info('Logout', { userId });
  },

  // Cambiar contraseña
  async changePassword(userId: number, currentPassword: string, newPassword: string): Promise<void> {
    const usuario = await UsuarioRepository.findByUsernameWithPassword('');
    // Necesitamos buscar por ID, voy a agregar ese método
    logger.warn('changePassword no implementado completamente', { userId });
    throw new ApiError(501, 'Función no implementada');
  },
};
