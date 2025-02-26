import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

 
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './modules/auth/login/login.component';
import { RegisterComponent } from './modules/auth/register/register.component';
import { ProfileComponent } from './modules/auth/profile/profile.component';
import { ReservationListComponent } from './modules/reservation/reservation-list/reservation-list.component';
import { ReservationFormComponent } from './modules/reservation/reservation-form/reservation-form.component';
import { ReservationDetailsComponent } from './modules/reservation/reservation-details/reservation-details.component';
import { ScheduleManagementComponent } from './modules/schedule/schedule-management/schedule-management.component';
import { ScheduleCalendarComponent } from './modules/schedule/schedule-calendar/schedule-calendar.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { SettingsComponent } from './modules/settings/settings.component';
import { NotFoundComponent } from './modules/not-found/not-found.component';  

export const routes: Routes = [
  { path: '', component: HomeComponent },  
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent },
  
 
  { path: 'reservations', component: ReservationListComponent },
  { path: 'reservations/new', component: ReservationFormComponent },
  { path: 'reservations/:id', component: ReservationDetailsComponent },  
  
   
  { path: 'schedule', component: ScheduleManagementComponent },
  { path: 'calendar', component: ScheduleCalendarComponent },
  
 
  { path: 'dashboard', component: DashboardComponent },

 
  { path: 'settings', component: SettingsComponent },

   
  { path: '**', component: NotFoundComponent } // Page 404
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
