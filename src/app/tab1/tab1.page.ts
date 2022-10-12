import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
import { FavoriteListService } from '../services/favorite-list.service';
import { PokeApiService } from '../services/poke-api.service';
import { PokemonListingService } from '../services/pokemon-listing.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  constructor(
    private pokeApi: PokeApiService,
    private pokeList: PokemonListingService,
    private favList: FavoriteListService
  ) {}

  pokemons = this.pokeList.items;
  fakePokemons = [];
  itemsPerPage = 12;
  currentPage = 1;

  ngOnInit(): void {
    console.log('Creating fake pokemons...');
    for (let i = 0; i < this.itemsPerPage; i++) {
      this.fakePokemons.push(i + 1);
    }

    console.log('Loading pokemons...');
    this.loadPokemons();
  }

  loadPokemons() {
    this.pokeApi
      .getPokemonsList(
        this.itemsPerPage,
        this.itemsPerPage * (this.currentPage - 1)
      )
      .subscribe({
        next: (data) => {
          let nextPokes = data.results.map((p) => p.name);
          this.pokeList.addPokemons(nextPokes).then(() => {
            this.infiniteScroll.complete();
            this.infiniteScroll.disabled = false;
            console.log('Pokemons loaded');
          });
        },
      });
  }

  loadMore(event) {
    let maxPages = Math.ceil(
      this.pokeApi.getPokemonsCount() / this.itemsPerPage
    );

    if (this.currentPage >= maxPages) {
      return;
    }

    this.currentPage++;
    this.loadPokemons();

    if (this.currentPage >= maxPages) {
      event.target.disabled = true;
    }
  }

  toggleFavorite(index: number) {
    let pokemon = this.pokeList.items[index];

    if (this.favList.isFavorite(pokemon.id)) {
      this.favList.removeFavorite(pokemon.id);
      pokemon.favorite = false;
    } else {
      this.favList.addFavorite(pokemon.id);
      pokemon.favorite = true;
    }
  }
}
