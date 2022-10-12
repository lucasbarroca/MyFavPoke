import { Injectable } from '@angular/core';
import { Pokemon } from '../types/pokemon';
import { PokemonListItem } from '../types/pokemon-list-item';
import { FavoriteListService } from './favorite-list.service';
import { PokeApiService } from './poke-api.service';

@Injectable({
  providedIn: 'root',
})
export class PokemonListingService {
  public items: PokemonListItem[] = [];

  constructor(
    private pokeApi: PokeApiService,
    private favList: FavoriteListService
  ) {}

  getItems() {
    return this.items;
  }

  addPokemon(name: string) {
    this.pokeApi.getPokemon(name).subscribe({
      next: (data) => {
        let pokemon = {
          id: data.id,
          name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
          imageUrl: this.getImageUrl(data),
          favorite: this.favList.isFavorite(data.id),
        };

        this.items.push(pokemon);

        console.log('Pokemon added to list', pokemon);
      },
    });
  }

  addPokemons(names: string[]) {
    names.forEach((name) => {
      this.addPokemon(name);
    });
  }

  private getImageUrl(pokemon: Pokemon) {
    return (
      pokemon.sprites.other?.dream_world?.front_default ||
      pokemon.sprites.other?.home?.front_default ||
      pokemon.sprites.other?.['official-artwork']?.front_default ||
      pokemon.sprites.front_default
    );
  }
}
