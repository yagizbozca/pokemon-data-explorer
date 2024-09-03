import { Component } from '@angular/core';
import { PokemonService } from '../../core/services/pokemon.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Pokemon } from '../../core/models/pokemon.model';
import { catchError, map, Observable, switchMap } from 'rxjs';

@Component({
    selector: 'app-details-page',
    templateUrl: './details-page.component.html',
    styleUrl: './details-page.component.css'
})
export class DetailsPageComponent {

    protected pokemon$: Observable<Pokemon | undefined> | undefined;
    protected pokemon: Pokemon | undefined;

    constructor(
        private pokemonService: PokemonService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.pokemon$ = this.route.params.pipe(
            map((params) => {
                return +params["id"];
            }),
            switchMap((id: number) => this.pokemonService.getPokemonById(id)),
            map((pokemon: Pokemon | undefined) => {
                this.pokemon = pokemon;
                return pokemon;
            }),
            catchError((error) => {
                throw error;
            })
        );
    }

    protected backBtnClickHandler(): void {
        this.router.navigate(["list"]).then();
    }
}
