<template>
  <div>
    <div class="page-title">
      <h3>История записей</h3>
    </div>

    <div class="history-chart">
      <canvas></canvas>
    </div>
    <Loader v-if="loading" />
    <p class="center" v-else-if="!records.length">
      Записей пока нет
      <router-link to="/record">Добавьте запись</router-link>
    </p>
    <section v-else>
      <HistoryTable :records="items" />
      <Pagination
        v-model="page"
        :records="pageCount"
        :per-page="pageSize"
        :options="{
          hideCount: true,
          theme: 'bulma',
          edgeNavigation: true,
          texts: {
            first: 'В начало',
            last: 'В конец',
          },
        }"
        @paginate="pageChangeHandler"
      />
    </section>
  </div>
</template>

<script>
import paginationMixin from "@/mixins/pagination.mixin";
import HistoryTable from "@/components/app/HistoryTable.vue";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "history",
  mixins: [paginationMixin], //вью мержит поля миксина с полями этой страницы
  data: () => ({
    loading: true,
    records: []
  }),
  async mounted() {
    this.records = await this.$store.dispatch("fetchRecords");
    const categories = await this.$store.dispatch("fetchCategories");
    
    //передаем массив записей в миксин как allItems
    this.setupPagination(
      (this.records = this.records.map((record, idx) => {
        return {
          ...record,
          categoryName: categories.find((c) => c.id === record.categoryId)
            .name,
          typeClass: record.type === "cost" ? "red" : "green",
          typeText: record.type === "cost" ? "Расход" : "Доход",
          number: idx
        };
      }))
    );
    this.loading = false;
  },
  components: {
    HistoryTable,
  },
};
</script>
