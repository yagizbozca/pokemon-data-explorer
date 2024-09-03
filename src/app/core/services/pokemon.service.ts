import { Injectable } from '@angular/core';
import { catchError, forkJoin, map, Observable, retry, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ListDto } from '../dtos/list-dto';
import { PokemonDto } from '../dtos/pokemon-dto';
import { Pokemon } from '../models/pokemon.model';
import { PaginatorModel } from '../models/paginator.model';

@Injectable({
    providedIn: "root"
})
export class PokemonService {

    private readonly apiBaseUrl: string = "https://pokeapi.co/api/v2/";
    private readonly retryNumber: number = 3;
    private _paginatorObj: PaginatorModel = { count: 0, next: "", previous: "" };
    private _pokemonList: Pokemon[] = [];

    constructor(
        private httpClient: HttpClient
    ) { }

    public get paginatorObj(): PaginatorModel {
        return this._paginatorObj;
    }

    private set paginatorObj(obj: ListDto) {
        this._paginatorObj = {
            count: obj.count,
            next: obj.next,
            previous: obj.previous
        };
    }

    public get pokemonList(): Pokemon[] {
        return this._pokemonList;
    }

    private set pokemonList(list: Pokemon[]) {
        this._pokemonList = list;
    }

    private DtoToModel(dto: PokemonDto): Pokemon {
        const types: string = dto.types.map((type) => type.type.name).join(", ");

        const abilities: { name: string, isHidden: boolean, slotNumber: number }[] = dto.abilities.map(
            (ability) => ({ name: ability.ability.name, isHidden: ability.is_hidden, slotNumber: ability.slot }));

        const stats: { name: string, base: number, effort: number }[] = dto.stats.map(
            (stat) => ({ name: stat.stat.name, base: stat.base_stat, effort: stat.effort }));

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

    private getPokemonSource(url: string): Observable<ListDto> {
        return this.httpClient.get<ListDto>(`${url}`).pipe(
            retry(this.retryNumber),
            catchError((error) => {
                throw error;
            })
        );
    }

    public getPokemonList(url: string = this.apiBaseUrl + "pokemon/"): Observable<Pokemon[]> {
        return this.getPokemonSource(url).pipe(
            map((response: ListDto) => {
                this.paginatorObj = response;
                const urls = response.results.map((result) => result.url);
                const detailCalls: Observable<PokemonDto>[] = urls.map((url) => this.httpClient.get<PokemonDto>(url));
                return forkJoin(detailCalls);
            }),
            switchMap((response) => response),
            map((pokemonDtos: PokemonDto[]) => {
                this.pokemonList = pokemonDtos.map((pokemonDto) => this.DtoToModel(pokemonDto));
                return this.pokemonList;
            }),
            retry(this.retryNumber),
            catchError((error) => {
                throw error;
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
