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
  @Input() match?: any | null;
  @Input() loading = false;
  @Output() submitForm = new EventEmitter<any>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      match_date: [null, Validators.required],
      opponent: ['', Validators.required],
      competition: ['CPL'],
      home_away: ['home'],
      venue: ['Stade Boréale'],
      fc_supra_score: [null, Validators.min(0)],
      opponent_score: [null, Validators.min(0)],
      status: ['scheduled'],
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

    this.submitForm.emit(this.form.value);
  }
}