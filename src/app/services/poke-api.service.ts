import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, delay, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { NamedAPIResourceList } from '../types/named-apiresource-list';
import { Pokemon } from '../types/pokemon';

@Injectable({
  providedIn: 'root',
})
export class PokeApiService {
  apiUrl = 'https://pokeapi.co/api/v2';

  httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  cachedFullPokemonsList: Observable<NamedAPIResourceList>;
  cachedPokemonsCount: number;

  constructor(private httpClient: HttpClient) {}

  getFullPokemonsList() {
    if (!this.cachedFullPokemonsList) {
      this.cachedFullPokemonsList = this.getPokemonsList(100000);
    }

    return this.cachedFullPokemonsList;
  }

  getPokemonsList(limit: number, offset = 0) {
    return this.get<NamedAPIResourceList>(
      `pokemon?limit=${limit}&offset=${offset}`
    );
  }

  // Id can be either a number or a name
  getPokemon(id: string) {
    return this.get<Pokemon>(`pokemon/${id}`);
  }

  getPokemonsCount() {
    if (!this.cachedPokemonsCount) {
      this.cachedPokemonsCount = 100000;
      this.getPokemonsList(1, 0).subscribe({
        next: (data) => {
          this.cachedPokemonsCount = data.count;
        },
      });
    }

    return this.cachedPokemonsCount;
  }

  get<type>(endpoint): Observable<type> {
    let url = `${this.apiUrl}/${endpoint}`;

    console.log(`[API] GET`, url);

    return this.httpClient.get<type>(url, { headers: this.httpHeaders }).pipe(
      delay(environment.production ? 0 : environment.apiRequestsDelay),
      map((response) => {
        console.log(`[API] GET response`, response);
        return response;
      }),
      retry(2),
      catchError(this.handleError)
    );
  }

  // Handle API errors
  handleError(error) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('[API] An error occurred', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(`[API] Backend returned code ${error.status}`, error.error);
    }

    return throwError(error);
  }
}
