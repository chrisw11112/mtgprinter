<template>
    <div body="card">
        <img class="card-image" :src="imageUrl">
        <button class="remove-button" @click="removeCard()">Remove</button>
        <select class="card-selects" id="set-select" name="set" v-model="selectedSet">
            <option :key="cardSet.scryfallId" v-for="cardSet in sets" :value="cardSet.set" :selected="cardSet.set === selectedSet">{{ cardSet.set }}</option>
        </select>
        <select class="card-selects" id="quantity-select" name="quantity" v-model="cardQuantity">
            <option v-for="number in numbersForQuantity" :key="number" :selected="quantity === number">{{ number }}</option>
        </select>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { SetStore, cardStore } from '@/Stores/store'

export default defineComponent({
    props: {
        imageUrl: String,
        set: String,
        id: String,
        scryfallID: String,
        quantity: Number,
        sets: Array as () => SetStore[],
    },
    data() {
        return {
            numbersForQuantity: Array.from({ length: 100 }, (_, index) => index + 1),
            cardQuantity: this.quantity,
            store: cardStore(),
            selectedSet: this.set
        }
    },
    watch: {
        cardQuantity(newValue: number, oldValue: number) {
            if (newValue !== oldValue && this.id && newValue) {
                this.store.changeQuantity(this.id, +newValue);
            }
        },
        selectedSet(newValue: string) {
            if (newValue && this.scryfallID) {
                this.updateSet(this.scryfallID, newValue);
            }
        }
    },
    methods: {
        removeCard() {
            if (this.id) {
                this.store.removeCard(this.id);
            }
        },
        updateSet(scryFallID: string, cardSet: string) {
            this.store.changeSet(scryFallID, cardSet);
        }
    }
});
</script>

<style scoped>
#quantity-select {
    width: 15%;
}
#set-select {
    width: 80%;
    margin-left: .5rem;
}
.card-selects {
    margin: .5rem;
    height: 2rem;
    border-radius: 5px;
    overflow: hidden;
    margin: 0;
}
.card {
  display: flex;
  justify-content: center;
}
.card-image {
  width: 97%;
  margin: .5rem;
  border-radius: 15px;
}
.remove-button {
    width: 97%;
    margin: .5rem;
}
</style>