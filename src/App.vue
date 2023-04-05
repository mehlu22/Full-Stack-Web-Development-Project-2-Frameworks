<template>
  <v-app>
    <TopBar />
    <ToDo />
    <TaskCard id="card" style="display: none" :adding="this.adding" />
  </v-app>
</template>
 
<script>
import TaskCard from "./components/TaskCard";
import ToDo from "./components/ToDo";
import TopBar from "./components/TopBar";

export default {
  name: "App",
  components: {
    TaskCard,
    ToDo,
    TopBar,
  },
  mounted() {
    this.$root.$on("adder", () => {
      this.adding = false;
    });
    this.$root.$on("addtask", () => {
      this.adding = true;
      document.getElementById("card").style.display = "";
    });
    this.$root.$on("carddata", () => {
      this.$toastr.s("Task has been created!");
    });
    this.$root.$on("edittask", () => {
      this.$toastr.s("Task has been edited!");
    });
    this.$root.$on("deleted", () => {
      this.$toastr.s("Task has been removed!");
    });
  },
  data: () => ({
    adding: true,
  }),
};
</script>