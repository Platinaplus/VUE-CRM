<template>
  <div class="col s12 m6">
    <div>
      <div class="page-subtitle">
        <h4>{{ $localize('Cat_Edit') }}</h4>
      </div>

      <form @submit.prevent="onSubmit">
        <div class="input-field">
          <select ref="select" v-model="current">
            <option
              v-for="option of options"
              :key="option.id"
              :value="option.id"
            >
              {{ option.name }}
            </option>
          </select>
          <label>{{ $localize('Cat_Choose') }}</label>
        </div>

        <div class="input-field">
          <input
            id="name"
            type="text"
            v-model="name"
            :class="{ invalid: v$.name.$error }"
          />
          <label for="name">{{ $localize('Cat_Title') }}</label>
          <span
            class="helper-text invalid"
            v-for="error of v$.name.$errors"
            :key="error.$uid"
            >{{ $localize('Cat_EnterTitle') }}</span
          >
        </div>

        <div class="input-field">
          <input
            id="limit"
            type="number"
            v-model.number="limit"
            :class="{ invalid: v$.limit.$error }"
          />
          <label for="limit">{{ $localize('Cat_Limit') }}</label>
          <span
            class="helper-text invalid"
            v-for="error of v$.limit.$errors"
            :key="error.$uid"
            >{{ `Лимит: ${error.$message}` }}</span
          >
        </div>

        <button class="btn waves-effect waves-light" type="submit">
          {{ $localize('Submit') }}
          <i class="material-icons right">send</i>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { FormSelect, updateTextFields } from 'materialize-css'
import useVuelidate from '@vuelidate/core'
import { required, minValue } from '@vuelidate/validators'

export default {
  setup() {
    return { v$: useVuelidate() }
  },
  props: {
    options: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    select: null,
    name: '',
    limit: 1,
    current: null,
  }),
  validations: {
    name: { required, $autoDirty: true },
    limit: { required, minValue: minValue(1), $autoDirty: true },
  },
  watch: {
    //меняет данные в инпутах в зависимости от выбранного селекта
    current(id) {
      const { name, limit } = this.options.find((c) => c.id === id)
      this.name = name
      this.limit = limit
      this.current = id
    },
  },
  created() {
    //сразу показывет первую категорию в списке и ее данные
    const { id, name, limit } = this.options[0]
    this.name = name
    this.limit = limit
    this.current = id
  },
  mounted() {
    updateTextFields()
    this.select = FormSelect.init(this.$refs.select) //селект из материалайза
  },
  unmounted() {
    if (this.select && this.select.unmounted) {
      this.select.unmounted()
    }
  },
  methods: {
    async onSubmit() {
      const isFormCorrect = await this.v$.$validate()
      if (!isFormCorrect) return
      const formData = {
        id: this.current,
        name: this.name,
        limit: this.limit,
      }
      try {
        await this.$store.dispatch('updateCategory', formData)
        this.$message(`Категория успешно изменена`)
        this.$emit('updated', formData)
        // eslint-disable-next-line no-empty
      } catch (e) {}
    },
  },
}
</script>
