<template>
  <div>
    <div class="page-title">
      <h3>{{ $localize('ProfileTitle') }}</h3>
    </div>
    <form class="form" @submit.prevent="onSubmit">
      <div class="input-field">
        <input
          id="description"
          type="text"
          v-model="name"
          :class="{ invalid: v$.name.$error }"
        />
        <label for="description">{{ $localize('Name') }}</label>
        <span
          class="helper-text invalid"
          v-for="error of v$.name.$errors"
          :key="error.$uid"
          >{{ $localize('EnterName') }}</span
        >
      </div>

      <div class="switch">
        <label>
          English
          <input type="checkbox" v-model="isRuLocale" />
          <span class="lever"></span>
          Русский
        </label>
      </div>

      <button class="btn waves-effect waves-light" type="submit">
        {{ $localize('Submit') }}
        <i class="material-icons right">send</i>
      </button>
    </form>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { computed } from 'vue'
import { updateTextFields } from 'materialize-css'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { useHead } from '@vueuse/head'
import localize from '@/utils/localize'

export default {
  setup() { 
    useHead({
      title: computed(() => localize('ProfileTitle'))
    })
    return { v$: useVuelidate() }
  },
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'profile',
  data: () => ({
    name: '',
    isRuLocale: true,
  }),
  computed: {
    ...mapGetters(['info']),
  },
  mounted() {
    this.name = this.info.name
    setTimeout(() => {
      updateTextFields()
    }, 0)
    this.isRuLocale = this.info.locale === 'ru-RU'
  },
  validations: {
    name: { required, $autoDirty: true },
  },
  methods: {
    ...mapActions(['updateInfo']), //тянем метод updateInfo
    async onSubmit() {
      const isFormCorrect = await this.v$.$validate()
      if (!isFormCorrect) return

      try {
        await this.updateInfo({
          name: this.name,
          locale: this.isRuLocale ? 'ru-RU' : 'en-US',
        })
        // eslint-disable-next-line no-empty
      } catch (e) {}
    },
  },
}
</script>

<style scoped>
.switch {
  margin-bottom: 2rem;
}
</style>
