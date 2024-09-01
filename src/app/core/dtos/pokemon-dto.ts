import { NameUrlDto } from "./name-url-dto";

export type PokemonDto = {
    id: number,
    name: string,
    types: {
        slot: number,
        type: NameUrlDto 
    }[],
    sprites: {
        front_default: string
    },
    abilities: {
        ability: NameUrlDto,
        is_hidden: boolean
        slot: number
    }[],
    stats: {
        base_stat: number,
        effort: number,
        stat: NameUrlDto
    }[]
};