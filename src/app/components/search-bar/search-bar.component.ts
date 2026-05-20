import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { SearchBarService } from '../../services/search-bar.service';

@Component({
    selector: 'app-search-bar',
    imports: [CommonModule],
    templateUrl: './search-bar.component.html',
    styleUrl: './search-bar.component.scss',
})

export class SearchBarComponent implements OnInit {
    private readonly searchBarService = inject(SearchBarService);
    @Input() type: 'players' | 'matches' = 'players';

    public placeholder = '';
    private searchTerm: string = '';

     onSearchTermChange() {
        this.searchBarService.setSearchTerm(this.searchTerm);
    }

    ngOnInit() {
        this.searchBarService.setType(this.type);     
        this.placeholder = this.type === 'players' ? 'Rechercher un joueur...' : 'Rechercher un match...';
    }
}