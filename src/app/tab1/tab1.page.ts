import { Component, OnInit, ViewChild } from '@angular/core';
import {
  IonInfiniteScroll,
  IonSearchbar,
  ToastController,
  ToastOptions,
} from '@ionic/angular';
import { FavoriteListService } from '../services/favorite-list.service';
import { PokeApiService } from '../services/poke-api.service';
import { PokemonListingService } from '../services/pokemon-listing.service';
import { NamedAPIResourceList } from '../types/named-apiresource-list';
import { PokemonListItem } from '../types/pokemon-list-item';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonSearchbar) ionSearchBar: IonSearchbar;

  constructor(
    private pokeApi: PokeApiService,
    private pokeList: PokemonListingService,
    private favList: FavoriteListService,
    private toastController: ToastController
  ) {}

  showSearch = false;
  nothingFound = false;
  filteredPokemons: NamedAPIResourceList;
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
    this.reload();
  }

  loadPokemons() {
    let maxPages = Math.ceil(
      this.filteredPokemons.results.length / this.itemsPerPage
    );

    if (this.currentPage > maxPages) {
      return;
    }

    let limit = this.itemsPerPage;
    let offset = this.itemsPerPage * (this.currentPage - 1);

    let nextPokes = this.filteredPokemons.results
      .slice(offset, offset + limit)
      .map((p) => p.name);

    this.pokeList.addPokemons(nextPokes, this.pokemons).then(() => {
      this.infiniteScroll.complete();

      if (this.currentPage >= maxPages) {
        this.infiniteScroll.disabled = true;
      } else {
        this.infiniteScroll.disabled = false;
      }

      console.log('Pokemons loaded');
    });
  }

  reload() {
    console.log('Loading pokemons...');

    this.nothingFound = false;
    this.filteredPokemons = null;
    this.pokemons = [];
    this.currentPage = 1;

    this.pokeApi.getFullPokemonsList().subscribe({
      next: (list) => {
        this.filteredPokemons = list;
        this.loadPokemons();
      },
    });
  }

  loadMore(event) {
    this.currentPage++;
    this.loadPokemons();
  }

  toggleFavorite(index: number) {
    let pokemon = this.pokemons[index];

    if (this.favList.isFavorite(pokemon.id)) {
      this.favList.removeFavorite(pokemon.id);
      pokemon.favorite = false;
      this.presentToast({
        message: `${pokemon.name} removido dos favoritos`,
        duration: 1000,
        position: 'top',
      });
    } else {
      this.favList.addFavorite(pokemon.id);
      pokemon.favorite = true;
      this.presentToast({
        message: `${pokemon.name} adicionado aos favoritos`,
        duration: 1000,
        position: 'top',
      });
    }
  }

  toggleSearchBar(event) {
    this.showSearch = !this.showSearch;

    if (!this.showSearch) {
      if (this.ionSearchBar.value.length > 0) {
        this.reload();
      }
    } else {
      this.searchBarFocus();
    }
  }

  async searchBarFocus() {
    setTimeout(() => {
      if (this.ionSearchBar) {
        this.ionSearchBar.setFocus();
      } else {
        this.showSearch = true;
        this.searchBarFocus();
      }
    }, 200);
  }

  async handleSearchChange(event) {
    const query = event.target.value.toLowerCase();
    console.log('Searching for', query);

    if (query.length < 1) {
      this.reload();
      return;
    }

    this.nothingFound = false;
    this.filteredPokemons = null;
    this.pokemons = [];
    this.currentPage = 1;

    this.pokeApi.getFullPokemonsList().subscribe({
      next: (data) => {
        new Promise((resolve) => {
          let results = data.results.filter(
            (p) =>
              p.name.toLowerCase().indexOf(query) > -1 ||
              p.url
                .slice(this.pokeApi.apiUrl.length + 9, p.url.length - 1)
                .indexOf(query) > -1
          );

          resolve({ ...data, results: results });
        }).then((data: NamedAPIResourceList) => {
          console.log('Search results', data);
          if (data.results.length < 1) {
            this.nothingFound = true;
          }

          this.filteredPokemons = data;
          this.loadPokemons();
        });
      },
    });
  }

  async presentToast(options: ToastOptions) {
    const toast = await this.toastController.create(options);

    await toast.present();
  }
}
