import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

@Component({
  selector: 'app-match-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './match-form.component.html',
  styleUrls: ['./match-form.component.scss'],
})
export class MatchFormComponent implements OnChanges {
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() match: any | null = null;

  @Input() competitions: any[] = [];
  @Input() teams: any[] = [];

  @Input() loading = false;

  @Output() submitForm = new EventEmitter<any>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      match_date: [null, Validators.required],

      competition_id: [null],

      home_team_id: [null, Validators.required],
      away_team_id: [null, Validators.required],

      venue: [''],

      home_score: [null],
      away_score: [null],

      home_formation: ['4-3-3'],
      away_formation: ['4-3-3'],

      status: ['scheduled', Validators.required],
    });
  }

  ngOnChanges() {
    if (this.match) {
      this.form.patchValue(this.match);
    }
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitForm.emit(this.form.getRawValue());
  }
}