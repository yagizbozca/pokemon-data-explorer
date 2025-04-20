import { Injectable } from '@angular/core';
import {catchError, delay, forkJoin, from, map, merge, mergeMap, Observable, of, retry, switchMap} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ListDto } from '../dtos/list-dto';
import { PokemonDto } from '../dtos/pokemon-dto';
import { Pokemon } from '../models/pokemon.model';
import { PaginatorModel } from '../models/paginator.model';
import {PokemonErrorModel} from "../models/pokemon-error.model";

@Injectable({
    providedIn: "root"
})
export class PokemonService {

    private readonly apiBaseUrl: string = "https://pokeapi.co/api/v2/";
    private readonly retryNumber: number = 3;
    private _paginatorObj: PaginatorModel = { count: 0, next: "", previous: "" };
    private _pokemonList: Array<Pokemon | PokemonErrorModel> = [];

    constructor(
        private httpClient: HttpClient
    ) { }

    get paginatorObj(): PaginatorModel {
        return this._paginatorObj;
    }

    set paginatorObj(obj: ListDto) {
        this._paginatorObj = {
            count: obj.count,
            next: obj.next,
            previous: obj.previous
        };
    }

    get pokemonList(): Array<Pokemon | PokemonErrorModel> {
        return this._pokemonList;
    }

    set pokemonList(pokemon: Pokemon | PokemonErrorModel ) {
        if (!pokemon) {
            this._pokemonList = [];
        }
        this._pokemonList.push(pokemon);
    }

    private DtoToModel(dto: PokemonDto): Pokemon {
        const types: string = dto.types.map((type) => type.type.name).join(", ");

        const abilities: { name: string, isHidden: boolean, slotNumber: number }[] = dto.abilities.map(
            (ability) => ({ name: ability.ability.name, isHidden: ability.is_hidden, slotNumber: ability.slot }));

        const stats: { name: string, base: number, effort: number }[] = dto.stats.map(
            (stat) => ({ name: stat.stat.name, base: stat.base_stat, effort: stat.effort }));

        return {
            id: dto.id,
            name: dto.name,
            types: types,
            image: dto.sprites.front_default,
            abilities: abilities,
            stats: stats
        };
    }

    private getPokemonSource(url: string): Observable<ListDto> {
        return this.httpClient.get<ListDto>(`${url}`).pipe(
            retry(this.retryNumber),
            catchError((error) => {
                throw error;
            })
        );
    }

    public getPokemonList(url: string = this.apiBaseUrl + "pokemon/") {
        return this.getPokemonSource(url).pipe(
            switchMap((response) => {
                this.paginatorObj = response;
                const urls = response.results.map((result) => result.url);
                return from(urls);
            }),
            mergeMap((url) => {
                return this.httpClient.get<PokemonDto>(url).pipe(
                    delay((new Date().getMilliseconds() % 7)*1000), // To simulate network latency
                    map(pokemonDto => this.DtoToModel(pokemonDto)),
                    retry(this.retryNumber),
                    catchError(() => of<PokemonErrorModel>({ errorMessage: 'An error occurred', failed: true }))
                );
            })
        );
    }

    public getPokemonById(id: number): Observable<Pokemon> {
        return this.httpClient.get<PokemonDto>(this.apiBaseUrl + "pokemon/" + id).pipe(
            map((pokemonDto: PokemonDto) => this.DtoToModel(pokemonDto))
        );
    }

    public getTypeList(): Observable<string[]> {
        return this.httpClient.get<ListDto>(this.apiBaseUrl + "type/?limit=21").pipe(
            map((response: ListDto) => response.results.map((type) => type.name))
        );
    }
}
