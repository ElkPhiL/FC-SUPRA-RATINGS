import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class SearchBarService {
  private searchTerm: string = '';
  private type: 'players' | 'matches' = 'players';

    setSearchTerm(term: string) {
        this.searchTerm = term;
    }

    setType(type: 'players' | 'matches') {
        this.type = type;
    }
}