<template>
  <v-app>
    <AppBar></AppBar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import AppBar from './components/AppBar.vue';

export default {
  name: 'App',

  data: () => ({
    //
  }),
  components: {
    AppBar,
  },
  computed: {
    userId() {
      return this.$store.state.user.id;
    },
  },
};
</script>
