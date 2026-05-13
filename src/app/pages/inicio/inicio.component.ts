import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/navbar/navbar.component';

@Component({
  selector: 'app-inicio',
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export class InicioComponent {
  
  servicios = [
    {
      icon: 'fa-oil-can',
      title: 'Cambio de Aceite',
      description: 'Servicio completo de cambio de aceite y filtros para mantener tu motor en óptimas condiciones.'
    },
    {
      icon: 'fa-car-battery',
      title: 'Sistema Eléctrico',
      description: 'Diagnóstico y reparación de sistemas eléctricos, baterías y alternadores.'
    },
    {
      icon: 'fa-cog',
      title: 'Mantenimiento General',
      description: 'Revisión completa de tu vehículo para prevenir problemas futuros.'
    },
    {
      icon: 'fa-tire',
      title: 'Frenos y Suspensión',
      description: 'Reparación y mantenimiento de sistemas de frenos y suspensión.'
    },
    {
      icon: 'fa-wrench',
      title: 'Reparación de Motor',
      description: 'Diagnóstico y reparación especializada de motores de todo tipo.'
    },
    {
      icon: 'fa-car-crash',
      title: 'Servicio de Emergencia',
      description: 'Atención inmediata para emergencias mecánicas las 24 horas.'
    }
  ];

  testimonios = [
    {
      name: 'Carlos Rodríguez',
      rating: 5,
      comment: 'Excelente servicio, muy profesionales y rápidos. Mi auto quedó como nuevo.',
      avatar: 'fa-user'
    },
    {
      name: 'María González',
      rating: 5,
      comment: 'Muy confiables, siempre traigo mi vehículo aquí. Precios justos y trabajo de calidad.',
      avatar: 'fa-user'
    },
    {
      name: 'Juan Pérez',
      rating: 5,
      comment: 'El mejor taller de la zona. Atención personalizada y resultados garantizados.',
      avatar: 'fa-user'
    }
  ];

  constructor(private router: Router) {}

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
