import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../core/services/supabase.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  email = '';
  password = '';
  message = '';

  constructor(private supabaseService: SupabaseService) {}

  async login() {
    const email = this.email.trim().toLowerCase();

    if (!email || !this.password) {
      this.message = 'Email et mot de passe sont requis.';
      return;
    }

    const { error } = await this.supabaseService.supabase.auth.signInWithPassword({
      email,
      password: this.password,
    });

    if (!error) {
      console.log('connected');
      this.message = 'Connecté avec succès.';
    } else {
      console.error('Supabase login error', error);
      this.message = error.message || 'Échec de la connexion.';
    }
  }
}
