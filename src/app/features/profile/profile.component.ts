import { Component, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SupabaseService } from '../../core/services/supabase.service';
import { type User } from '@supabase/supabase-js';
import { computed } from '@angular/core';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})

export class ProfileComponent {
  user: Signal<User | null>;
  message = '';
  selectedFile: File | null = null;

  constructor(public supabaseService: SupabaseService) {
    this.user = this.supabaseService.user;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
    }
  }

  async uploadAvatar() {
    if (!this.selectedFile) {
      this.message = 'Veuillez sélectionner une image.';
      return;
    }

    const avatarUrl = await this.supabaseService.uploadProfileImage(this.selectedFile);
    if (avatarUrl) {
      this.message = 'Image de profil mise à jour avec succès.';
      this.selectedFile = null;
    } else {
      this.message = 'Erreur lors de l\'upload de l\'image.';
    }
  }

  async signOut() {
    await this.supabaseService.signOut();
    this.message = 'Déconnecté.';
  }

  username = computed(() => {
    const metadata = this.user()?.user_metadata;
    return metadata?.['username'] || 'Anonyme';
  });

  avatarDisplay = computed(() => this.supabaseService.getAvatarDisplay());
}
