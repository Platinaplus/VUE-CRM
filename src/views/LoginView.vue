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
    </div>
    <div class="card-action">
      <div>
        <button class="btn waves-effect waves-light auth-submit" type="submit">
          {{ $localize('Enter') }}
          <i class="material-icons right">send</i>
        </button>
      </div>

      <p class="center">
        {{ $localize('Login_NoAccount') }}
        <router-link to="/register">{{ $localize('Register') }}</router-link>
      </p>
    </div>
  </form>
</template>

<script>
import useVuelidate from '@vuelidate/core'
import { email, required, minLength } from '@vuelidate/validators'
import { computed } from 'vue'
import messages from '../utils/messages'
import { useHead } from '@vueuse/head'
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
  }),
  validations: {
    email: { required, email, $autoDirty: true },
    password: { required, minLength: minLength(6), $autoDirty: true },
  },
  mounted() {
    if (messages[this.$route.query.message]) {
      this.$message(messages[this.$route.query.message])
    }
  },
  methods: {
    async onSubmit() {
      const isFormCorrect = await this.v$.$validate()
      if (!isFormCorrect) return
      const formData = {
        email: this.email,
        password: this.password,
      }
      try {
        await this.$store.dispatch('login', formData)
        this.$router.push('/')
        // eslint-disable-next-line no-empty
      } catch (e) {}
    },
  },
}
</script>
