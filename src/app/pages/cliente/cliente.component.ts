import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, User } from '../../auth/auth.service';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { CitaService, Cita } from '../../shared/services/cita.service';
import { VehiculoService, Vehiculo } from '../../shared/services/vehiculo.service';
import { TareaService, TareaServicio } from '../../shared/services/tarea.service';

@Component({
  selector: 'app-cliente',
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './cliente.component.html',
  styleUrl: './cliente.component.scss'
})
export class ClienteComponent implements OnInit {
  currentUser: User | null = null;
  activeSection: string = 'dashboard';
  mostrarFormularioCita = false;
  mostrarFormularioVehiculo = false;

  vehiculos: Vehiculo[] = [];
  citasActivas: Cita[] = [];
  historialCitas: Cita[] = [];

  citaSeleccionada: Cita | null = null;
  tareasCitaSeleccionada: TareaServicio[] = [];

  // Definición del flujo de progreso
  currentYear = new Date().getFullYear();

  estadosProgreso = [
    'Pendiente',
    'En revisión',
    'Esperando repuestos',
    'En reparación',
    'Listo para entrega',
    'Entregada'
  ];

  // Colores distintivos para cada estado del progreso
  estadoColores: Record<string, { bg: string; border: string; glow: string; text: string; line: string }> = {
    'Pendiente':              { bg: '#64748b', border: '#94a3b8', glow: 'rgba(148,163,184,0.5)',  text: '#e2e8f0', line: '#94a3b8' },
    'En revisión':            { bg: '#f59e0b', border: '#fbbf24', glow: 'rgba(251,191,36,0.5)',   text: '#fffbeb', line: '#fbbf24' },
    'Esperando repuestos':    { bg: '#eab308', border: '#fde047', glow: 'rgba(253,224,71,0.5)',   text: '#fefce8', line: '#fde047' },
    'En reparación':          { bg: '#3b82f6', border: '#60a5fa', glow: 'rgba(96,165,250,0.5)',   text: '#eff6ff', line: '#60a5fa' },
    'Listo para entrega':     { bg: '#a855f7', border: '#c084fc', glow: 'rgba(192,132,252,0.5)',  text: '#faf5ff', line: '#c084fc' },
    'Entregada':              { bg: '#22c55e', border: '#4ade80', glow: 'rgba(74,222,128,0.5)',   text: '#f0fdf4', line: '#4ade80' },
  };

  // Iconos para cada estado
  estadoIconos: Record<string, string> = {
    'Pendiente': 'fa-clipboard-list',
    'En revisión': 'fa-search',
    'Esperando repuestos': 'fa-box-open',
    'En reparación': 'fa-wrench',
    'Listo para entrega': 'fa-check-double',
    'Entregada': 'fa-car',
  };

  nuevaCita: Partial<Cita> = {
    servicio: 'Mantenimiento General'
  };

  nuevoVehiculo: Partial<Vehiculo> = {};

  constructor(
    private authService: AuthService,
    private citaService: CitaService,
    private vehiculoService: VehiculoService,
    private tareaService: TareaService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit() {
    // En el servidor no hacer nada (localStorage no existe en SSR)
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Verificar autenticación y tipo de usuario
    this.currentUser = this.authService.getCurrentUser();

    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    // Si es admin, redirigir a admin
    if (this.currentUser.tipo === 'admin') {
      this.router.navigate(['/admin']);
      return;
    }

    this.cargarVehiculos();
    this.cargarCitas();
  }

  cargarCitas() {
    const user = this.authService.getCurrentUser();
    if (!user || !user.id) return;
    this.currentUser = user;
    this.citaService.getCitasByCliente(Number(user.id)).subscribe({
      next: (res) => {
        if (res.success) {
          // Separar citas activas del historial (entregadas o canceladas)
          this.citasActivas = res.citas.filter(c => c.estado !== 'Entregada' && c.estado !== 'Cancelada');
          this.historialCitas = res.citas.filter(c => c.estado === 'Entregada' || c.estado === 'Cancelada');
        }
      },
      error: (err) => console.error('Error cargando citas:', err)
    });
  }

  verDetallesCita(cita: Cita) {
    this.citaSeleccionada = cita;
    if (cita.id) {
      this.tareaService.getTareasByCita(cita.id).subscribe(res => {
        if (res.success) {
          this.tareasCitaSeleccionada = res.tareas;
        }
      });
    }
  }

  cerrarModalCita() {
    this.citaSeleccionada = null;
    this.tareasCitaSeleccionada = [];
  }

  // Helpers para el Progress Bar
  getProgresoIndex(estadoActual: string | undefined): number {
    if (!estadoActual) return 0;
    return this.estadosProgreso.indexOf(estadoActual);
  }

  isPasoCompletado(estadoActual: string | undefined, pasoEstado: string): boolean {
    return this.getProgresoIndex(estadoActual) >= this.estadosProgreso.indexOf(pasoEstado);
  }

  isPasoActual(estadoActual: string | undefined, pasoEstado: string): boolean {
    return estadoActual === pasoEstado;
  }

  getColorEstado(estado: string): { bg: string; border: string; glow: string; text: string; line: string } {
    return this.estadoColores[estado] || this.estadoColores['Pendiente'];
  }

  cargarVehiculos() {
    const user = this.authService.getCurrentUser();
    if (!user || !user.id) return;
    this.currentUser = user;
    this.vehiculoService.getVehiculosByUsuario(Number(user.id)).subscribe({
      next: (res) => {
        if (res.success) {
          this.vehiculos = res.vehiculos;
        }
      },
      error: (err) => console.error('Error cargando vehículos:', err)
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleFormularioCita() {
    this.mostrarFormularioCita = !this.mostrarFormularioCita;
  }

  toggleFormularioVehiculo() {
    this.mostrarFormularioVehiculo = !this.mostrarFormularioVehiculo;
  }

  registrarVehiculo() {
    console.log('>>> registrarVehiculo called', this.nuevoVehiculo);
    // Obtener usuario actual (puede ser null en SSR, leer de nuevo)
    const user = this.authService.getCurrentUser();
    if (!user || !user.id) {
      console.log('>>> No current user');
      alert('Tu sesión ha expirado. Por favor inicia sesión de nuevo.');
      this.router.navigate(['/login']);
      return;
    }
    this.currentUser = user;
    this.nuevoVehiculo.usuario_id = Number(user.id);
    // Convertir a números antes de enviar
    this.nuevoVehiculo.anio = Number(this.nuevoVehiculo.anio);
    if (this.nuevoVehiculo.kilometraje) {
      this.nuevoVehiculo.kilometraje = Number(this.nuevoVehiculo.kilometraje);
    }
    console.log('>>> Enviando vehiculo:', this.nuevoVehiculo);
    this.vehiculoService.registrarVehiculo(this.nuevoVehiculo as Vehiculo).subscribe({
      next: (res) => {
        if (res.success) {
          alert('Vehículo registrado exitosamente');
          this.vehiculos.unshift(res.vehiculo);
          this.mostrarFormularioVehiculo = false;
          this.nuevoVehiculo = {};
        }
      },
      error: (err) => {
        console.error(err);
        const validationErrors = err.error?.errors;
        if (Array.isArray(validationErrors) && validationErrors.length > 0) {
          const msg = validationErrors.map((e: any) => e.message).join('\n');
          alert('Error de validación:\n' + msg);
        } else {
          alert(err.error?.message || 'Error al registrar el vehículo');
        }
      }
    });
  }

  agendarCita() {
    const user = this.authService.getCurrentUser();
    if (!user || !user.id) {
      alert('Tu sesión ha expirado. Por favor inicia sesión de nuevo.');
      this.router.navigate(['/login']);
      return;
    }
    this.currentUser = user;

    if (!this.nuevaCita.vehiculo_id) {
      alert('Por favor selecciona un vehículo');
      return;
    }

    this.nuevaCita.usuario_id = Number(user.id);
    this.nuevaCita.vehiculo_id = Number(this.nuevaCita.vehiculo_id);

    this.citaService.crearCita(this.nuevaCita as Cita).subscribe({
      next: (res) => {
        if (res.success) {
          alert('Cita agendada exitosamente');
          this.mostrarFormularioCita = false;
          res.cita.estado = 'Pendiente'; // Estado por defecto
          // Agregamos también la info del vehículo para que se muestre en UI antes de recargar
          const vehiculo = this.vehiculos.find(v => v.id === res.cita.vehiculo_id);
          if (vehiculo) {
            res.cita.marca = vehiculo.marca;
            res.cita.modelo = vehiculo.modelo;
            res.cita.placa = vehiculo.placa;
          }
          this.citasActivas.unshift(res.cita);
          this.nuevaCita = { servicio: 'Mantenimiento General' };
        }
      },
      error: (err) => {
        console.error(err);
        const validationErrors = err.error?.errors;
        if (Array.isArray(validationErrors) && validationErrors.length > 0) {
          const msg = validationErrors.map((e: any) => e.message).join('\n');
          alert('Error de validación:\n' + msg);
        } else {
          alert(err.error?.message || 'Error al agendar la cita');
        }
      }
    });
  }
}
