<template>
  <NavbarComponent/>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import NavbarComponent from './components/NavbarComponent.vue';

export default defineComponent({
  name: 'App',
  components: {
    NavbarComponent
  }
});
</script>

<style>
body {
  margin: 0;
}
</style>
