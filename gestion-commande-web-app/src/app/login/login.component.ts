import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PlatformLocation } from '@angular/common';
import { ActivatedRoute } from '@angular/router'; // Add this import

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  passwordChangeForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private snackBar: MatSnackBar,
    private platformLocation: PlatformLocation,
    private route: ActivatedRoute // Inject ActivatedRoute
  ) {
    this.loginForm = fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
    });

    this.passwordChangeForm = fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]]
    }, {
      validator: this.passwordMatchValidator
    });
  }

  isBrowser(): boolean {
    return typeof window !== 'undefined' && this.platformLocation !== null;
  }

  ngOnInit(): void {
    if (this.isBrowser()) {
      // Check if user is logged in
      const isLoggedIn = !!sessionStorage.getItem('id');
      const id = sessionStorage.getItem('id');
      const isAdmin = sessionStorage.getItem('isAdmin');

      if (isLoggedIn) {
        const defaultRoute = isAdmin === "true" ? '/prof-admin' : '/prof-dash';
        this.router.navigate([defaultRoute]);
      }
    }
  }

  onSubmit(): void {
    let userId = null;
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.loginService.login(email, password).subscribe(
        (response) => {
          if (response) {
            console.log('Login response:', response);
            this.openErrorSnackBar(response);
            if (response === 'Utilisateur connecté pour la première fois') {
              this.loginService.getUserIdByEmail(email).subscribe(
                (professor: any) => {
                  const userId = professor && professor.id;
                  if (userId != null) {
                    this.router.navigate(['/change-password', { userId: userId }]);
                  } else {
                    console.error('Professeur introuvable', professor);
                    this.openErrorSnackBar("Professeur introuvable");
                  }
                },
                (error) => {
                  console.error('Error fetching user ID:', error);
                  this.openErrorSnackBar("Professeur introuvable");
                }
              );
            }  else if(response === 'Connexion admin réussie'){
              this.loginService.getUserIdByEmail(email).subscribe(
                (professor: any) => {
                  const userId = professor && professor.id;
                  const userIsAdmin = professor && professor.admin;
                  if (userId != null) {
                    sessionStorage.setItem('id', JSON.stringify(userId));
                    sessionStorage.setItem('isAdmin', JSON.stringify(userIsAdmin));
                    this.router.navigate(['/prof-admin']);
                  } else {
                    console.error('Professeur introuvable', professor);
                    this.openErrorSnackBar("Professeur introuvable");
                  }
                },
                (error) => {
                  console.error('Error fetching user ID:', error);
                  this.openErrorSnackBar("Professeur introuvable");
                }
              );

            }else if (response === 'Connexion réussie') {
              console.log("Login successful hnaya hh")
              this.loginService.getUserIdByEmail(email).subscribe(
                (professor: any) => {
                  console.log("professor",professor)
                  const userId = professor && professor.id;
                  const userIsAdmin = professor && professor.admin;
                  if (userId != null) {
                    sessionStorage.setItem('id', JSON.stringify(userId));
                    sessionStorage.setItem('isAdmin', JSON.stringify(userIsAdmin));
                    this.router.navigate(['/prof-dash']);
                  } else {
                    console.error('User ID not found for professor:', professor);
                    this.openErrorSnackBar("Professeur introuvable");
                  }
                },
                (error) => {
                  console.error('Error fetching user ID:', error);
                  this.openErrorSnackBar("Professeur introuvable");
                }
              );
            } else {
              console.log(response);
            }
          }
        },
        (error) => {
          console.error('Login error:', error);
          this.openErrorSnackBar("An unexpected error occurred");
        }
      );
    }
  }

  onPasswordChangeSubmit(): void {
    if (this.passwordChangeForm.valid) {
      const newPassword = this.passwordChangeForm.value.newPassword;
      const userId = this.route.snapshot.params['userId'];
      const updatedProfessor = { mdp: newPassword };

      this.loginService.updatePassword(userId, updatedProfessor).subscribe(
        (response) => {
          console.log('Password updated successfully:', response);
          this.snackBar.open('Le mot de passe est mit à jour avec succès', 'Close', {
            duration: 3000,
          });
          // Redirect the user to the dashboard or any other desired location
          this.router.navigate(['/prof-dash']);
        },
        (error) => {
          console.error('Error updating password:', error);
          this.snackBar.open('Error updating password. Please try again.', 'Close', {
            duration: 3000,
          });
        }
      );
    }
  }

  openErrorSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000, // Adjust duration as needed
      horizontalPosition: 'start',
      verticalPosition: 'top',
      panelClass: ['error-snackbar'] // Add custom styling if needed
    });
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const newPasswordControl = formGroup.get('newPassword');
    const confirmPasswordControl = formGroup.get('confirmPassword');

    if (newPasswordControl && confirmPasswordControl && newPasswordControl.value !== confirmPasswordControl.value) {
      confirmPasswordControl.setErrors({ passwordMismatch: true });
    } else {
      confirmPasswordControl?.setErrors(null);
    }
  }
}
