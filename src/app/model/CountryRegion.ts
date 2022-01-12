import {Region} from './Region';
import {Country} from './Country';
import {City} from './City';

export interface CountryRegion {
  id: number;
  country: Country;
  region: Region;
  city: City;
  createdAt: string;
  updatedAt: string;
}

