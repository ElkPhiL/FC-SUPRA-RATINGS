import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  email = '';
  password = '';
  message = '';
  messageType: 'success' | 'error' | 'info' = 'info';
  isLoading = false;
  fieldErrors: { [key: string]: string } = {};

  constructor(private supabaseService: SupabaseService) {}

  // Validation en temps réel des champs
  validateField(field: string, value: string) {
    this.fieldErrors[field] = '';

    switch (field) {
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
        } else if (value.length < 6) {
          this.fieldErrors[field] = 'Le mot de passe doit contenir au moins 6 caractères';
        }
        break;
    }
  }

  onEmailChange() {
    this.validateField('email', this.email);
  }

  onPasswordChange() {
    this.validateField('password', this.password);
  }

  async login() {
    // Reset des erreurs
    this.fieldErrors = {};
    this.message = '';
    this.isLoading = true;

    const email = this.email.trim().toLowerCase();
    const password = this.password;

    // Validation côté client
    this.validateField('email', email);
    this.validateField('password', password);

    // Vérifier s'il y a des erreurs de validation
    if (Object.values(this.fieldErrors).some(error => error)) {
      this.isLoading = false;
      this.message = 'Veuillez corriger les erreurs ci-dessus';
      this.messageType = 'error';
      return;
    }

    try {
      const { data, error } = await this.supabaseService.supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Supabase login error:', error);
        this.handleLoginError(error);
      } else if (data.user) {
        console.log('Login successful:', data.user.email);
        this.message = 'Connexion réussie ! Redirection en cours...';
        this.messageType = 'success';

        // Redirection automatique après connexion réussie
        setTimeout(() => {
          // Le router guard ou la logique de redirection s'occupera de ça
        }, 1000);
      } else {
        this.message = 'Erreur inattendue lors de la connexion';
        this.messageType = 'error';
      }
    } catch (error) {
      console.error('Unexpected login error:', error);
      this.message = 'Erreur de connexion. Vérifiez votre connexion internet.';
      this.messageType = 'error';
    } finally {
      this.isLoading = false;
    }
  }

  private handleLoginError(error: any) {
    this.messageType = 'error';

    switch (error.message) {
      case 'Invalid login credentials':
        this.message = 'Email ou mot de passe incorrect. Vérifiez vos identifiants.';
        break;
      case 'Email not confirmed':
        this.message = 'Votre email n\'est pas confirmé. Vérifiez votre boîte mail.';
        break;
      case 'Too many requests':
        this.message = 'Trop de tentatives. Veuillez patienter quelques minutes.';
        break;
      case 'User not found':
        this.message = 'Aucun compte trouvé avec cet email.';
        break;
      default:
        this.message = `Erreur de connexion: ${error.message}`;
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Getter pour vérifier si le formulaire est valide
  get isFormValid(): boolean {
    return !!(this.email.trim() && this.password && this.password.length >= 6 &&
              !Object.values(this.fieldErrors).some(error => error));
  }
}
