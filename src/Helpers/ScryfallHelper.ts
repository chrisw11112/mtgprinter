import axios from "axios";

const scryfallApiURL = "https://api.scryfall.com";
let lastRequestTime: Date = new Date();

const shouldNotContinue = () => (new Date().getTime() - lastRequestTime.getTime()) < 125;
const updateRequestTime = () => lastRequestTime = new Date();
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface ScryFallAutoComplete {
    data: string[]
}
interface ScryfallImageURI {
    small: string,
    normal: string,
    large: string,
}
export interface ScryfallCard {
    id: string,
    name: string,
    image_uris: ScryfallImageURI,
    prints_search_uri: string
    set_name: string,
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
        const response = await axios.get<ScryFallAutoComplete>(`${scryfallApiURL}/cards/autocomplete?q=${name}`);
        updateRequestTime();

        if (response.status == 200) {
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

export async function getScryfallCard(name: string): Promise<ScryfallCard | null> {
    try {
        if (shouldNotContinue()) {
            delay(100);
            return await getScryfallCard(name);
        }
        const response = await axios.get<ScryfallCard>(`${scryfallApiURL}/cards/named?exact=${name}`);

        return response.data;
    }
    catch (error) {
        console.log(error);
        return null;
    }
}

export async function getScryfallSets(searchURL: string): Promise<ScryfallCard[]> {
    try {
        if (shouldNotContinue()) {
            delay(100);
            return await getScryfallSets(searchURL);
        }
        const response = await axios.get<ScryfallCard[]>(searchURL);
        
        return response.data;
    }
    catch (error) {
        console.log(error);
        return [];
    }
}