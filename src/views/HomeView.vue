<template>
  <div>
    <div class="page-title">
      <h3>{{ $localize('Bill') }}</h3>

      <button class="btn waves-effect waves-light btn-small" @click="refresh">
        <i class="material-icons">refresh</i>
      </button>
    </div>
    <Loader v-if="loading" />
    <div v-else class="row">
      <HomeBill :rates="currency.rates"></HomeBill>
      <HomeCurrency
        :rates="currency.rates"
        :date="currency.date"
      ></HomeCurrency>
    </div>
  </div>
</template>

<script>
import HomeBill from "../components/app/HomeBill.vue";
import { useHead } from '@vueuse/head'
import { computed } from 'vue'
import localize from '@/utils/localize'
import HomeCurrency from "../components/app/HomeCurrency.vue";
export default {
    setup() {
    useHead({
      title: computed(() => localize('ProfileTitle'))
    })
  },
  name: "HomeView",
  data: () => ({
    loading: true,
    currency: null,
  }),
  components: {
    HomeBill,
    HomeCurrency,
  },
  async mounted() {
    this.currency = await this.$store.dispatch("fetchCurrency");
    this.loading = false;
  },
  methods: {
    async refresh() {
      this.loading = true;
      this.currency = await this.$store.dispatch("fetchCurrency");
      this.loading = false;
    },
  },
};
</script>
