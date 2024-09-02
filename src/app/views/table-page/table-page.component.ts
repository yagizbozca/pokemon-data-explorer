import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../../core/services/pokemon.service';
import { Pokemon } from '../../core/models/pokemon.model';
import { PageEvent } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';

@Component({
    selector: 'app-table-page',
    templateUrl: './table-page.component.html',
    styleUrl: './table-page.component.css'
})
export class TablePageComponent implements OnInit {
    private filterByNameValue: string = "";

    protected readonly displayedColumns: string[] = ['id', 'name', 'types', 'sprite'];
    protected dataSource: Pokemon[] = [];
    protected pokemonList: Pokemon[] = [];
    protected typeList: string[] = [];
    protected filterByTypeValue: string[] = [];

    constructor(
        protected pokemonService: PokemonService
    ) {}

    private getPokemonList(url?: string): void {
        this.pokemonService.getPokemonList(url).subscribe({
            next: (pokemonList: Pokemon[]) => {
                this.pokemonList = pokemonList;
                this.dataSource = pokemonList;

                this.applyFilter(this.filterByNameValue, this.filterByTypeValue);
            }
        });
    }

    private getTypeList(): void {
        this.pokemonService.getTypeList().subscribe({
            next: (typeList: string[]) => {
                this.typeList = typeList;
            }
        });
    }

    private applyFilter(nameFilterValue: string, typeFilterValue: string[]): void {
        if (!(nameFilterValue.length || typeFilterValue.length)) {
            this.dataSource = this.pokemonList;
            return;
        }

        this.dataSource = this.pokemonList.filter((item) => {
            // If 'typeFilterValue' is an empty array, right side of the logic always returns true as considered there is no filter applied.
            return item.name.toLowerCase().includes(nameFilterValue) && (!typeFilterValue.length || typeFilterValue.some((type) => item.types.includes(type)))
        });

    }

    protected pageEventHandler(e: PageEvent): void {
        if (e.previousPageIndex && e.previousPageIndex > e.pageIndex) {
            // Go backward
            this.getPokemonList(this.pokemonService.paginatorObj.previous);
        } else {
            // Go forward
            this.getPokemonList(this.pokemonService.paginatorObj.next);
        }
    }

    protected filterByNameEventHandler(e: Event): void {
        this.filterByNameValue = (e.target as HTMLInputElement).value.trim().toLowerCase();
        this.applyFilter(this.filterByNameValue, this.filterByTypeValue);
    }

    protected filterByTypeHandler(e: MatSelectChange): void {
        this.filterByTypeValue = e.value;
        this.applyFilter(this.filterByNameValue, this.filterByTypeValue);
    }

    protected rowClickHandler(e: Pokemon) {
        console.log(e);
    }

    ngOnInit(): void {
        this.getPokemonList();
        this.getTypeList();
    }
}
