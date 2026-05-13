import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { ClienteComponent } from './pages/cliente/cliente.component';
import { AdminComponent } from './pages/admin/admin.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { AuthGuard } from './auth/auth.guard';
import { LoginGuard } from './auth/login.guard';

export const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },
  { path: 'cliente', component: ClienteComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];
