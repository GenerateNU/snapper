import { fetchData } from "./base";

export async function getDiveLogById(id: string): Promise<any> {
    return await fetchData(`/divelog/${id}`, "Failed to fetch divelog");
}