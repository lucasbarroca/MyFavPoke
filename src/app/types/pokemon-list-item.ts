export interface PokemonListItem {
  id: number;
  name: string;
  imageUrl: string;
  favorite: boolean;
  types: string[];
  stats: {
    hp: number;
    attack: number;
    defense: number;
  };
}
