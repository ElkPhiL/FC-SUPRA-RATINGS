import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../core/services/supabase.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  confirmPassword = '';
  message = '';

  constructor(private supabaseService: SupabaseService) {}

  async register() {
    const username = this.username.trim();
    const email = this.email.trim().toLowerCase();

    if (!username) {
      this.message = 'Le nom d’utilisateur est requis.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.message = 'Les mots de passe ne correspondent pas.';
      return;
    }

    if (!email || !this.password) {
      this.message = 'Email, nom d’utilisateur et mot de passe sont requis.';
      return;
    }

    if (!this.isValidEmail(email)) {
      this.message = 'Format d’email invalide.';
      return;
    }

    const { data, error } = await this.supabaseService.supabase.auth.signUp({
      email,
      password: this.password,
      options: {
        data: {
          username,
        },
      },
    });

    if (!error) {
      console.log('registered', data);
      this.message = 'Inscription réussie. Vérifie ton email pour confirmer.';
    } else {
      console.error('Supabase register error', error);
      this.message = error.message || 'Erreur lors de l’inscription.';
    }
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
