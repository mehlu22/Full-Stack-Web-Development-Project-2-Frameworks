<template>
  <v-row justify="center">
    <v-col cols="16" sm="6" md="5" lg="5">
      <v-overlay>
        <v-card light>
          <v-toolbar dark color="blue">
            <v-icon v-if="adding">add_circle</v-icon>
            <v-icon v-else>mdi-application-edit-outline</v-icon>
            <v-toolbar-title v-if="adding">Add Task</v-toolbar-title>
            <v-toolbar-title v-else>Edit Task</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field
                id="title"
                outlined
                v-model="inputs.title"
                label="Title"
                v-if="adding"
                :rules="[tValidator]"
              ></v-text-field>
              <v-text-field
                id="description"
                outlined
                v-model="inputs.description"
                label="Description"
                :rules="[(value) => !!value || 'Description is required']"
              ></v-text-field>
              <v-menu
                ref="menu"
                v-model="menu"
                :close-on-content-click="false"
                :return-value.sync="inputs.deadline"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="inputs.dispDate"
                    label="Deadline"
                    append-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    outlined
                    id="date"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="inputs.deadline" no-title scrollable>
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="menu = false">
                    Cancel
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="
                      $refs.menu.save(inputs.deadline);
                      changeDisp();
                    "
                  >
                    OK
                  </v-btn>
                </v-date-picker>
              </v-menu>
              <div>Priority</div>
              <v-radio-group row id="radios" v-model="inputs.priority">
                <v-radio label="Low" value="low"></v-radio>
                <v-radio label="Med" value="med"></v-radio>
                <v-radio label="High" value="high"></v-radio>
              </v-radio-group>
            </v-form>
            <v-row>
              <v-spacer></v-spacer>
              <v-btn
                v-if="adding"
                dark
                color="blue"
                @click="submit(), validate()"
                ><v-icon>add_circle</v-icon>Add</v-btn
              >
              <v-btn v-else dark color="blue" @click="edit()">
                <v-icon>mdi-application-edit-outline</v-icon>Edit
              </v-btn>
              <v-btn dark color="red" @click="cancel()"
                ><v-icon>mdi-cancel</v-icon>Cancel</v-btn
              >
            </v-row>
          </v-card-text>
        </v-card>
      </v-overlay>
    </v-col>
  </v-row>
</template>
 
<script>
export default {
  name: "taskcard",
  emits: ["carddata", "edittask"],
  props: {
    adding: Boolean,
  },
  mounted() {
    this.$root.$on("adder", (item, itemindex) => {
      this.inputs.title = item.title;
      this.inputs.description = item.description;
      this.inputs.dispDate = item.deadline;
      let pieces = item.deadline.split("/");
      this.inputs.deadline = [pieces[2], pieces[0], pieces[1]].join("-");
      this.inputs.priority = item.priority;
      this.index = itemindex;
    });
    this.$root.$on("deleted", (item) => {
      this.titles.splice(this.titles.indexOf(item), 1);
    });
  },
  data: () => ({
    menu: false,
    inputs: {
      title: "",
      description: "",
      deadline: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      priority: "low",
      isComplete: false,
      action: "",
      dispDate: slashDate(
        new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
          .toISOString()
          .substr(0, 10)
      ),
    },
    index: 0,
    titles: [],
    valid: true,
  }),
  methods: {
    cancel() {
      this.$refs.form.resetValidation();
      document.getElementById("card").style.display = "none";
      this.inputs.title = "";
      this.inputs.description = "";
      this.inputs.deadline = new Date(
        Date.now() - new Date().getTimezoneOffset() * 60000
      )
        .toISOString()
        .substr(0, 10);
      this.inputs.dispDate = slashDate(this.inputs.deadline);
      this.inputs.priority = "low";
    },
    submit() {
      if (
        !(this.inputs.title === "") &
        !(this.inputs.description === "") &
        !this.titles.includes(this.inputs.title)
      ) {
        this.$refs.form.resetValidation();
        this.$root.$emit("carddata", this.inputs);
        this.titles.push(this.inputs.title);
        document.getElementById("card").style.display = "none";
        this.inputs.title = "";
        this.inputs.description = "";
        this.inputs.deadline = new Date(
          Date.now() - new Date().getTimezoneOffset() * 60000
        )
          .toISOString()
          .substr(0, 10);
        this.inputs.dispDate = slashDate(this.inputs.deadline);
        this.inputs.priority = "low";
      }
    },
    edit() {
      if (!(this.inputs.description === "")) {
        this.$refs.form.resetValidation();
        this.$root.$emit("edittask", this.inputs, this.index);
        document.getElementById("card").style.display = "none";
        this.inputs.title = "";
        this.inputs.description = "";
        this.inputs.deadline = new Date(
          Date.now() - new Date().getTimezoneOffset() * 60000
        )
          .toISOString()
          .substr(0, 10);
        this.inputs.dispDate = slashDate(this.inputs.deadline);
        this.inputs.priority = "low";
      }
    },
    changeDisp() {
      this.inputs.dispDate = slashDate(this.inputs.deadline);
    },
    tValidator(val) {
      if (!val) {
        return "Title is required.";
      } else if (this.titles.includes(val)) {
        return "Title must be unique.";
      } else {
        return true;
      }
    },
    validate() {
      this.$refs.form.validate();
    },
  },
};

function slashDate(date) {
  let dateArr = date.split("-");
  return [dateArr[1], dateArr[2], dateArr[0]].join("/");
}
</script>