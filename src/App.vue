<template>
  <NavbarComponent/>
  <div class="input-elements">
    <button class="frontpage-buttons import-button" @click="isTextAreaOpen ? isTextAreaOpen = false : isTextAreaOpen = true">Import</button>
    <textarea v-if="isTextAreaOpen" class="textarea" v-model="textAreaInput" placeholder="1 Detection Tower 
Grindstone
3 Force of despair
Grand Arbiter Augustin IV"></textarea>
    <div class="bulkadd-buttons">
      <button :style="{ cursor: cursorStyle }" v-if="isTextAreaOpen" @click="loading ? '' : addBulkCards()" class="addcards-button">Add Cards</button>
      <div class="toggle">
        <label v-if="isTextAreaOpen" class="toggle-button">Basic Lands
        <input type="checkbox" v-model="toggleLands" class="checkbox-next-line">
        <span class="checkmark"></span>
      </label>
      </div>
    </div>
    <div v-if="cardStore.cards.length < 1" class="info">
      <header class="info-header">
        <img class="image" src="./assets/Designer-modified.png">
        This is a tool to help print magic the gathering cards.
        Either import a list of cards or search for the cards using the search bar
      </header>
    </div>
    <div class="download-buttons">
      <button :style="{ cursor: cursorStyle }" v-if="cardStore.cards.length > 0" class="frontpage-buttons download-button download-print-buttons" @click="loading ? '' : download()">Download</button>
      <button :style="{ cursor: cursorStyle }" v-if="cardStore.cards.length > 0" class="frontpage-buttons print-button download-print-buttons" @click="loading ? '' : openNewWindow()">Print</button>
    </div>
    <LoadingComponent v-if="loading" class="loading"></LoadingComponent>
    <div v-if="!loading" class="card-grid">
      <CardComponent
      v-for="card in state.currentCards" 
      :key="card.id" 
      :imageUrl="card.image"
      :set="card.set"
      :id="card.id"
      :sets="card.sets"
      :quantity="card.quantity"
      :scryfallID="card.scryfallId"
    />
    </div>
  </div>  
</template>

<style>
</style>

<script lang="ts">
import { defineComponent, reactive, watch } from 'vue';
import NavbarComponent from './components/NavbarComponent.vue';
import CardComponent from './components/CardComponent.vue';
import { cardStore, CardStore } from './Stores/store';
import { downloadPDF, openNewWindowWithPDF } from '@/Helpers/PdfCreationHelper'
import LoadingComponent from './components/LoadingComponent.vue';

export default defineComponent({
  name: 'App',
  components: {
    NavbarComponent,
    CardComponent,
    LoadingComponent
  },
  data() {
    return {
      textAreaInput: "",
      cardStore: cardStore(),
      isTextAreaOpen: false,
      toggleLands: true,
      loading: false,
    }
  },
  computed: {
    cursorStyle(): string {
      return this.loading ? 'not-allowed' : 'pointer';
    }
  },
  methods: {
    async download() {
      try {
        this.loading = true;
        await downloadPDF(this.state.currentCards);
        this.loading = false;
      }
      catch {
        this.loading = false;
      }
    },
    async openNewWindow() {
      try {
        this.loading = true;
        await openNewWindowWithPDF(this.state.currentCards);
        this.loading = false;
      }
      catch {
        this.loading = false;
      }
    },
    async addBulkCards() {
      try {
        this.loading = true;
        await this.cardStore.bulkAdd(this.textAreaInput, !this.toggleLands);
        this.loading = false;
      }
      catch {
        this.loading = false;
      }
    }
  },
  setup() {
    const cards = cardStore();
    const state = reactive({
      currentCards: cards.cards as CardStore[],
    });

    watch(
      () => cards.cards,
      (newCards) => {
        state.currentCards = newCards;
      },
      { deep: true }
    )
    return {
      state,
    };
  }
});
</script>

<style>
@media (min-width: 320px) {
  .card-grid {
    grid-template-columns: minmax(100%, 100%);
  }
}
@media (min-width: 768px) {
  .card-grid {
    grid-template-columns: repeat(3, minmax(33.33%, 33.33%));
  }
}
@media (min-width: 1200px) {
  .card-grid {
    grid-template-columns: repeat(6, minmax(16.66%, 66.66%));
  }
}
.image {
  height: 20vh;
  width: 100%;
  object-fit: contain;
}
.info-header {
  margin-left: 10%;
  margin-right: 10%;
  text-align: center;
}
.info {
  display: flex;
  width: 100%;
  height: 60vh;
  justify-content: center;
  align-items: center;
}
.loading {
  background-color: whitesmoke;
  margin: 20vh auto;
}
.toggle {
  display: flex;
  width: 65%;
}
.toggle-button {
  font-size: small;
  width: 65%;
}
.bulkadd-buttons {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
}
.addcards-button {
  width: 35%;
  margin: .5rem;
}
.card-grid {
  display: grid;
  width: 100%;
}
* {
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  background-color: whitesmoke;
  color: 	#282828;
}
button {
  height: 3rem;
  cursor: pointer;
}
.download-buttons {
  display: flex;
  width: 100%;
}
.frontpage-buttons {
  margin: .5rem;
}
.import-button {
  align-self: center;
  width: 100%;
}
.download-print-buttons {
  width: 50%;
}
body {
  margin: 0;
}
button {
  background-color: #93B7BE;
  border-radius: 5px;
  border: 1px groove #F1FFFA;
}
.textarea {
  width: 100%;
  height: 40vh;
  margin: .5rem;
  border: 1px groove lightgrey;
}
.input-elements {
  display: flex;
  flex-flow: row wrap;
}
</style>
