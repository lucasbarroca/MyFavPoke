import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FavoriteListService {
  items: number[];

  constructor() {}

  addFavorite(id: number) {
    if (!this.items) {
      this.loadList();
    }

    this.items.push(id);
    this.items.sort((a, b) => a - b);
    this.saveList();
  }

  removeFavorite(id: number) {
    if (!this.items) {
      this.loadList();
    }

    this.items = this.items.filter((i) => i != id);
    this.items.sort((a, b) => a - b);
    this.saveList();
  }

  saveList() {
    localStorage.setItem('favorites', JSON.stringify(this.items));
    console.log('Favorites list saved');
  }

  loadList() {
    let data = localStorage.getItem('favorites');

    if (data) {
      this.items = JSON.parse(data);
    } else {
      this.items = [];
    }

    console.log('Favorites list loaded');
  }

  isFavorite(id: number) {
    if (!this.items) {
      this.loadList();
    }

    return this.items.includes(id);
  }

  getPokemonsList(limit: number, offset = 0) {
    if (!this.items) {
      this.loadList();
    }

    return this.items.slice(offset, offset + limit);
  }

  getPokemonsCount() {
    if (!this.items) {
      this.loadList();
    }

    return this.items.length;
  }
}
