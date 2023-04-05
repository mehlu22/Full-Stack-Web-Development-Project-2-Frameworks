<template>
  <v-data-table
    :headers="headers"
    :items="tasks"
    :hide-default-footer="true"
    no-data-text=""
  >
    <template v-slot:[`item.isComplete`]="{ item }">
      <v-simple-checkbox color="blue" v-model="item.isComplete">
      </v-simple-checkbox>
    </template>
    <template v-slot:[`item.action`]="{ item }">
      <v-row>
        <v-btn
          v-if="item.isComplete === false"
          dark
          color="blue"
          v-model="item.isComplete"
          @click="edit(item)"
          ><v-icon>mdi-application-edit-outline</v-icon>Update</v-btn
        >
      </v-row>
      <v-row>
        <v-btn
          dark
          color="red"
          v-model="item.isComplete"
          @click="deleteitem(item)"
          ><v-icon>mdi-close-circle</v-icon>Delete</v-btn
        >
      </v-row>
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: "ToDo",
  emits: ["adder", "deleted"],
  mounted() {
    this.$root.$on("carddata", (inputs) => {
      this.tasks.push({
        title: inputs.title,
        description: inputs.description,
        deadline: inputs.dispDate,
        priority: inputs.priority,
        isComplete: false,
      });
    });
    this.$root.$on("edittask", (inputs, index) => {
      this.tasks[index].title = inputs.title;
      this.tasks[index].description = inputs.description;
      this.tasks[index].deadline = inputs.dispDate;
      this.tasks[index].priority = inputs.priority;
    });
  },
  data: () => ({
    headers: [
      { text: "Title", value: "title" },
      { text: "Description", value: "description" },
      { text: "Deadline", value: "deadline" },
      { text: "Priority", value: "priority" },
      { text: "Is Complete", value: "isComplete" },
      { text: "Action", value: "action" },
    ],
    tasks: [],
  }),
  methods: {
    edit(item) {
      this.$root.$emit("adder", item, this.tasks.indexOf(item));
      document.getElementById("card").style.display = "";
    },
    deleteitem(item) {
      this.$root.$emit("deleted", item.title);
      this.tasks.splice(this.tasks.indexOf(item), 1);
    },
  },
};
</script>