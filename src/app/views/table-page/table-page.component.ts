import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../../core/services/pokemon.service';
import { Pokemon } from '../../core/models/pokemon.model';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
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
    protected filterByTypeValue: string[] = [];

    constructor(
        protected pokemonService: PokemonService
    ) {}

    private getList(url?: string): void {
        this.pokemonService.getPokemonList(url).subscribe({
            next: (pokemonList: Pokemon[]) => {
                console.log(pokemonList);
                this.pokemonList = pokemonList;
                this.dataSource = pokemonList;

                this.applyNameFilter(this.filterByNameValue);
            }
        });
    }

    private applyNameFilter(filterValue: string): void {
        if (!filterValue.length) {
            this.dataSource = this.pokemonList;
        }

        this.dataSource = this.pokemonList.filter((item) => item.name.toLowerCase().includes(filterValue));
    }

    protected pageEventHandler(e: PageEvent): void {
        if (e.previousPageIndex && e.previousPageIndex > e.pageIndex) {
            // Go backward
            this.getList(this.pokemonService.paginatorObj.previous);
        } else {
            // Go forward
            this.getList(this.pokemonService.paginatorObj.next);
        }
    }

    protected filterByNameEventHandler(e: Event): void {
        this.filterByNameValue = (e.target as HTMLInputElement).value.trim().toLowerCase();
        this.applyNameFilter(this.filterByNameValue);
    }

    protected filterByTypeHandler(e: MatSelectChange): void {
        console.log("MatSelectChange", e);
    }

    ngOnInit(): void {
        this.getList();
    }
}
