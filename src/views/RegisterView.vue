<template>
  <form class="card auth-card" @submit.prevent="onSubmit">
    <div class="card-content">
      <span class="card-title">Домашняя бухгалтерия</span>
      <div class="input-field">
        <input
          id="email"
          type="text"
          v-model.trim="email"
          @blur="v$.email.$touch"
          :class="{
            invalid: v$.email.$error,
          }"
        />

        <label for="email">Email</label>
        <small
          class="helper-text invalid"
          v-for="error of v$.email.$errors"
          :key="error.$uid"
          >{{ `Email: ${error.$message}` }}</small
        >
      </div>
      <div class="input-field">
        <input
          id="password"
          type="password"
          v-model.trim="password"
          @blur="v$.password.$touch"
          :class="{ invalid: v$.password.$error }"
        />
        <label for="password">Пароль</label>
        <small
          class="helper-text invalid"
          v-for="error of v$.password.$errors"
          :key="error.$uid"
          >{{ `Password: ${error.$message}` }}</small
        >
      </div>
      <div class="input-field">
        <input
          id="name"
          type="text"
          v-model.trim="name"
          @blur="v$.name.$touch"
          :class="{ invalid: v$.name.$error }"
        />
        <label for="name">Имя</label>
        <small
          class="helper-text invalid"
          v-for="error of v$.name.$errors"
          :key="error.$uid"
          >{{ `Name: ${error.$message}` }}</small
        >
      </div>
      <p>
        <label>
          <input type="checkbox" v-model="agree" />
          <span>С правилами согласен</span>
        </label>
      </p>
    </div>
    <div class="card-action">
      <div>
        <button class="btn waves-effect waves-light auth-submit" type="submit">
          Зарегистрироваться
          <i class="material-icons right">send</i>
        </button>
      </div>

      <p class="center">
        Уже есть аккаунт?
        <router-link to="/login">Войти!</router-link>
      </p>
    </div>
  </form>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { email, required, minLength } from "@vuelidate/validators";

export default {
  setup() {
    return { v$: useVuelidate() };
  },
  data: () => ({
    email: "",
    password: "",
    name: "",
    agree: false,
  }),
  validations: {
    email: { required, email, $autoDirty: true },
    password: { required, minLength: minLength(6), $autoDirty: true },
    name: { required, $autoDirty: true },
    agree: { checked: (v) => v },
  },
  methods: {
    async onSubmit() {
      const isFormCorrect = await this.v$.$validate();
      if (!isFormCorrect) return;
      const formData = {
        email: this.email,
        password: this.password,
        name: this.name,
      };
      try {
        await this.$store.dispatch("register", formData);
        this.$router.push("/");
        // eslint-disable-next-line no-empty
      } catch (e) {}
    },
  },
};
</script>
