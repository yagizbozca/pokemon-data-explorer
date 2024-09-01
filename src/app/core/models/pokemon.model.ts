export type Pokemon = {
    id: number,
    name: string,
    types: string,
    image: string,
    abilities: {
        name: string,
        isHidden: boolean,
        slotNumber: number
    }[],
    stats: {
        name: string,
        base: number,
        effort: number
    }[]
};