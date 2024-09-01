import { NameUrlDto } from "./name-url-dto";

export type PokemonListDto = {
    count: number,
    next: string,
    previous: string,
    results: NameUrlDto[]
};