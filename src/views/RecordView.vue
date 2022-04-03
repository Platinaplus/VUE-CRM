<template>
  <div>
    <div class="page-title">
      <h3>Новая запись</h3>
    </div>
    <Loader v-if="loading" />
    <p v-else-if="!categories.length" class="center">
      Категорий пока нет
      <router-link to="/categories">Добавьте категории</router-link>
    </p>
    <form class="form" v-else @submit.prevent="onSubmit">
      <div class="input-field">
        <select ref="select" v-model="category">
          <option
            v-for="option of categories"
            :key="option.id"
            :value="option.id"
          >
            {{ option.name }}
          </option>
        </select>
        <label>Выберите категорию</label>
      </div>

      <p>
        <label>
          <input
            class="with-gap"
            name="type"
            type="radio"
            value="income"
            v-model="type"
          />
          <span>Доход</span>
        </label>
      </p>

      <p>
        <label>
          <input
            class="with-gap"
            name="type"
            type="radio"
            value="cost"
            v-model="type"
          />
          <span>Расход</span>
        </label>
      </p>

      <div class="input-field">
        <input
          id="amount"
          type="number"
          v-model.number="amount"
          :class="{ invalid: v$.amount.$error }"
        />
        <label for="amount">Сумма</label>
        <span
          class="helper-text invalid"
          v-for="error of v$.amount.$errors"
          :key="error.$uid"
          >Введите сумму</span
        >
      </div>

      <div class="input-field">
        <input id="description" type="text" v-model="description" />
        <label for="description">Описание</label>
      </div>

      <button class="btn waves-effect waves-light" type="submit">
        Создать
        <i class="material-icons right">send</i>
      </button>
    </form>
  </div>
</template>

<script>
import { FormSelect, updateTextFields } from "materialize-css";
import useVuelidate from "@vuelidate/core";
import { required, minValue } from "@vuelidate/validators";
import { mapGetters } from "vuex";

export default {
  setup() {
    return { v$: useVuelidate() };
  },
  // eslint-disable-next-line vue/multi-word-component-names
  name: "record",
  data: () => ({
    categories: [],
    loading: true,
    select: null,
    category: null,
    type: "cost",
    amount: 1,
    description: "",
  }),
  validations: {
    amount: { required, minValue: minValue(1), $autoDirty: true },
  },
  async mounted() {
    this.categories = await this.$store.dispatch("fetchCategories");
    this.category = this.categories[0].id || null;
    this.loading = false;
    //для того, чтобы селект успел появиться на странице после лоадера нужен таймаут
    setTimeout(() => {
      this.select = FormSelect.init(this.$refs.select);
      updateTextFields();
    }, 0);
  },
  unmounted() {
    if (this.select && this.select.unmounted) {
      this.select.unmounted();
    }
  },
  computed: {
    ...mapGetters(["info"]),
    canCreateRecord() {
      if (this.type === "income") {
        return true;
      }
      return this.info.bill >= this.amount;
    },
  },
  methods: {
    async onSubmit() {
      const isFormCorrect = await this.v$.$validate();
      if (!isFormCorrect) return;
      if (this.canCreateRecord) {
        const formData = {
          date: new Date().toJSON(), //чтобы корректно сохранил firebase
          amount: this.amount,
          description: this.description,
          categoryId: this.category,
          type: this.type,
        };
        try {
          await this.$store.dispatch("createRecord", formData);
          const bill =
            this.type === "income"
              ? this.info.bill + this.amount
              : this.info.bill - this.amount;
          await this.$store.dispatch("updateInfo", { bill });
          this.$message(`Запись успешно создана`);
          this.v$.$reset();
          this.amount = 1;
          this.description = "";
          // eslint-disable-next-line no-empty
        } catch (e) {}
      } else {
        this.$message(
          `Недостаточно средств на счете. Не хватает ${
            this.amount - this.info.bill
          }`
        );
      }
    },
  },
};
</script>
