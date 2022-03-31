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
    </div>
    <div class="card-action">
      <div>
        <button class="btn waves-effect waves-light auth-submit" type="submit">
          Войти
          <i class="material-icons right">send</i>
        </button>
      </div>

      <p class="center">
        Нет аккаунта?
        <router-link to="/register">Зарегистрироваться</router-link>
      </p>
    </div>
  </form>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { email, required, minLength } from "@vuelidate/validators";
import messages from "../utils/messages";
export default {
  setup() {
    return { v$: useVuelidate() };
  },
  data: () => ({
    email: "",
    password: "",
  }),
  validations: {
    email: { required, email, $autoDirty: true },
    password: { required, minLength: minLength(6), $autoDirty: true },
  },
  mounted() {
    if (messages[this.$route.query.message]) {
      this.$message(messages[this.$route.query.message]);
    }
  },
  methods: {
    async onSubmit() {
      const isFormCorrect = await this.v$.$validate();
      if (!isFormCorrect) return;
      const formData = {
        email: this.email,
        password: this.password,
      };
      try {
        await this.$store.dispatch("login", formData);
        this.$router.push("/");
        // eslint-disable-next-line no-empty
      } catch (e) {}
    },
  },
};
</script>
