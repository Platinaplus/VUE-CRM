<template>
  <div>
    <div class="page-title">
      <h3>{{ $localize('NewRecord') }}</h3>
    </div>
    <Loader v-if="loading" />
    <p v-else-if="!categories.length" class="center">
      {{ $localize('Cat_Message') }}
      <router-link to="/categories">{{
        $localize('Cat_Message_Add')
      }}</router-link>
    </p>
    <form class="form" v-else @submit.prevent="onSubmit">
      <div class="input-field">
        <select ref="select" v-model="category">
          <option value="" selected disabled>
            {{ $localize('Cat_Choose') }}
          </option>
          <option
            v-for="option of categories"
            :key="option.id"
            :value="option.id"
          >
            {{ option.name }}
          </option>
        </select>
        <label>{{ $localize('Cat_Choose') }}</label>
      </div>
      <div v-if="type" class="label blue-text">{{ $localize('History_Type') }}: {{type}}</div>

      <div class="input-field">
        <input
          id="amount"
          type="number"
          v-model.number="amount"
          :class="{ invalid: v$.amount.$error }"
        />
        <label for="amount">{{ $localize('Amount') }}</label>
        <span
          class="helper-text invalid"
          v-for="error of v$.amount.$errors"
          :key="error.$uid"
          >{{ $localize('EnterAmount') }}</span
        >
      </div>

      <div class="input-field">
        <input id="description" type="text" v-model="description" />
        <label for="description">{{ $localize('Description') }}</label>
      </div>

      <button class="btn waves-effect waves-light" type="submit">
        {{ $localize('Create') }}
        <i class="material-icons right">send</i>
      </button>
    </form>
  </div>
</template>

<script>
import { FormSelect, updateTextFields } from 'materialize-css'
import useVuelidate from '@vuelidate/core'
import { required, minValue } from '@vuelidate/validators'
import { computed } from 'vue'
import { mapGetters } from 'vuex'
import { useHead } from '@vueuse/head'
import localize from '@/utils/localize'

export default {
  setup() {
    useHead({
      title: computed(() => localize('ProfileTitle')),
    })
    return { v$: useVuelidate() }
  },
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'record',
  data: () => ({
    categories: [],
    loading: true,
    select: null,
    category: null,
    type: null,
    amount: 1,
    description: '',
  }),
  validations: {
    amount: { required, minValue: minValue(1), $autoDirty: true },
  },
  async mounted() {
    this.categories = await this.$store.dispatch('fetchCategories')
    // this.category = (this.categories.length && this.categories[0].id) || null
    this.loading = false
    //для того, чтобы селект успел появиться на странице после лоадера нужен таймаут
    setTimeout(() => {
      this.select = FormSelect.init(this.$refs.select)
      updateTextFields()
    }, 0)
  },
  watch: {
    //меняет данные в инпутах в зависимости от выбранного селекта
    category(id) {
      if (!id) {
        return
      }
      const { type } = this.categories.find((c) => c.id === id)
      this.category = id
      this.type = type
    },
  },
  unmounted() {
    if (this.select && this.select.unmounted) {
      this.select.unmounted()
    }
  },
  computed: {
    ...mapGetters(['info']),
    canCreateRecord() {
      if (this.type === 'income') {
        return true
      }
      return this.info.bill >= this.amount
    },
  },
  methods: {
    async onSubmit() {
      const isFormCorrect = await this.v$.$validate()
      if (!isFormCorrect) return
      if (this.canCreateRecord) {
        const formData = {
          date: new Date().toJSON(), //чтобы корректно сохранил firebase
          amount: this.amount,
          description: this.description,
          categoryId: this.category,
          type: this.type,
        }
        try {
          await this.$store.dispatch('createRecord', formData)
          const bill =
            this.type === 'income'
              ? this.info.bill + this.amount
              : this.info.bill - this.amount
          await this.$store.dispatch('updateInfo', { bill })
          this.$message(`${localize('Record')} ${localize('Success')}`)
          this.v$.$reset()
          this.amount = 1
          this.description = ''
          this.category = null
          this.type = null
          setTimeout(() => {
            updateTextFields()
          }, 0)
          // eslint-disable-next-line no-empty
        } catch (e) {}
      } else {
        this.$message(
          `Недостаточно средств на счете. Не хватает ${
            this.amount - this.info.bill
          }`
        )
      }
    },
  },
}
</script>
