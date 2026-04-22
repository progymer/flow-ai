import { nanoid } from "nanoid";


export function generatedId(type:string): string {
    return `${type.toLowerCase()}-${nanoid(10)}`
}