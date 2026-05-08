import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../core/services/supabase.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  confirmPassword = '';
  selectedFile: File | null = null;
  message = '';
  messageType: 'success' | 'error' | 'info' = 'info';
  isLoading = false;
  fieldErrors: { [key: string]: string } = {};

  constructor(private supabaseService: SupabaseService) {}

  // Validation en temps réel des champs
  validateField(field: string, value: string) {
    this.fieldErrors[field] = '';

    switch (field) {
      case 'username':
        if (!value.trim()) {
          this.fieldErrors[field] = 'Le nom d\'utilisateur est requis';
        } else if (value.trim().length < 3) {
          this.fieldErrors[field] = 'Le nom d\'utilisateur doit contenir au moins 3 caractères';
        } else if (value.trim().length > 20) {
          this.fieldErrors[field] = 'Le nom d\'utilisateur ne peut pas dépasser 20 caractères';
        } else if (!/^[a-zA-Z0-9_-]+$/.test(value.trim())) {
          this.fieldErrors[field] = 'Le nom d\'utilisateur ne peut contenir que des lettres, chiffres, _ et -';
        }
        break;
      case 'email':
        if (!value.trim()) {
          this.fieldErrors[field] = 'L\'email est requis';
        } else if (!this.isValidEmail(value.trim())) {
          this.fieldErrors[field] = 'Format d\'email invalide';
        }
        break;
      case 'password':
        if (!value) {
          this.fieldErrors[field] = 'Le mot de passe est requis';
        } else if (value.length < 8) {
          this.fieldErrors[field] = 'Le mot de passe doit contenir au moins 8 caractères';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          this.fieldErrors[field] = 'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre';
        }
        break;
      case 'confirmPassword':
        if (!value) {
          this.fieldErrors[field] = 'La confirmation du mot de passe est requise';
        } else if (value !== this.password) {
          this.fieldErrors[field] = 'Les mots de passe ne correspondent pas';
        }
        break;
    }
  }

  onUsernameChange() {
    this.validateField('username', this.username);
  }

  onEmailChange() {
    this.validateField('email', this.email);
  }

  onPasswordChange() {
    this.validateField('password', this.password);
    // Re-valider la confirmation si elle existe
    if (this.confirmPassword) {
      this.validateField('confirmPassword', this.confirmPassword);
    }
  }

  onConfirmPasswordChange() {
    this.validateField('confirmPassword', this.confirmPassword);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Validation du fichier
      if (!this.isValidImageFile(file)) {
        this.message = 'Format de fichier non supporté. Utilisez JPG, PNG ou GIF.';
        this.messageType = 'error';
        this.selectedFile = null;
        input.value = ''; // Reset l'input
        return;
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB
        this.message = 'L\'image ne peut pas dépasser 5MB.';
        this.messageType = 'error';
        this.selectedFile = null;
        input.value = '';
        return;
      }

      this.selectedFile = file;
      this.message = '';
    }
  }

  async register() {
    // Reset des erreurs
    this.fieldErrors = {};
    this.message = '';
    this.isLoading = true;

    const username = this.username.trim();
    const email = this.email.trim().toLowerCase();
    const password = this.password;

    // Validation de tous les champs
    this.validateField('username', username);
    this.validateField('email', email);
    this.validateField('password', password);
    this.validateField('confirmPassword', this.confirmPassword);

    // Vérifier s'il y a des erreurs de validation
    if (Object.values(this.fieldErrors).some(error => error)) {
      this.isLoading = false;
      this.message = 'Veuillez corriger les erreurs ci-dessus';
      this.messageType = 'error';
      return;
    }

    try {
      const { data, error } = await this.supabaseService.supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });

      if (error) {
        console.error('Supabase register error:', error);
        this.handleRegisterError(error);
      } else if (data.user) {
        console.log('Registration successful:', data.user.email);

        // Upload avatar if selected
        if (this.selectedFile) {
          try {
            const avatarUrl = await this.supabaseService.uploadProfileImage(this.selectedFile);
            if (avatarUrl) {
              console.log('Avatar uploaded successfully:', avatarUrl);
            } else {
              console.warn('Avatar upload failed, but registration succeeded');
            }
          } catch (avatarError) {
            console.error('Avatar upload error:', avatarError);
            // Ne pas échouer l'inscription pour un problème d'avatar
          }
        }

        this.message = 'Inscription réussie ! Vérifiez votre email pour confirmer votre compte.';
        this.messageType = 'success';

        // Reset form
        this.resetForm();
      } else {
        this.message = 'Erreur inattendue lors de l\'inscription';
        this.messageType = 'error';
      }
    } catch (error) {
      console.error('Unexpected register error:', error);
      this.message = 'Erreur de connexion. Vérifiez votre connexion internet.';
      this.messageType = 'error';
    } finally {
      this.isLoading = false;
    }
  }

  private handleRegisterError(error: any) {
    this.messageType = 'error';

    switch (error.message) {
      case 'User already registered':
        this.message = 'Un compte existe déjà avec cet email.';
        this.fieldErrors['email'] = 'Email déjà utilisé';
        break;
      case 'Password should be at least 6 characters':
        this.message = 'Le mot de passe doit contenir au moins 6 caractères.';
        this.fieldErrors['password'] = 'Mot de passe trop court';
        break;
      case 'Unable to validate email address: invalid format':
        this.message = 'Format d\'email invalide.';
        this.fieldErrors['email'] = 'Format invalide';
        break;
      case 'Signup is disabled':
        this.message = 'Les inscriptions sont temporairement désactivées.';
        break;
      case 'Too many requests':
        this.message = 'Trop de tentatives. Veuillez patienter quelques minutes.';
        break;
      default:
        this.message = `Erreur lors de l'inscription: ${error.message}`;
    }
  }

  private resetForm() {
    this.username = '';
    this.email = '';
    this.password = '';
    this.confirmPassword = '';
    this.selectedFile = null;
    this.fieldErrors = {};
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidImageFile(file: File): boolean {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    return allowedTypes.includes(file.type);
  }

  // Getters pour la validation du formulaire
  get isFormValid(): boolean {
    return !!(this.username.trim() && this.email.trim() && this.password &&
              this.confirmPassword && this.password === this.confirmPassword &&
              !Object.values(this.fieldErrors).some(error => error));
  }

  get passwordStrength(): 'weak' | 'medium' | 'strong' {
    const password = this.password;
    if (password.length < 8) return 'weak';
    if (password.length >= 12 && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(password)) return 'strong';
    if (/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) return 'medium';
    return 'weak';
  }
}
