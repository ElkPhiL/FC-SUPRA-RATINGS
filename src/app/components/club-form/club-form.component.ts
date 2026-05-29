import { Component, EventEmitter, Input, Output, OnChanges, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { Club, ClubPayload } from '../../models/club.model';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-club-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './club-form.component.html',
  styleUrls: ['./club-form.component.scss'],
})
export class ClubFormComponent implements OnChanges {
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() club?: Club | null;
  @Input() loading = false;
  @Output() submitForm = new EventEmitter<ClubPayload>();

  form: FormGroup;
  uploading = signal(false); // État visuel pendant l'envoi du logo

  constructor(
    private fb: FormBuilder,
    private supabaseService: SupabaseService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      short_name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(4)]],
      slug: [''],
      logo_url: [''], // Garde la valeur de l'URL finale pour la DB
      city: [''],
      country: [''],
      founded_year: [null],
      colors: this.fb.group({
        primary: ['#000000', Validators.required],
        secondary: ['#ffffff', Validators.required],
        alternate: ['']
      })
    });
  }

  ngOnChanges() {
    if (this.club) {
      const safeClub = {
        ...this.club,
        colors: this.club.colors || { primary: '#000000', secondary: '#ffffff', alternate: '' }
      };
      this.form.patchValue(safeClub);
    }
  }

  // Permet de lire la valeur actuelle du logo pour la prévisualisation HTML
  get currentLogoUrl(): string {
    return this.form.get('logo_url')?.value;
  }

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    try {
      this.uploading.set(true);
      
      // Envoi sur Supabase Storage
      const publicUrl = await this.supabaseService.uploadClubLogo(file);
      
      // Assigne l'URL publique générée au contrôle de formulaire réactif
      this.form.get('logo_url')?.setValue(publicUrl);
      this.form.get('logo_url')?.markAsDirty();

    } catch (error) {
      alert("Erreur lors du téléversement de l'image.");
    } finally {
      this.uploading.set(false);
    }
  }

  submit() {
    if (this.form.invalid || this.uploading()) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitForm.emit(this.form.value);
  }
}