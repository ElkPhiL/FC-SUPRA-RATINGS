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

  constructor(private supabaseService: SupabaseService) {
    this.user = this.supabaseService.user;
  }

  async signOut() {
    await this.supabaseService.signOut();
    this.message = 'Déconnecté.';
  }

  username = computed(() => {
    const metadata = this.user()?.user_metadata;
    return metadata?.['username'] || 'Anonyme';
  });
}
