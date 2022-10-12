import { Component, OnInit } from '@angular/core';
import { FavoriteListService } from '../services/favorite-list.service';
import { PokeApiService } from '../services/poke-api.service';
import { PokemonListingService } from '../services/pokemon-listing.service';
import { NamedAPIResourceList } from '../types/named-apiresource-list';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  constructor(
    private pokeApi: PokeApiService,
    private pokeList: PokemonListingService,
    private favList: FavoriteListService
  ) {}

  pokemons = this.pokeList.items;
  itemsPerPage = 5;
  currentPage = 1;

  ngOnInit(): void {
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
          data.results.forEach((result) => {
            this.pokeList.addPokemon(result.name);
          });

          console.log('Pokemons loaded');
        },
      });
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
