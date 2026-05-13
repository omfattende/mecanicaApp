import bcryptjs from 'bcryptjs';
import { UsuarioRepository } from '../repositories/usuario.repository';
import { UsuarioSafe, TipoUsuario } from '../types';
import { ApiError } from '../middlewares/error.middleware';
import logger from '../config/logger';

export const UsuarioService = {
  // Obtener todos los usuarios
  async getAll(): Promise<UsuarioSafe[]> {
    return UsuarioRepository.findAll();
  },

  // Obtener usuario por ID
  async getById(id: number): Promise<UsuarioSafe> {
    const usuario = await UsuarioRepository.findById(id);
    
    if (!usuario) {
      throw new ApiError(404, 'Usuario no encontrado');
    }

    return usuario;
  },

  // Actualizar usuario
  async update(id: number, data: Partial<{
    username: string;
    email: string;
    nombre: string;
    telefono: string;
    foto: string;
    tipo: TipoUsuario;
  }>): Promise<UsuarioSafe> {
    // Verificar que el usuario existe
    const existing = await UsuarioRepository.findById(id);
    
    if (!existing) {
      throw new ApiError(404, 'Usuario no encontrado');
    }

    // Si se está actualizando username o email, verificar que no existan
    if (data.username && data.username !== existing.username) {
      const withSameUsername = await UsuarioRepository.findByUsernameOrEmail(
        data.username,
        ''
      );
      if (withSameUsername) {
        throw new ApiError(400, 'El nombre de usuario ya está en uso');
      }
    }

    if (data.email && data.email !== existing.email) {
      const withSameEmail = await UsuarioRepository.findByUsernameOrEmail(
        '',
        data.email
      );
      if (withSameEmail) {
        throw new ApiError(400, 'El email ya está registrado');
      }
    }

    const usuario = await UsuarioRepository.update(id, data);
    
    if (!usuario) {
      throw new ApiError(500, 'Error al actualizar usuario');
    }

    logger.info('Usuario actualizado', { userId: id, updates: Object.keys(data) });

    return usuario;
  },

  // Cambiar contraseña
  async changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    // Buscar usuario con password
    const usuarios = await this.getAll();
    const usuario = usuarios.find(u => u.id === userId);
    
    if (!usuario) {
      throw new ApiError(404, 'Usuario no encontrado');
    }

    // Obtener el usuario completo con password
    const usuarioConPassword = await UsuarioRepository.findByUsernameWithPassword(
      usuario.username
    );

    if (!usuarioConPassword) {
      throw new ApiError(404, 'Usuario no encontrado');
    }

    // Verificar contraseña actual
    const validPassword = await bcryptjs.compare(
      currentPassword,
      usuarioConPassword.password
    );

    if (!validPassword) {
      throw new ApiError(400, 'Contraseña actual incorrecta');
    }

    // Hashear nueva contraseña
    const hashedPassword = await bcryptjs.hash(newPassword, 10);

    // Actualizar
    await UsuarioRepository.update(userId, { password: hashedPassword });

    logger.info('Contraseña cambiada', { userId });
  },

  // Eliminar usuario
  async delete(id: number): Promise<void> {
    const usuario = await UsuarioRepository.findById(id);
    
    if (!usuario) {
      throw new ApiError(404, 'Usuario no encontrado');
    }

    const deleted = await UsuarioRepository.delete(id);
    
    if (!deleted) {
      throw new ApiError(500, 'Error al eliminar usuario');
    }

    logger.info('Usuario eliminado', { userId: id });
  },

  // Estadísticas
  async getStats(): Promise<{
    total: number;
    clientes: number;
    mecanicos: number;
    admins: number;
  }> {
    const [total, clientes, mecanicos, admins] = await Promise.all([
      Promise.resolve().then(() => this.getAll()).then(u => u.length),
      UsuarioRepository.countByType(TipoUsuario.CLIENTE),
      UsuarioRepository.countByType(TipoUsuario.MECANICO),
      UsuarioRepository.countByType(TipoUsuario.ADMIN),
    ]);

    return {
      total,
      clientes,
      mecanicos,
      admins,
    };
  },
};
