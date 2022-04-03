<template>
  <div class="col s12 m6">
    <div>
      <div class="page-subtitle">
        <h4>Создать</h4>
      </div>

      <form @submit.prevent="onSubmit">
        <div class="input-field">
          <input
            id="name"
            type="text"
            v-model="name"
            :class="{ invalid: v$.name.$error }"
          />
          <label for="name">Название</label>
          <span
            class="helper-text invalid"
            v-for="error of v$.name.$errors"
            :key="error.$uid"
            >Введите название категории</span
          >
        </div>

        <div class="input-field">
          <input
            id="limit"
            type="number"
            v-model.number="limit"
            :class="{ invalid: v$.limit.$error }"
          />
          <label for="limit">Лимит</label>
          <span
            class="helper-text invalid"
            v-for="error of v$.limit.$errors"
            :key="error.$uid"
            >{{ `Лимит: ${error.$message}` }}</span
          >
        </div>

        <button class="btn waves-effect waves-light" type="submit">
          Создать
          <i class="material-icons right">send</i>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { required, minValue } from "@vuelidate/validators";
import { updateTextFields } from "materialize-css";

export default {
  setup() {
    return { v$: useVuelidate() };
  },
  data: () => ({
    name: "",
    limit: 1,
  }),
  validations: {
    name: { required, $autoDirty: true },
    limit: { required, minValue: minValue(1), $autoDirty: true },
  },
  mounted() {
    updateTextFields();
  },
  methods: {
    async onSubmit() {
      const isFormCorrect = await this.v$.$validate();
      if (!isFormCorrect) return;
      const formData = {
        name: this.name,
        limit: this.limit,
      };
      try {
        const category = await this.$store.dispatch("createCategory", formData);
        this.name = '';
        this.limit = 1;
        this.v$.$reset();
        this.$message(`Категория ${category.name} успешно создана`)
        this.$emit('created', category)
        // eslint-disable-next-line no-empty
      } catch (e) {}
    },
  },
};
</script>
