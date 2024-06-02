import { defineStore } from "pinia"

interface CardStore {
    id: string,
    name: string,
    image: string,
    sets: string[],
    quantity: number
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
        addCard(card: CardStore) {
            this.cards.push(card)
        },
        removeCard(id: string) {
            const cardMinusMatchingID: CardStore[] = this.cards.filter(x => x.id !== id);
            this.cards = cardMinusMatchingID;
        },
        changeQuantity(id: string, newQuantity: number) {
            if (newQuantity <= 0) {
                return
            }
            const card = this.cards.find(card => card.id === id);
            if (card) {
                card.quantity = newQuantity;
            }
        }
    }
})