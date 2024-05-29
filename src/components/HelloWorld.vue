<template>
  <nav>
    <input type="search" v-model="inputValue"/>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { getAllCardsLike } from '../Helpers/SqlHelper';

export default defineComponent({
  name: 'HelloWorld',
  props: {
    msg: String,
  },
  watch: {
    inputValue(newValue) {
      if (newValue !== null) {
        // Run your function here
        const result = getAllCardsLike(newValue, 10);
        console.log(result);
      }
    }
  },
  data() {
    return {
      inputValue: ""
    };
  },
  methods: {

  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
