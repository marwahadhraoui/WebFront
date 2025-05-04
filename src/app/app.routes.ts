import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './modules/auth/login/login.component';
import { RegisterComponent } from './modules/auth/register/register.component';
import { ProfileComponent } from './modules/auth/profile/profile.component';
import { ReservationListComponent } from './modules/reservation/reservation-list/reservation-list.component';
import { ScheduleCalendarComponent } from './modules/schedule/schedule-calendar/schedule-calendar.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { SettingsComponent } from './modules/settings/settings.component';
import { NotFoundComponent } from './modules/not-found/not-found.component';
import { SecretaryGuard } from './services/secretary.guard'; 
import { UserGuard } from './services/user.guard';
export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent ,canActivate: [UserGuard]},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'reservations', component: ReservationListComponent ,canActivate: [UserGuard]},
  { path: 'calendar', component: ScheduleCalendarComponent ,canActivate: [UserGuard]},
  { path: 'dashboard', component: DashboardComponent ,canActivate: [SecretaryGuard] },
  { path: 'settings', component: SettingsComponent,canActivate: [UserGuard] },
  { path: '**', component: NotFoundComponent } // Page 404
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
