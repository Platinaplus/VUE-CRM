<template>
  <div>
    <div class="page-title">
      <h3>Планирование</h3>
      <h4>{{ getCurrency(info.bill) }}</h4>
    </div>
    <Loader v-if="loading" />
    <p v-else-if="!categories.length" class="center">Категорий пока нет</p>
    <section v-else>
      <div v-for="cat of categories" :key="cat.id">
        <p>
          <strong>{{ cat.name }}</strong>
          {{ getCurrency(cat.spend) }} из {{ getCurrency(cat.limit) }}
        </p>
        <div class="progress" v-tooltip="cat.tooltip">
          <div
            class="determinate"
            :class="[cat.progressColor]"
            :style="{ width: cat.progressPercent + '%' }"
          ></div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "planning",
  data: () => ({
    loading: true,
    categories: [],
  }),
  async mounted() {
    const records = await this.$store.dispatch("fetchRecords");
    const categories = await this.$store.dispatch("fetchCategories");
    this.categories = categories.map((cat) => {
      const spend = records
        .filter((r) => r.categoryId === cat.id) //только записи в данной категории
        .filter((r) => r.type === "cost") //только расходы
        .reduce((total, record) => {
          //сумма этих расходов
          return (total += +record.amount);
        }, 0);
      const percent = (100 * spend) / cat.limit;
      const progressPercent = percent > 100 ? 100 : percent;
      const progressColor =
        percent < 60 ? "green" : percent < 100 ? "yellow" : "red";
      const tooltipValue = cat.limit - spend
      console.log(tooltipValue);
      const tooltip = `${tooltipValue < 0 ? 'Превышение на ' : 'Осталось '} ${this.getCurrency(Math.abs(tooltipValue))}`
      return {
        ...cat,
        spend,
        progressPercent,
        progressColor,
        tooltip
      };
    });
    this.loading = false;
  },
  computed: {
    ...mapGetters(["info"]),
  },
  methods: {
    getCurrency(value) {
      return new Intl.NumberFormat("ru-Ru", {
        style: "currency",
        currency: "RUB",
      }).format(value);
    },
  },
};
</script>
