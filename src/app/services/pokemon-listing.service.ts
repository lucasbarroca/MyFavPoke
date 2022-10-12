import { Injectable } from '@angular/core';
import { Pokemon } from '../types/pokemon';
import { PokemonListItem } from '../types/pokemon-list-item';
import { FavoriteListService } from './favorite-list.service';
import { PokeApiService } from './poke-api.service';

@Injectable({
  providedIn: 'root',
})
export class PokemonListingService {
  constructor(
    private pokeApi: PokeApiService,
    private favList: FavoriteListService
  ) {}

  addPokemon(id: string | number, list: PokemonListItem[]) {
    return new Promise<Boolean>((resolve) => {
      this.loadPokemon(id.toString()).then((pokemon) => {
        list.push(pokemon);
        console.log('Pokemon added to list', pokemon);
        resolve(true);
      });
    });
  }

  addPokemons(ids: string[] | number[], list: PokemonListItem[]) {
    let promises = [];

    ids.forEach((id: string | number) => {
      promises.push(this.loadPokemon(id.toString()));
    });

    return new Promise<Boolean>((resolve) => {
      Promise.all<PokemonListItem[]>(promises).then((pokemons) => {
        pokemons.sort((a, b) => 0 - (a.id < b.id ? 1 : -1));
        list.push(...pokemons);
        console.log('Pokemons added to list', pokemons);
        resolve(true);
      });
    });
  }

  loadPokemon(name: string) {
    let promise = new Promise<PokemonListItem>((resolve) => {
      this.pokeApi
        .getPokemon(name)
        .toPromise()
        .then((data) => {
          let pokemon = {
            id: data.id,
            name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
            imageUrl: this.getImageUrl(data),
            favorite: this.favList.isFavorite(data.id),
          };

          resolve(pokemon);
        });
    });

    return promise;
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
