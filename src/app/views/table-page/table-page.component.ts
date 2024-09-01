import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../../core/services/pokemon.service';
import { Pokemon } from '../../core/models/pokemon.model';
import { PaginatorModel } from '../../core/models/paginator.model';
import { map, switchMap } from 'rxjs';
import { PokemonListDto } from '../../core/dtos/pokemon-list-dto';

@Component({
    selector: 'app-table-page',
    templateUrl: './table-page.component.html',
    styleUrl: './table-page.component.css'
})
export class TablePageComponent implements OnInit {
    protected readonly displayedColumns: string[] = ['id', 'name', 'types', 'sprite'];
    protected dataSource: Pokemon[] = [];
    protected paginatorObj!: PaginatorModel;

    constructor(
        private pokemonService: PokemonService
    ) {}

    ngOnInit(): void {
        this.pokemonService.getPokemonSource().pipe(
            map((dataSource: PokemonListDto) => {
                this.paginatorObj = {
                    count: dataSource.count,
                    next: dataSource.next,
                    previous: dataSource.previous
                };
            }),
            switchMap(() => this.pokemonService.getPokemonList())
        ).subscribe({
            next: (pokemonList: Pokemon[]) => {
                console.log(pokemonList);
                this.dataSource = pokemonList;
            }
        });
    }
}
