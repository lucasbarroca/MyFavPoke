import { NamedAPIResource } from './named-apiresource';

export interface NamedAPIResourceList {
  count: number;
  next: string;
  previous: string;
  results: NamedAPIResource[];
}
