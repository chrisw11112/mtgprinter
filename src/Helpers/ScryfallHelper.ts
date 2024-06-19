import axios from "axios";

const scryfallApiURL = "https://api.scryfall.com";
let lastRequestTime: Date = new Date();


//This delay is because scryfall requests a 100ms delay and I have left a little room.
const shouldNotContinue = () => (new Date().getTime() - lastRequestTime.getTime()) < 125;
const updateRequestTime = () => lastRequestTime = new Date();
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface ScryFallAutoComplete {
    data: string[]
}
interface ScryfallImageURI {
    small: string,
    normal: string,
    large: string,
}
interface ScryFallSets {
    data: ScryfallCard[]
}
interface CardFaces {
    image_uris: ScryfallImageURI
}
export interface ScryfallCard {
    id: string,
    name: string,
    card_faces: CardFaces[] | null,
    other_sideURI: ScryfallImageURI | null,
    image_uris: ScryfallImageURI,
    prints_search_uri: string
    set_name: string,
    type_line: string
}
export async function getScryfallPictureURLs(uuid: string, size: ScryfallPictureSize, name: string): Promise<string[]> {
    const pictures : string[] = [];

    pictures.push(`https://cards.scryfall.io/${size}/front/${uuid.charAt(0)}/${uuid.charAt(1)}/${uuid}.jpg`);

    if (name.includes("//")) {
        pictures.push(`https://cards.scryfall.io/${size}/back/${uuid.charAt(0)}/${uuid.charAt(1)}/${uuid}.jpg`);
    }
    return pictures;
}
export async function getScryFallCardsLike(name: string): Promise<ScryFallAutoComplete> {
    try {
        // Scryfall wont return anything if the string is two or less characters so might as well not even send a request
        if (name.length <= 2 || shouldNotContinue() || !name) {
            return {
                data: []
            }
        }
        if (shouldNotContinue()) {
            await delay(150);
            return await getScryFallCardsLike(name);
        }
        const response = await axios.get<ScryFallAutoComplete>(`${scryfallApiURL}/cards/autocomplete?q=${name}`);
        updateRequestTime();

        if (response.status === 200) {
            return response.data;
        }
        return {
            data: []
        }
    }
    catch (error) {
        console.log(error);
        return {
            data: []
        }
    }
}
export async function getScryfallCard(name: string, fuzzy: boolean): Promise<ScryfallCard | null> {
    try {
        if (shouldNotContinue()) {
            await delay(150);
            return await getScryfallCard(name, fuzzy);
        }
        const response = await axios.get<ScryfallCard>(`${scryfallApiURL}/cards/named?${fuzzy ? 'fuzzy' : 'exact'}=${name}`);
        updateRequestTime();
        if (response.status !== 200) {
            console.log(response);
        }
        const result = response.data;
        if (result.card_faces && result.card_faces.length > 1 && result.card_faces[0].image_uris && result.card_faces[0].image_uris) {
            result.image_uris = result.card_faces[0].image_uris
        }
        if (result.card_faces && result.card_faces[1].image_uris && result.card_faces[1].image_uris) {
            result.other_sideURI = result.card_faces[1].image_uris;
        }
        if (!result.image_uris) {
            result.image_uris = {
                small: `https://cards.scryfall.io/small/front/${result.id.charAt(0)}/${result.id.charAt(1)}/${result.id}.jpg`,
                normal: `https://cards.scryfall.io/normal/front/${result.id.charAt(0)}/${result.id.charAt(1)}/${result.id}.jpg`,
                large: `https://cards.scryfall.io/large/front/${result.id.charAt(0)}/${result.id.charAt(1)}/${result.id}.jpg`
            };
        }

        return result;
    }
    catch (error) {
        return null;
    }
}
export async function getScryfallSets(searchURL: string): Promise<ScryfallCard[]> {
    try {
        if (shouldNotContinue()) {
            await delay(150);
            return await getScryfallSets(searchURL);
        }
        const response = await axios.get<ScryFallSets>(searchURL);
        updateRequestTime();

        return response.data.data;
    }
    catch (error) {
        console.log(error);
        return [];
    }
}

