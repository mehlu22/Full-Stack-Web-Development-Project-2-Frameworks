<template>
  <v-app-bar max-height="55px" color="blue darken-3" dark>
    <v-spacer></v-spacer>
    <v-icon>menu</v-icon>
    <v-toolbar-title>Frameworks</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn color="blue" @click="add()">
      <v-icon>add_circle</v-icon>
      Add
    </v-btn>
  </v-app-bar>
</template>

<script>
export default {
  name: "topbar",
  emits: ["addtask"],
  methods: {
    add() {
      this.$root.$emit("addtask", true);
      document.getElementById("card").style.display = "";
    },
  },
};
</script>