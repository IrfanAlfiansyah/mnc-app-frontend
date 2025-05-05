<template>
  <div id="app" class="container-fluid">
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "App",
  components: {},
});
</script>

<style scoped>
#app {
  padding: 0;
  margin: 0;
}
</style>
