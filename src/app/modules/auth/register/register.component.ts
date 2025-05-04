
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { passwordMatchValidator } from '../../../services/password-match.validator';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
   imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule
    ],
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      role: ['', Validators.required],
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: passwordMatchValidator });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }
  
    this.isLoading = true;
    this.errorMessage = null;
  
    // Récupération des valeurs du formulaire
    const formData = this.registerForm.value;
  
    // Création de l'objet user à envoyer au backend
    const userData = {
      role: formData.role,
      nom: formData.nom,
      prenom: formData.prenom,
      email: formData.email,
      mdp: formData.password, // Utilisez 'mdp' au lieu de 'password' si c'est le nom attendu par le backend
      // Ajoutez d'autres champs si nécessaire
    };
  
    this.authService.register(userData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.router.navigate(['/login'], { 
          queryParams: { registered: 'true' } 
        });
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error.message || 'Une erreur est survenue lors de la création du compte';
        console.error('Registration error:', err);
      }
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.registerForm.controls;
  }
}
