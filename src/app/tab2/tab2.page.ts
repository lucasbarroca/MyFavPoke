import { Component, OnInit, ViewChild } from '@angular/core';
import {
  IonInfiniteScroll,
  ToastController,
  ToastOptions,
} from '@ionic/angular';
import { FavoriteListService } from '../services/favorite-list.service';
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
    private favList: FavoriteListService,
    private toastController: ToastController
  ) {}

  listLoaded = false;
  pokemons: PokemonListItem[] = [];
  favoritesTotal = 0;
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
    this.favoritesTotal = 0;
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

    this.pokeList.addPokemons(nextPokes, this.pokemons).then(() => {
      this.infiniteScroll.complete();

      if (this.currentPage >= maxPages) {
        this.infiniteScroll.disabled = true;
      } else {
        this.infiniteScroll.disabled = false;
      }

      this.favoritesTotal = this.favList.getPokemonsCount();
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
    let pokemon = this.pokemons.splice(index, 1)[0];
    this.favoritesTotal--;

    this.presentToast({
      message: `${pokemon.name} removido dos favoritos`,
      duration: 2000,
      buttons: [
        {
          text: 'Desfazer',
          role: 'undo',
          handler: () => {
            this.favList.addFavorite(id);
            this.pokemons.splice(index, 0, pokemon);
            this.favoritesTotal++;
          },
        },
      ],
    });
  }

  async presentToast(options: ToastOptions) {
    const toast = await this.toastController.create(options);

    await toast.present();
  }
}
