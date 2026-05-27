import {
  Component,
  computed,
  inject,
  Input
} from '@angular/core';
import { PlayerRatingsService } from '../../services/player-ratings.service';
import { RatingSliderComponent } from '../rating-slider/rating-slider.component';
import { MatchPlayerWithPlayer } from '../../models/match-players.model';

@Component({
  selector: 'app-player-rating-card',
  standalone: true,
  imports: [RatingSliderComponent],
  templateUrl: './player-rating-card.component.html',
  styleUrls: ['./player-rating-card.component.scss']
})
export class PlayerRatingCardComponent {

  ratingsService =
    inject(PlayerRatingsService);

  @Input() matchPlayer!: MatchPlayerWithPlayer;

  averageRating = computed(() =>
    this.ratingsService.getAverageRating(
      this.matchPlayer.id
    )
  );

  voteCount = computed(() =>
    this.ratingsService.getRatingCount(
      this.matchPlayer.id
    )
  );

  userRating = computed(() =>
    this.ratingsService.getUserRating(
      this.matchPlayer.id,
    )
  );

  async onRate(value: number) {

    await this.ratingsService.ratePlayer(
      this.matchPlayer.id,
      value
    );
  }

}