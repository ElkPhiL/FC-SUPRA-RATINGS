import {
  Component,
  input,
  output,
  signal
} from '@angular/core';

@Component({
  selector: 'app-rating-slider',
  standalone: true,
  templateUrl: './rating-slider.component.html',
  styleUrls: ['./rating-slider.component.scss']
})
export class RatingSliderComponent {

  value = input(0);

  valueChange = output<number>();

  hoverValue = signal<number | null>(null);

  ratings = [1,2,3,4,5,6,7,8,9,10];

  setRating(value: number) {
    this.valueChange.emit(value);
  }

}