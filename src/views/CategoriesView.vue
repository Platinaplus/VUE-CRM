<template>
  <div>
    <div class="page-title">
      <h3>{{ $localize('Categories') }}</h3>
    </div>
    <section>
      <Loader v-if="loading" />
      <div class="row" v-else>
        <CategoryCreate @created="addNewCategory" />
        <CategoryEdit
          v-if="categories.length"
          :options="categories"
          :key="categories.length + updateCount"
          @updated="updateCategories"
          @deleted="deleteCategory"
        />
        <p v-else class="center">{{ $localize('Cat_Message') }}</p>
      </div>
    </section>
  </div>
</template>

<script>
import CategoryCreate from '@/components/app/CategoryCreate.vue'
import CategoryEdit from '@/components/app/CategoryEdit.vue'
import { useHead } from '@vueuse/head'
import { computed } from 'vue'
import localize from '@/utils/localize'

export default {
  setup() {
    useHead({
      title: computed(() => localize('ProfileTitle')),
    })
  },
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'categories',
  data: () => ({
    categories: [],
    loading: true,
    updateCount: 0,
  }),
  components: {
    CategoryCreate,
    CategoryEdit,
  },
  async mounted() {
    this.categories = await this.$store.dispatch('fetchCategories')
    this.loading = false
  },
  methods: {
    addNewCategory(category) {
      this.categories.push(category)
    },
    updateCategories({ id, name, limit, type }) {
      const idx = this.categories.findIndex((c) => c.id === id)
      this.categories[idx].name = name
      this.categories[idx].type = type
      this.categories[idx].limit = limit
      this.updateCount++ //для принудительного обновления данных в селекте через :key
    },
    deleteCategory(id) {
      this.categories = this.categories.filter((c) => c.id != id)
    },
  },
}
</script>
