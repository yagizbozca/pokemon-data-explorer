import { NameUrlDto } from "./name-url-dto";

export type ListDto = {
    count: number,
    next: string,
    previous: string,
    results: NameUrlDto[]
};