import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {


  importForm: FormGroup;
  fileToUpload: File | null = null;
  validationResult: any = null;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.importForm = this.fb.group({
      file: [null, Validators.required]
    });
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.fileToUpload = event.target.files[0];
    }
  }

  onSubmit() {
    if (!this.fileToUpload) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const formData = new FormData();
    formData.append('file', this.fileToUpload);

    this.http.post<any>('http://localhost:8080/gestionImpression/examens/import', formData)
      .subscribe({
        next: (result) => {
          this.isLoading = false;
          this.validationResult = result;
          if (result.validExamens.length > 0) {
            this.confirmImport(result.validExamens);
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error.message || "Erreur lors de l'import";
        }
      });
  }

  confirmImport(examens: any[]) {
    this.http.post('http://localhost:8080/gestionImpression/examens/confirm-import', examens)
      .subscribe({
        next: () => {
          alert(`${examens.length} examens importés avec succès!`);
          this.resetForm();
        },
        error: (err) => {
          this.errorMessage = "Erreur lors de la confirmation";
        }
      });
  }

  downloadTemplate() {
    const template = [
      ['matiere', 'dateExamen', 'niveau', 'specialite', 'enseignantEmail'],
      ['Mathématiques', '2025-06-15', '1A', 'Informatique', 'jean.dupont@eni.fr'],
      ['Physique', '2025-06-16', '2A', 'Mécanique', 'marie.durand@eni.fr']
    ].map(e => e.join(',')).join('\n');

    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'modele_import_examens.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  resetForm() {
    this.importForm.reset();
    this.fileToUpload = null;
    this.validationResult = null;
  }
}