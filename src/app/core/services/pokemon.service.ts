import { Injectable } from '@angular/core';
import { distinctUntilChanged, forkJoin, map, Observable, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PokemonListDto } from '../dtos/pokemon-list-dto';
import { PokemonDto } from '../dtos/pokemon-dto';
import { Pokemon } from '../models/pokemon.model';

@Injectable()
export class PokemonService {

  private readonly apiBaseUrl: string = "https://pokeapi.co/api/v2/pokemon/";

  constructor(
    private httpClient: HttpClient
  ) { }

  private DtoToModel(dto: PokemonDto): Pokemon {
    const types: string = dto.types.map((type) => type.type.name).join(", ");
    const abilities: {name: string, isHidden: boolean, slotNumber: number}[] = dto.abilities.map(
      (ability) => ({name: ability.ability.name, isHidden: ability.is_hidden, slotNumber: ability.slot}));
    const stats: {name: string, base: number, effort: number}[] = dto.stats.map(
      (stat) => ({name: stat.stat.name, base: stat.base_stat, effort: stat.effort}));
    
    const pokemonModel: Pokemon = {
      id: dto.id,
      name: dto.name,
      types: types,
      image: dto.sprites.front_default,
      abilities: abilities,
      stats: stats
    };

    return pokemonModel;
  }

  public getPokemonSource(url: string = this.apiBaseUrl): Observable<PokemonListDto> {
    return this.httpClient.get<PokemonListDto>(`${url}`).pipe(
      distinctUntilChanged()
    );
  }

  public getPokemonList(): Observable<Pokemon[]> {
    return this.getPokemonSource().pipe(
      map((response: PokemonListDto) => {
        const urls = response.results.map((result) => result.url);
        const detailCalls: Observable<PokemonDto>[] = urls.map((url) => this.httpClient.get<PokemonDto>(url));
        return forkJoin(detailCalls);
      }),
      switchMap((response) => response),
      map((pokemonDtos: PokemonDto[]) => {
        console.log(pokemonDtos);
        return pokemonDtos.map((pokemonDto) => this.DtoToModel(pokemonDto))
      })
    );
  }
}
