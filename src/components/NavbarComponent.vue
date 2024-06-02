<template>
  <div>
    <nav class="navbar">
        <input placeholder="Search..." class="navbar-input" type="search" v-model="inputValue" v-on:keyup.enter="searchResults = inputValue" @blur = "isInputFocused = false" @focus="isInputFocused = true"/>
    </nav>
    <ul class="searchbar" v-if="isInputFocused">
      <li class="searchbar-block" v-for="value in currentSearchResults" :key="value.name"><img class="searchbar-block-image" v-if="value.imageURL" :src="value.imageURL">{{ value.name }}</li>
    </ul>
  </div>
</template>


<script lang = "ts">
import { defineComponent } from 'vue';
import { getScryFallCardsLike, getScryfallCard } from '@/Helpers/ScryfallHelper';

interface NameAndImage {
  name: string,
  imageURL: string | undefined
}

export default defineComponent({
    name: "NavbarComponent",
    methods: {
      async getUrl(name: string) {
        return (await getScryfallCard(name))?.image_uris.small;
      }
    },
    watch: {
    async searchResults(newValue) {
      const result: string[] = (await getScryFallCardsLike(newValue)).data;
      if (result.length <= 0 && this.currentSearchResults.length <= 2) {
        let thingToReturn: NameAndImage[] = []
        thingToReturn.push({
          name: "No Result",
          imageURL: undefined
        })
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
    }
  },
  data() {
    return {
      inputValue: "",
      searchResults: "",
      currentSearchResults: [] as NameAndImage[],
      lastSearchDate: new Date(),
      isInputFocused: false
    };
  }
});
</script>

<style scoped>
.navbar { 
  display: flex;
  justify-content: center;
  background: linear-gradient(1turn, white, 10%, #2A0C4E);
  padding-top: 15px;
  padding-bottom: 15px;
}
.navbar-input {
  background-color: white;
  border-color: white;
  border-radius: 3px;
  border-style: solid;
}
.searchbar {
  border: 1px solid black;
}
.searchbar-block {
  display: flex;
  height: 3rem;
}
.searchbar-block-image {
  width: auto;
  min-height: auto;
}
</style>