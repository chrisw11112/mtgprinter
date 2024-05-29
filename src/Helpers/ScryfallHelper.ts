export function getScryfallPictureURLs(uuid: string, size: ScryfallPictureSize, name: string): string[] {
    let pictures : string[] = [];
    pictures.push(`https://cards.scryfall.io/${size}/front/${uuid.charAt(0)}/${uuid.charAt(1)}/${uuid}.jpg`);

    if (name.includes("//")) {
        pictures.push(`https://cards.scryfall.io/${size}/back/${uuid.charAt(0)}/${uuid.charAt(1)}/${uuid}.jpg`);
    }
    return pictures;
}