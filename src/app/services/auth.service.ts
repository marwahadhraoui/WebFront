import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/gestionImpression/users/login';

  private apiUrl1 = 'http://localhost:8080/gestionImpression/users';

  constructor(private http: HttpClient, private router: Router) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { email, password });
  }

  logout(): void {
    localStorage.removeItem('user');
    this.router.navigateByUrl('/login');
  }

  saveUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) as User : null;
  }

  isAuthenticated(): boolean {
    return !!this.getUser();
  }

  hasRole(requiredRole: string): boolean {
    const user = this.getUser();
    return user ? user.role === requiredRole : false;
  }

  getCurrentRole(): string | null {
    const user = this.getUser();
    return user ? user.role : null;
  } 

  
  register(userData: User): Observable<any> {
    return this.http.post<any>(this.apiUrl1, userData);  
}
}