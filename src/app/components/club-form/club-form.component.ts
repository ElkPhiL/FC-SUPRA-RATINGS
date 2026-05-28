import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { Club, ClubPayload } from '../../models/club.model';

@Component({
  selector: 'app-club-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './club-form.component.html',
  styleUrls: ['./club-form.component.scss'],
})
export class ClubFormComponent implements OnChanges {
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() club?: Club | null; // Remplacé 'any' par ton interface Club
  @Input() loading = false;
  @Output() submitForm = new EventEmitter<ClubPayload>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      short_name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(4)]],
      slug: [''],
      logo_url: [''],
      city: [''],
      country: [''],
      founded_year: [null],
      // Transformation en sous-groupe pour matcher l'objet JSONB de Supabase
      colors: this.fb.group({
        primary: ['#000000', Validators.required],   // Valeur par défaut : noir
        secondary: ['#ffffff', Validators.required], // Valeur par défaut : blanc
        alternate: ['']                              // Optionnel
      })
    });
  }

  ngOnChanges() {
    if (this.club) {
      // Si le club n'a pas de couleurs enregistrées, on évite le crash au patchValue
      const safeClub = {
        ...this.club,
        colors: this.club.colors || { primary: '#000000', secondary: '#ffffff', alternate: '' }
      };
      this.form.patchValue(safeClub);
    }
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitForm.emit(this.form.value);
  }
}