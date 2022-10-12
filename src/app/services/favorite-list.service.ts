import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FavoriteListService {
  public items: number[];

  constructor() {}

  addFavorite(id: number) {
    if (!this.items) {
      this.loadList();
    }

    this.items.push(id);
    this.saveList();
  }

  removeFavorite(id: number) {
    if (!this.items) {
      this.loadList();
    }

    this.items = this.items.filter((i) => i != id);
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
}
