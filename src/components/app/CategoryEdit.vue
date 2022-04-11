<template>
  <div class="col s12 m6">
    <div>
      <div class="page-subtitle">
        <h4>{{ $localize('Cat_Edit') }}</h4>
      </div>

      <form @submit.prevent="onSubmit">
        <div class="input-field">
          <select ref="select" v-model="current">
            <option value="" selected disabled>
              {{ $localize('Cat_Choose') }}
            </option>
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
            ref="name"
            type="text"
            v-model="name"
            @change="changed"
            :class="{ invalid: v$.name.$error }"
          />
          <label for="name" :class="{ active: current }">{{
            $localize('Cat_Title')
          }}</label>
          <span
            class="helper-text invalid"
            v-for="error of v$.name.$errors"
            :key="error.$uid"
            >{{ $localize('Cat_EnterTitle') }}</span
          >
        </div>

        <div class="input-field inline">
          <p>
            <label>
              <input
                class="with-gap"
                name="type"
                type="radio"
                value="income"
                v-model="catType"
              />
              <span>{{ $localize('Income') }}</span>
            </label>
          </p>

          <p>
            <label>
              <input
                class="with-gap"
                name="type"
                type="radio"
                value="cost"
                v-model="catType"
              />
              <span>{{ $localize('Cost') }}</span>
            </label>
          </p>
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
        <button class="btn waves-effect waves-light submit" type="submit">
          {{ $localize('Submit') }}
          <i class="material-icons right">send</i>
        </button>
        <a
          class="waves-effect waves-light btn-small red"
          @click.prevent="deleteCategory"
          ><i class="material-icons right">delete</i>Delete Category</a
        >
      </form>
    </div>
  </div>
</template>

<script>
import { FormSelect, updateTextFields } from 'materialize-css'
import useVuelidate from '@vuelidate/core'
import { required, minValue } from '@vuelidate/validators'
import localize from '@/utils/localize'

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
    catType: null,
  }),
  validations: {
    name: { required, $autoDirty: true },
    limit: { required, minValue: minValue(1), $autoDirty: true },
  },
  watch: {
    //меняет данные в инпутах в зависимости от выбранного селекта
    current(id) {
      const { name, limit, type } = this.options.find((c) => c.id === id)
      this.name = name
      this.limit = limit
      this.current = id
      this.catType = type
    },
  },
  mounted() {
    setTimeout(() => {
      this.select = FormSelect.init(this.$refs.select) //селект из материалайза
      this.catType = FormSelect.init(this.$refs.catType) //селект из материалайза
      updateTextFields()
    }, 0)
  },
  unmounted() {
    if (this.select && this.select.unmounted) {
      this.select.unmounted()
    }
    if (this.catType && this.catType.unmounted) {
      this.catType.unmounted()
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
        type: this.catType,
      }
      try {
        await this.$store.dispatch('updateCategory', formData)
        this.$message(localize('ChangeSuccess'))
        this.$emit('updated', formData)
        // eslint-disable-next-line no-empty
      } catch (e) {}
    },
    async deleteCategory() {
      try {
        await this.$store.dispatch('deleteCategory', this.current)
        this.$message(localize('DeleteSuccess'))
        this.$emit('deleted', this.current)
        // eslint-disable-next-line no-empty
      } catch (e) {}
    },
  },
}
</script>
