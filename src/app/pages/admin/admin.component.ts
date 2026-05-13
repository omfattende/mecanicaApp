import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { AuthService, User } from '../../auth/auth.service';
import { CitaService, Cita } from '../../shared/services/cita.service';
import { TareaService, TareaServicio } from '../../shared/services/tarea.service';
import { UsuarioService } from '../../shared/services/usuario.service';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, FullCalendarModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
  currentUser: User | null = null;
  registeredUsers: User[] = [];
  activeSection = 'dashboard';
  citas: Cita[] = [];
  citasActivas: Cita[] = [];
  citasHoy: Cita[] = [];
  citasCompletadas: Cita[] = [];
  selectedCita: Cita | null = null;
  estadoEdicion: string = 'Pendiente';

  showUserModal = false;
  selectedUser: Partial<User> | null = null;

  tareasCitaList: TareaServicio[] = [];
  nuevaTareaDescripcion = '';
  estadosVehiculo = [
    'Pendiente',
    'En revisión',
    'Esperando repuestos',
    'En reparación',
    'Listo para entrega',
    'Entregada',
    'Cancelada'
  ];

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    events: [],
    eventClick: this.handleEventClick.bind(this)
  };

  constructor(
    private authService: AuthService,
    private citaService: CitaService,
    private tareaService: TareaService,
    private usuarioService: UsuarioService,
    private router: Router
  ) { }

  ngOnInit() {
    // Verificar autenticación y tipo de usuario
    this.currentUser = this.authService.getCurrentUser();

    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    // Si no es admin, redirigir a cliente
    if (this.currentUser.tipo !== 'admin') {
      this.router.navigate(['/cliente']);
      return;
    }

    this.loadRegisteredUsers();
    this.loadCitas();
  }

  loadRegisteredUsers() {
    this.usuarioService.getUsuarios().subscribe(res => {
      if (res.success) {
        this.registeredUsers = res.usuarios;
      }
    });
  }

  abrirModalUsuario(u: User) {
    this.selectedUser = { ...u }; // clone to avoid two-way binding mutation without saving
    this.showUserModal = true;
  }

  cerrarModalUsuario() {
    this.showUserModal = false;
    this.selectedUser = null;
  }

  guardarCambiosUsuario() {
    if (!this.selectedUser?.id) return;

    // Warning confirmation
    if (!confirm('ADVERTENCIA: Vas a modificar los datos de acceso o información personal de este usuario. ¿Deseas continuar?')) {
      return;
    }

    this.usuarioService.actualizarUsuario(this.selectedUser.id, this.selectedUser).subscribe({
      next: (res) => {
        if (res.success) {
          alert('Usuario actualizado exitosamente');
          this.loadRegisteredUsers(); // refresh list
          this.cerrarModalUsuario();
        }
      },
      error: (err) => {
        alert(err.error?.message || 'Error al actualizar el usuario');
      }
    });
  }

  loadCitas() {
    this.citaService.getCitas().subscribe((res) => {
      if (res.success) {
        this.citas = res.citas;
        this.actualizarListasDerivadas();

        this.calendarOptions.events = this.citasActivas.map((cita) => {
          return {
            id: cita.id?.toString(),
            title: `${cita.servicio} - ${cita.cliente_nombre || 'Cliente'}`,
            date: cita.fecha,
            extendedProps: {
              ...cita
            }
          } as EventInput;
        });
      }
    });
  }

  handleEventClick(clickInfo: any) {
    const cita = { ...clickInfo.event.extendedProps } as Cita;
    this.abrirDetallesCita(cita);
  }

  abrirDetallesCita(cita: Cita) {
    this.selectedCita = cita;
    this.selectedCita.estado = this.selectedCita.estado || 'Pendiente';
    this.estadoEdicion = this.selectedCita.estado;
    this.loadTareas(this.selectedCita.id!);
  }

  loadTareas(citaId: number) {
    this.tareaService.getTareasByCita(citaId).subscribe(res => {
      if (res.success) {
        this.tareasCitaList = res.tareas;
      }
    });
  }

  agregarTarea() {
    if (!this.nuevaTareaDescripcion.trim() || !this.selectedCita?.id) return;

    const nuevaTarea: TareaServicio = {
      cita_id: this.selectedCita.id,
      descripcion: this.nuevaTareaDescripcion.trim()
    };

    this.tareaService.crearTarea(nuevaTarea).subscribe(res => {
      if (res.success) {
        this.tareasCitaList.push(res.tarea);
        this.nuevaTareaDescripcion = '';
      }
    });
  }

  toggleTareaCompletada(tarea: TareaServicio) {
    if (!tarea.id) return;
    const nuevoEstado = !tarea.completada;
    this.tareaService.actualizarTarea(tarea.id, nuevoEstado).subscribe(res => {
      if (res.success) {
        tarea.completada = nuevoEstado;
      }
    });
  }

  eliminarTarea(tareaId: number) {
    if (!confirm('¿Seguro que deseas eliminar esta tarea?')) return;
    this.tareaService.eliminarTarea(tareaId).subscribe(res => {
      if (res.success) {
        this.tareasCitaList = this.tareasCitaList.filter(t => t.id !== tareaId);
      }
    });
  }

  guardarCambiosCita() {
    if (!this.selectedCita?.id) return;

    if (this.selectedCita.estado !== this.estadoEdicion) {
      this.citaService.actualizarEstadoCita(this.selectedCita.id, this.estadoEdicion).subscribe(res => {
        if (res.success) {
          this.selectedCita!.estado = this.estadoEdicion;
          this.actualizarListasDerivadas();

          // Update calendar event completely so it removes completed items
          this.calendarOptions.events = this.citasActivas.map((c) => {
            return {
              id: c.id?.toString(),
              title: `${c.servicio} - ${c.cliente_nombre || 'Cliente'}`,
              date: c.fecha,
              extendedProps: { ...c }
            } as EventInput;
          });

          this.closeModal();
        }
      });
    } else {
      // Si no cambió el estado, solo cerramos el modal
      this.closeModal();
    }
  }

  // Refrescar qué citas están en los tableros activos
  actualizarListasDerivadas() {
    this.citasActivas = this.citas.filter(c => c.estado !== 'Entregada' && c.estado !== 'Cancelada');
    this.citasCompletadas = this.citas.filter(c => c.estado === 'Entregada');

    // Calcular citas de hoy (solamente de las citas activas)
    const hoy = new Date();
    // Ajuste de formato: YYYY-MM-DD local
    const yyyyStr = hoy.getFullYear();
    const mmStr = String(hoy.getMonth() + 1).padStart(2, '0');
    const ddStr = String(hoy.getDate()).padStart(2, '0');
    const hoyString = `${yyyyStr}-${mmStr}-${ddStr}`;

    this.citasHoy = this.citasActivas.filter(c => c.fecha && c.fecha.startsWith(hoyString));
  }

  closeModal() {
    this.selectedCita = null;
    this.tareasCitaList = [];
    this.nuevaTareaDescripcion = '';
    this.estadoEdicion = 'Pendiente';
  }

  setActiveSection(section: string) {
    this.activeSection = section;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
