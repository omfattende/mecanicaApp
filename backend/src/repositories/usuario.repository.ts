import prisma from '../config/database';
import { Usuario, UsuarioSafe, TipoUsuario } from '../types';

// Excluir password de las respuestas
const excludePassword = (usuario: Usuario | null): UsuarioSafe | null => {
  if (!usuario) return null;
  const { password, ...usuarioSinPassword } = usuario;
  return usuarioSinPassword;
};

export const UsuarioRepository = {
  // Buscar todos los usuarios
  async findAll(): Promise<UsuarioSafe[]> {
    const usuarios = await prisma.usuario.findMany({
      orderBy: { created_at: 'desc' },
    });
    return usuarios.map(u => excludePassword(u)!);
  },

  // Buscar por ID
  async findById(id: number): Promise<UsuarioSafe | null> {
    const usuario = await prisma.usuario.findUnique({
      where: { id },
    });
    return excludePassword(usuario);
  },

  // Buscar por username (incluye password para login)
  async findByUsernameWithPassword(username: string): Promise<Usuario | null> {
    return prisma.usuario.findUnique({
      where: { username },
    });
  },

  // Buscar por email (incluye password para verificación)
  async findByEmailWithPassword(email: string): Promise<Usuario | null> {
    return prisma.usuario.findUnique({
      where: { email },
    });
  },

  // Buscar por username o email
  async findByUsernameOrEmail(username: string, email: string): Promise<UsuarioSafe | null> {
    const usuario = await prisma.usuario.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });
    return excludePassword(usuario);
  },

  // Crear usuario
  async create(data: {
    username: string;
    email: string;
    password: string;
    nombre: string;
    telefono: string;
    tipo?: TipoUsuario;
  }): Promise<UsuarioSafe> {
    const usuario = await prisma.usuario.create({
      data: {
        ...data,
        tipo: data.tipo || TipoUsuario.CLIENTE,
      },
    });
    return excludePassword(usuario)!;
  },

  // Actualizar usuario
  async update(id: number, data: Partial<{
    username: string;
    email: string;
    password: string;
    nombre: string;
    telefono: string;
    foto: string;
    tipo: TipoUsuario;
  }>): Promise<UsuarioSafe | null> {
    try {
      const usuario = await prisma.usuario.update({
        where: { id },
        data,
      });
      return excludePassword(usuario);
    } catch {
      return null;
    }
  },

  // Eliminar usuario
  async delete(id: number): Promise<boolean> {
    try {
      await prisma.usuario.delete({
        where: { id },
      });
      return true;
    } catch {
      return false;
    }
  },

  // Contar usuarios por tipo
  async countByType(tipo: TipoUsuario): Promise<number> {
    return prisma.usuario.count({
      where: { tipo },
    });
  },
};
