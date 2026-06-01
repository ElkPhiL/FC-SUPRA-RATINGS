import { Component, EventEmitter, Input, Output, OnChanges, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { Competition, CompetitionPayload } from '../../models/competition.model';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-competition-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './competition-form.component.html',
  styleUrls: ['./competition-form.component.scss'],
})
export class CompetitionFormComponent implements OnChanges {
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() competition?: Competition | null;
  @Input() loading = false;
  @Output() submitForm = new EventEmitter<CompetitionPayload>();

  form: FormGroup;
  uploading = signal(false); // État visuel pendant l'envoi du logo

  constructor(
    private fb: FormBuilder,
    private supabaseService: SupabaseService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      slug: [''],
      logo_url: [''], // Garde la valeur de l'URL finale pour la DB
      country: [''],
      level: ['']
    });
  }

  ngOnChanges() {
    if (this.competition) {
      this.form.patchValue(this.competition);
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
      const publicUrl = await this.supabaseService.uploadCompetitionLogo(file);
      
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