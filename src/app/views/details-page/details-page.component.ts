import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../../core/services/pokemon.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Pokemon } from '../../core/models/pokemon.model';
import { catchError, map, switchMap } from 'rxjs';

@Component({
    selector: 'app-details-page',
    templateUrl: './details-page.component.html',
    styleUrl: './details-page.component.css'
})
export class DetailsPageComponent implements OnInit {
    private pokemonId: number | undefined;

    protected pokemon: Pokemon | undefined;

    constructor(
        private pokemonService: PokemonService,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.route.params.pipe(
            map((params) => {
                console.log("Params", params);
                return +params["id"];
            }),
            switchMap((id: number) => this.pokemonService.getPokemonById(id)),
            catchError(() => {
                throw new Error("No pokemon found");
            })
        ).subscribe({
            next: (pokemon: Pokemon | undefined) => {
                console.log("pokemon", pokemon);
                this.pokemon = pokemon;
            }
        });
    }
}
