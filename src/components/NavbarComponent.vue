<template>
  <div>
    <nav class="navbar dynamic-padding">
        <input placeholder="Search..." class="navbar-input" type="search" v-model="inputValue" v-on:keyup.enter="loading ? '' : search()" @blur = "isInputFocused = false" @focus="isInputFocused = true"/>
    </nav> <!--v-if="isInputFocused"-->
    <ul v-if="isInputFocused && searchedClickedAtLeastOnce" class="searchbar-result">
      <LoadingComponent v-if="loading" class="loading-bar"></LoadingComponent>
      <li class="searchbar-block noresult-block" v-if="currentSearchResults.length < 1 && !loading">No Results</li>
      <li class="searchbar-block" @mousedown.stop="cardToAdd = value.name" v-for="value in currentSearchResults" :key="value.name"><img class="searchbar-block-image" v-if="value.imageURL" :src="value.imageURL">{{ value.name }}</li>
    </ul>
  </div>
</template>


<script lang = "ts">
import { defineComponent } from 'vue';
import { getScryfallCard,  getScryFallCardsLike} from '@/Helpers/ScryfallHelper'
import { cardStore } from '@/Stores/store';
import LoadingComponent from './LoadingComponent.vue';

interface NameAndImage {
  name: string,
  imageURL: string | undefined
}

export default defineComponent({
    name: "NavbarComponent",
    components: {
      LoadingComponent
    },
    methods: {
      async getUrl(name: string) {
        return (await getScryfallCard(name, false))?.image_uris.small;
      },
      search() {
      this.searchedClickedAtLeastOnce = true;
      this.navbarPadding = '4px'
      this.searchResults = this.inputValue
      }
    },
    watch: {
    async isInputFocused(newValue) {
      if (this.searchedClickedAtLeastOnce) {
        this.navbarPadding = newValue ? '4px' : '1.25rem'
      }
    },
    async cardToAdd() {
      if (this.cardToAdd) {
        await this.store.addCard(this.cardToAdd, false);
        this.cardToAdd = "";
      }
    },
    async searchResults(newValue) {
      this.loading = true;
      this.currentSearchResults = [] as NameAndImage[];
      const response = await getScryFallCardsLike(newValue);
      const result = response.data;
      if (result.length <= 0) {
        let thingToReturn: NameAndImage[] = []
        thingToReturn.push({
          name: "No Result",
          imageURL: undefined
        })
        this.loading = false;
        return thingToReturn;
      }
      let imgsAndURLs: NameAndImage[] = [];
      if (newValue !== null && newValue !== "" && newValue !== undefined) {
        for (let i = 0; i < 5; i++) {
          if (!result[i]) {
            continue;
          }
          const img = await this.getUrl(result[i]);
          if (img == undefined) {
            continue;
          }
          const nameAndImg: NameAndImage = {
            name: result[i],
            imageURL: img
          }
          imgsAndURLs.push(nameAndImg);
        }
        this.currentSearchResults = imgsAndURLs;
        this.lastSearchDate = new Date();
      }
      this.loading = false;
    }
  },
  data() {
    return {
      inputValue: "",
      searchResults: "",
      currentSearchResults: [] as NameAndImage[],
      lastSearchDate: new Date(),
      isInputFocused: false,
      store: cardStore(),
      cardToAdd: "",
      searchedClickedAtLeastOnce: false,
      navbarPadding: "1.25rem",
      loading: false
    };
  }
});
</script>

<style scoped>
@media (min-width: 320px) {
  .searchbar-result {
    width: 100%;
  }
}
@media (min-width: 728px) {
  .searchbar-result {
    width: 60%;
    margin-left: auto;
    margin-right: auto;
    position: absolute;
    left: 20%;
  }
}
.loading-bar {
  background-color: gainsboro;
  margin: 10% auto;
}
.dynamic-padding {
  padding-bottom: v-bind(navbarPadding);
}
.searchbar-result {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: space-around;
  margin-top: 0;
  background-color: gainsboro;
}
.searchbar-block:last-child {
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}
.noresult-block {
  display: flex;
  justify-content: space-around;
  height: 100%;
}
.navbar { 
  display: flex;
  justify-content: center;
  background: linear-gradient(1turn, white, 10%, #011638);
  padding-top: 1.25rem;
  height: 1.5rem;
}
.navbar-input {
  background-color: white;
  border-color: white;
  border-radius: 3px;
  border-style: solid;
  width: 60%;
}
.searchbar {
  display: flex;
  flex-direction: column;
  border: 1px solid black;
}
.searchbar-block {
  height: 5vh;
  border: .25px, groove grey;
  border-top: 0;
  font-size: 1.25rem;
  color: #282828;
  overflow: hidden;
  padding-bottom: .6rem;
  padding-top: .25rem;
  background-color: gainsboro;
}
.searchbar-block-image {
  max-width: 98%;
  max-height: 100%;
  margin-left: 1rem;
  margin-right: 1rem;
}
</style>