import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, delay, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PokeApiService {
  apiUrl = 'https://pokeapi.co/api/v2';

  httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private httpClient: HttpClient) {}

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
