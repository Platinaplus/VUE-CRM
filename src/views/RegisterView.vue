<template>
  <form class="card auth-card" @submit.prevent="onSubmit">
    <div class="card-content">
      <span class="card-title">{{ $localize('AppTitle') }}</span>
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
        <label for="password">{{ $localize('Password') }}</label>
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
        <label for="name">{{ $localize('Name') }}</label>
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
          <span>{{ $localize('Agree') }}</span>
        </label>
      </p>
    </div>
    <div class="card-action">
      <div>
        <button class="btn waves-effect waves-light auth-submit" type="submit">
          {{ $localize('Register') }}
          <i class="material-icons right">send</i>
        </button>
      </div>

      <p class="center">
        {{ $localize('HaveAccount') }}
        <router-link to="/login">{{ $localize('Enter') }}</router-link>
      </p>
    </div>
  </form>
</template>

<script>
import useVuelidate from '@vuelidate/core'
import { email, required, minLength } from '@vuelidate/validators'
import { useHead } from '@vueuse/head'
import { computed } from 'vue'
import localize from '@/utils/localize'
export default {
  setup() {
    useHead({
      title: computed(() => localize('ProfileTitle'))
    })
    return { v$: useVuelidate() }
  },
  data: () => ({
    email: '',
    password: '',
    name: '',
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
      const isFormCorrect = await this.v$.$validate()
      if (!isFormCorrect) return
      const formData = {
        email: this.email,
        password: this.password,
        name: this.name,
      }
      try {
        await this.$store.dispatch('register', formData)
        this.$router.push('/')
        // eslint-disable-next-line no-empty
      } catch (e) {}
    },
  },
}
</script>
