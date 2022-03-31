<template>
  <div>
    <div class="page-title">
      <h3>Счет</h3>

      <button class="btn waves-effect waves-light btn-small">
        <i class="material-icons">refresh</i>
      </button>
    </div>
    <Loader v-if="loading" />
    <div v-else class="row">
      <HomeBill :rates="currency.rates"></HomeBill>
      <HomeCurrency></HomeCurrency>
    </div>
  </div>
</template>

<script>
import HomeBill from "../components/app/HomeBill.vue";
import HomeCurrency from "../components/app/HomeCurrency.vue";
export default {
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
};
</script>
