import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [
    CommonModule,
    FormsModule
  ],
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginObj = {
    email: 'modou@gmail.com',
    password: 'modou'
  };
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) { }

  login() {
    if (!this.loginObj.email || !this.loginObj.password) {
      this.errorMessage = 'Veuillez remplir tous les champs.';
      alert(this.errorMessage);
      return;
    }

    this.errorMessage = '';

    this.authService.login(this.loginObj.email, this.loginObj.password).subscribe(
      (user) => {
        this.authService.saveUser(user);
        switch (user.role) {
          case 'SECRETAIRE':
            this.router.navigateByUrl('/home');
            break;
          case 'ADMIN':
            this.router.navigateByUrl('/admin-dashboard');
            break;
          default:
            this.errorMessage = 'Rôle inconnu';
            alert(this.errorMessage);
        }
      },
      (error) => {
        this.errorMessage = 'Identifiants incorrects ou problème de connexion.';
        alert(this.errorMessage);
      }
    );
  }
}
