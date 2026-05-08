import { Injectable, computed, signal } from '@angular/core';
import { createClient, type Session, type User } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  supabase = createClient(
    'https://vwvbsqljpmmhdvpodthk.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3dmJzcWxqcG1taGR2cG9kdGhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxOTEyNDgsImV4cCI6MjA5Mzc2NzI0OH0.IiTO3CdS9db8_qnRPVXzJ0vCQsEPIGn3LtUs4BhUjvc'
  );

  session = signal<Session | null>(null);
  user = computed<User | null>(() => this.session()?.user ?? null);

  constructor() {
    this.syncSession();
    this.supabase.auth.onAuthStateChange((_event, session) => {
      this.session.set(session);
    });
  }

  private async syncSession() {
    const { data } = await this.supabase.auth.getSession();
    this.session.set(data.session);
  }

  async signOut() {
    await this.supabase.auth.signOut();
  }
}