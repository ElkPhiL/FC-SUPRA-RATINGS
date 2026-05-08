import { Component, Signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../core/services/supabase.service';
import { type User } from '@supabase/supabase-js';
import { computed } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  menuOpen = false;
  user: Signal<User | null>;

  constructor(public supabaseService: SupabaseService) {
    this.user = this.supabaseService.user;
  }

  async logout() {
    await this.supabaseService.signOut();
  }

  username = computed(() => {
    const metadata = this.user()?.user_metadata;
    return metadata?.['username'] || 'Anonyme';
  });

  avatarDisplay = computed(() => this.supabaseService.getAvatarDisplay());
}