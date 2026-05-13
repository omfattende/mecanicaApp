import { PrismaClient, TipoUsuario, EstadoCita } from '@prisma/client';
import bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Limpiar datos existentes (en orden para respetar FKs)
  await prisma.tarea.deleteMany();
  await prisma.cita.deleteMany();
  await prisma.vehiculo.deleteMany();
  await prisma.usuario.deleteMany();

  console.log('✅ Datos anteriores eliminados');

  // Crear usuarios
  const adminPassword = await bcryptjs.hash('admin123', 10);
  const clientePassword = await bcryptjs.hash('cliente123', 10);
  const mecanicoPassword = await bcryptjs.hash('mecanico123', 10);

  const admin = await prisma.usuario.create({
    data: {
      username: 'admin',
      email: 'admin@tallerpro.com',
      password: adminPassword,
      nombre: 'Administrador',
      telefono: '555-0000',
      tipo: TipoUsuario.ADMIN,
    },
  });

  const cliente1 = await prisma.usuario.create({
    data: {
      username: 'cliente1',
      email: 'cliente1@email.com',
      password: clientePassword,
      nombre: 'Juan Pérez',
      telefono: '555-1111',
      tipo: TipoUsuario.CLIENTE,
    },
  });

  const cliente2 = await prisma.usuario.create({
    data: {
      username: 'cliente2',
      email: 'cliente2@email.com',
      password: clientePassword,
      nombre: 'María García',
      telefono: '555-2222',
      tipo: TipoUsuario.CLIENTE,
    },
  });

  const mecanico = await prisma.usuario.create({
    data: {
      username: 'mecanico1',
      email: 'mecanico@tallerpro.com',
      password: mecanicoPassword,
      nombre: 'Carlos López',
      telefono: '555-3333',
      tipo: TipoUsuario.MECANICO,
    },
  });

  console.log('✅ Usuarios creados');

  // Crear vehículos
  const vehiculo1 = await prisma.vehiculo.create({
    data: {
      usuario_id: cliente1.id,
      marca: 'Toyota',
      modelo: 'Corolla',
      anio: 2020,
      placa: 'ABC-123',
      color: 'Blanco',
      kilometraje: 45000,
    },
  });

  const vehiculo2 = await prisma.vehiculo.create({
    data: {
      usuario_id: cliente1.id,
      marca: 'Honda',
      modelo: 'Civic',
      anio: 2019,
      placa: 'XYZ-789',
      color: 'Negro',
      kilometraje: 62000,
    },
  });

  const vehiculo3 = await prisma.vehiculo.create({
    data: {
      usuario_id: cliente2.id,
      marca: 'Ford',
      modelo: 'Focus',
      anio: 2021,
      placa: 'DEF-456',
      color: 'Azul',
      kilometraje: 28000,
    },
  });

  console.log('✅ Vehículos creados');

  // Crear citas
  const hoy = new Date();
  const manana = new Date(hoy);
  manana.setDate(manana.getDate() + 1);
  const pasadoManana = new Date(hoy);
  pasadoManana.setDate(pasadoManana.getDate() + 2);

  const cita1 = await prisma.cita.create({
    data: {
      usuario_id: cliente1.id,
      vehiculo_id: vehiculo1.id,
      fecha: hoy,
      hora: '09:00',
      servicio: 'Cambio de aceite',
      descripcion: 'Cambio de aceite y revisión general',
      estado: EstadoCita.PENDIENTE,
    },
  });

  const cita2 = await prisma.cita.create({
    data: {
      usuario_id: cliente1.id,
      vehiculo_id: vehiculo2.id,
      fecha: manana,
      hora: '14:00',
      servicio: 'Revisión de frenos',
      descripcion: 'Revisión y posible cambio de pastillas de freno',
      estado: EstadoCita.PENDIENTE,
    },
  });

  const cita3 = await prisma.cita.create({
    data: {
      usuario_id: cliente2.id,
      vehiculo_id: vehiculo3.id,
      fecha: pasadoManana,
      hora: '10:30',
      servicio: 'Alineación y balanceo',
      descripcion: 'Alineación de dirección y balanceo de llantas',
      estado: EstadoCita.PENDIENTE,
    },
  });

  console.log('✅ Citas creadas');

  // Crear tareas
  await prisma.tarea.createMany({
    data: [
      {
        cita_id: cita1.id,
        descripcion: 'Drenar aceite viejo',
        completada: false,
      },
      {
        cita_id: cita1.id,
        descripcion: 'Cambiar filtro de aceite',
        completada: false,
      },
      {
        cita_id: cita1.id,
        descripcion: 'Llenar aceite nuevo',
        completada: false,
      },
      {
        cita_id: cita2.id,
        descripcion: 'Inspeccionar pastillas de freno',
        completada: false,
      },
      {
        cita_id: cita2.id,
        descripcion: 'Revisar discos de freno',
        completada: false,
      },
      {
        cita_id: cita3.id,
        descripcion: 'Alinear dirección',
        completada: false,
      },
      {
        cita_id: cita3.id,
        descripcion: 'Balancear 4 llantas',
        completada: false,
      },
    ],
  });

  console.log('✅ Tareas creadas');

  console.log('\n🎉 Seed completado exitosamente!');
  console.log('\nUsuarios de prueba:');
  console.log('  Admin:     admin / admin123');
  console.log('  Cliente:   cliente1 / cliente123');
  console.log('  Mecánico:  mecanico1 / mecanico123');
}

main()
  .catch((e) => {
    console.error('Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
