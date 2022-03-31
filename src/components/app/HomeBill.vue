<template>
  <div class="col s12 m6 l4">
    <div class="card light-blue bill-card">
      <div class="card-content white-text">
        <span class="card-title">Счет в валюте</span>

        <p class="currency-line" v-for="cur of currencies" :key="cur">
          <span>{{ getCurrency(cur) }}</span>
          <span>{{ cur }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["rates"],
  data: () => ({
    currencies: ["RUB", "USD", "EUR"],
  }),
  computed: {
    base() {
      return (
        this.$store.getters.info.bill / (this.rates["RUB"] / this.rates["EUR"]) //меняем базовую валюту с евро на рубли
      );
    },
  },
  methods: {
    getCurrency(currency) {
      console.log(Math.floor(this.base * this.rates[currency]));
      return Math.floor(this.base * this.rates[currency]);
    },
  },
};
</script>
