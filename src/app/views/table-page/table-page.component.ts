import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../../core/services/pokemon.service';
import { PageEvent } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';
import { Router } from '@angular/router';
import { PokemonErrorModel } from "../../core/models/pokemon-error.model";
import {Pokemon} from "../../core/models/pokemon.model";

@Component({
    selector: 'app-table-page',
    templateUrl: './table-page.component.html',
    styleUrl: './table-page.component.css'
})
export class TablePageComponent implements OnInit {
    private filterByNameValue: string = "";

    protected readonly displayedColumns: string[] = ['id', 'name', 'types', 'sprite'];
    protected dataSource: Array<Pokemon | PokemonErrorModel> = [];
    protected typeList: string[] = [];
    protected filterByTypeValue: string[] = [];

    constructor(
        protected pokemonService: PokemonService,
        protected router: Router
    ) {}

    private getPokemonList(url?: string): void {
        this.pokemonService.getPokemonList(url).subscribe({
            next: (pokemon) => {
                this.dataSource = [...this.dataSource, pokemon]
                    .sort((a, b) => (<Pokemon>a).id - (<Pokemon>b).id);
                this.pokemonService.pokemonList = pokemon;
                if (this.filterByNameValue.length || this.filterByTypeValue.length) {
                    this.applyFilter(this.filterByNameValue, this.filterByTypeValue);
                }
            },
            error: (error) => {
                throw error;
            }
        });
    }

    private getTypeList(): void {
        this.pokemonService.getTypeList().subscribe({
            next: (typeList: string[]) => {
                this.typeList = typeList;
            },
            error: (error) => {
                throw error;
            }
        });
    }

    private applyFilter(nameFilterValue: string, typeFilterValue: string[]): void {
        this.dataSource = this.pokemonService.pokemonList
            .filter((item) => {
                if (item.hasOwnProperty('name') && item.hasOwnProperty('types')) {
                    // If 'typeFilterValue' is an empty array, right side of the logic always returns true as considered there is no filter applied.
                    return (<Pokemon>item).name.toLowerCase().includes(nameFilterValue) && (!typeFilterValue.length || typeFilterValue.some((type) => (<Pokemon>item).types.includes(type)))
                } else {
                    return false;
                }
            })
            .sort((a, b) => (<Pokemon>a).id - (<Pokemon>b).id);
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

    protected rowClickHandler(id: number) {
        void this.router.navigate(["detail", id]);
    }

    ngOnInit(): void {
        this.getPokemonList();
        this.getTypeList();
    }
}
