import { TestBed } from '@angular/core/testing';

import { PokemonListingService } from './pokemon-listing.service';

describe('PokemonListingService', () => {
  let service: PokemonListingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PokemonListingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
