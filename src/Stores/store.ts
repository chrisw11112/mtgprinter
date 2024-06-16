import { getScryfallCard, getScryfallSets } from "@/Helpers/ScryfallHelper"
import { defineStore } from "pinia"

interface NameAndQuanity {
    name: string,
    quantity: number
}

export interface CardStore {
    id: string,
    scryfallId: string,
    name: string,
    image: string,
    set: string,
    sets: SetStore[],
    quantity: number,
    otherSideImage: string | undefined
}
export interface SetStore {
    scryfallId: string,
    set: string,
    image: string
}

export const cardStore = defineStore('cards', {
    state: () => {
        return {
            cards: [] as CardStore[]
        }
    },
    getters: {
        getCards: (state) => state.cards
    },
    actions: {
        async addCard(cardName: string, fuzzy: boolean, quantity?: number, skipBasicLands?: boolean) {
            const otherCard = this.cards.find(x => x.name.toLowerCase() == cardName.toLowerCase());
            if (otherCard) {
                otherCard.quantity++;
                otherCard.id = `${otherCard.id}-${otherCard.quantity}`
                return;
            }
            const card = await getScryfallCard(cardName, fuzzy);
            if (!card || (skipBasicLands && card.type_line.includes("Basic Land"))) {
                return;
            }
            const allSetsForCard = await getScryfallSets(card.prints_search_uri);
            const sets: SetStore[] = [];
            for(let i = 0; i < allSetsForCard.length; i++) {
                if (allSetsForCard[i].card_faces) {
                    allSetsForCard[i].image_uris = allSetsForCard[i].card_faces![0].image_uris;
                }
                sets.unshift({
                    scryfallId: allSetsForCard[i].id,
                    set: allSetsForCard[i].set_name,
                    image: allSetsForCard[i].image_uris.normal
                });
            }
            let finalQuantity = 1;
            if (quantity) {
                finalQuantity = quantity;
            }
            const cardToStore = {
                id: `${card.id}-${finalQuantity}`,
                scryfallId: card.id,
                name: card.name,
                image: card.image_uris.normal,
                set: card.set_name,
                sets: sets,
                quantity: finalQuantity,
                otherSideImage: card.other_sideURI ? card.other_sideURI.normal : undefined
            };
            this.cards.unshift(cardToStore)
        },
        async bulkAdd(cards: string, includeLands: boolean) {
            const strings = cards.split("\n");
            const cardsToLookup: NameAndQuanity[] = [];
            for (let i = 0; i < strings.length; i++) {

                const cardToAdd: NameAndQuanity = {
                    name: "",
                    quantity: 1
                }
                const containsSet = strings[i].indexOf('(');
                if (containsSet !== -1) {
                    strings[i] = strings[i].substring(0, containsSet);
                }
                if (!isNaN(Number(strings[i].charAt(0)))) {
                    const firstSpaceIndex = strings[i].indexOf(' ');
                    cardToAdd.quantity = Number(strings[i].substring(0, firstSpaceIndex));
                    cardToAdd.name = strings[i].substring(firstSpaceIndex, strings[i].length - 1);
                }
                else {
                    cardToAdd.name = strings[i];
                }
                
                cardsToLookup.push(cardToAdd);
            }
            for (let i = 0; i < cardsToLookup.length; i++) {
                await this.addCard(cardsToLookup[i].name, true, cardsToLookup[i].quantity, includeLands);
            }
        },
        removeCard(id: string) {
            const cardMinusMatchingID: CardStore[] = this.cards.filter(x => x.id !== id);
            this.cards = cardMinusMatchingID;
        },
        changeQuantity(id: string, newQuantity: number) {
            const card = this.cards.find(card => card.id === id);
            if (card) {
                card.quantity = newQuantity;
            }
        },
        changeSet(scryfallId: string, setName: string) {
            const card: CardStore | undefined = this.cards.find(card => card.scryfallId === scryfallId);
            const newSet: SetStore | undefined = card?.sets.find(card => card.set === setName);
            if (card && newSet) {
                card.id = `${newSet.scryfallId}-${card.quantity}`;
                card.scryfallId = newSet.scryfallId;
                card.image = newSet.image;
                card.set = newSet.set
            }
        }
    }
})