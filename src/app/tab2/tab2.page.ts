import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
import { FavoriteListService } from '../services/favorite-list.service';
import { PokeApiService } from '../services/poke-api.service';
import { PokemonListingService } from '../services/pokemon-listing.service';
import { PokemonListItem } from '../types/pokemon-list-item';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  constructor(
    private pokeList: PokemonListingService,
    private favList: FavoriteListService
  ) {}

  listLoaded = false;
  pokemons: PokemonListItem[] = [];
  fakePokemons = [];
  itemsPerPage = 12;
  currentPage = 1;

  ngOnInit(): void {
    console.log('Creating fake pokemons...');
    for (let i = 0; i < this.itemsPerPage; i++) {
      this.fakePokemons.push(i + 1);
    }
  }

  ionViewWillEnter() {
    console.log('Loading pokemons...');
    this.listLoaded = false;
    this.pokemons = [];
    this.currentPage = 1;
    this.loadPokemons();
  }

  loadPokemons() {
    if (this.favList.getPokemonsCount() === 0) {
      this.listLoaded = true;
    }

    let maxPages = Math.ceil(
      this.favList.getPokemonsCount() / this.itemsPerPage
    );

    if (this.currentPage > maxPages) {
      return;
    }

    let nextPokes = this.favList.getPokemonsList(
      this.itemsPerPage,
      this.itemsPerPage * (this.currentPage - 1)
    );

    console.log(nextPokes);

    this.pokeList.addPokemons(nextPokes, this.pokemons).then(() => {
      this.infiniteScroll.complete();

      if (this.currentPage >= maxPages) {
        this.infiniteScroll.disabled = true;
      } else {
        this.infiniteScroll.disabled = false;
      }

      this.listLoaded = true;
      console.log('Pokemons loaded');
    });
  }

  loadMore(event) {
    this.currentPage++;
    this.loadPokemons();
  }

  removeFavorite(id: number, index: number) {
    this.favList.removeFavorite(id);
    this.pokemons.splice(index, 1);
  }
}
