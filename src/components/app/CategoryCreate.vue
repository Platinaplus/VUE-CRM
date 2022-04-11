<template>
  <div class="col s12 m6 create-cat">
    <div>
      <div class="page-subtitle">
        <h4>{{ $localize('Create') }}</h4>
      </div>

      <form @submit.prevent="onSubmit">
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
          <select ref="select" v-model="type">
            <option value="" disabled selected>
              {{ $localize('ChooseType') }}
            </option>
            <option value="cost">{{ $localize('Cost') }}</option>
            <option value="income">{{ $localize('Income') }}</option>
          </select>
          <label>{{ $localize('Cat_Type') }}</label>
          <span
            class="helper-text invalid"
            v-for="error of v$.type.$errors"
            :key="error.$uid"
            >{{ `${$localize('ChooseType')}` }}</span
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
            >{{ `${$localize('Cat_Limit')}: ${error.$message}` }}</span
          >
        </div>

        <button class="btn waves-effect waves-light" type="submit">
          {{ $localize('Create') }}
          <i class="material-icons right">send</i>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import useVuelidate from '@vuelidate/core'
import { required, minValue } from '@vuelidate/validators'
import { FormSelect, updateTextFields } from 'materialize-css'
import localize from '@/utils/localize'

export default {
  setup() {
    return { v$: useVuelidate() }
  },
  data: () => ({
    name: '',
    limit: 1,
    select: null,
    type: null
  }),
  validations: {
    name: { required, $autoDirty: true },
    type: { required, $autoDirty: true },
    limit: { required, minValue: minValue(1), $autoDirty: true },
  },
  mounted() {
    updateTextFields()
    FormSelect.init(this.$refs.select) //селект из материалайза
  },
  methods: {
    async onSubmit() {
      const isFormCorrect = await this.v$.$validate()
      if (!isFormCorrect) return
      const formData = {
        name: this.name,
        limit: this.limit,
        type: this.type,
      }
      try {
        const category = await this.$store.dispatch('createCategory', formData)
        this.name = ''
        this.limit = 1
        this.type = null
        this.v$.$reset()
        this.$message(
          `${localize('Category')} ${category.name} ${localize('Success')}`
        )
        this.$emit('created', category)
        // eslint-disable-next-line no-empty
      } catch (e) {}
    },
  },
}
</script>
