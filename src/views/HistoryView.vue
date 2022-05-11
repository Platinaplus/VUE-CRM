<template>
  <div>
    <div class="page-title">
      <h3>{{ $localize('HistoryRecord') }}</h3>
    </div>
    <Loader v-if="loading" />
    <p class="center" v-else-if="!records.length">
      {{ $localize('Record_Message_History') }}
      <router-link to="/record">{{
        $localize('Record_Message_Add')
      }}</router-link>
    </p>
    <section v-else>
      <div class="history-chart">
        <Pie :chart-options="chartOptions" :chart-data="chartData" />
      </div>
      <HistoryTable
        :records="items"
        @deleted="deleteRecord"
        @sort="sort"
      />
      <Pagination
        v-model="page"
        :records="pageCount"
        :per-page="pageSize"
        :options="{
          hideCount: true,
          theme: 'bulma',
          edgeNavigation: true,
          texts: {
            first: $localize('Start'),
            last: $localize('End'),
          },
        }"
        @paginate="pageChangeHandler"
      />
    </section>
  </div>
</template>

<script>
import paginationMixin from '@/mixins/pagination.mixin'
import HistoryTable from '@/components/app/HistoryTable.vue'
import { useHead } from '@vueuse/head'
import localize from '@/utils/localize'
import { Pie } from 'vue-chartjs'
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

export default {
  setup() {
    useHead({
      title: localize('Categories'),
    })
  },
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'history',
  mixins: [paginationMixin], //вью мержит поля миксина с полями этой страницы
  data: () => ({
    loading: true,
    records: [],
    categories: [],
    chartOptions: {
      responsive: true,
    },
    width: window.innerWidth >= 500,
  }),
  async mounted() {
    this.records = await this.$store.dispatch('fetchRecords')
    this.categories = await this.$store.dispatch('fetchCategories')
    this.setup()

    this.loading = false
  },
  methods: {
    setup() {
      //передаем массив записей в миксин как allItems
      this.setupPagination(
        (this.records = this.records.map((record, idx) => {
          return {
            ...record,
            categoryName: this.categories.find(
              (c) => c.id === record.categoryId
            ).name,
            typeClass: record.type === 'cost' ? 'red' : 'green',
            typeText:
              record.type === 'cost' ? localize('Cost') : localize('Income'),
            number: idx,
          }
        }))
      )
    },
    sortByField(field, count) {
      if(count % 2) {
      return (a, b) => (a[field] > b[field] ? 1 : -1)
      }
      return (a, b) => (a[field] < b[field] ? 1 : -1)
    },
    deleteRecord(id) {
      this.records = this.records.filter((r) => r.id != id)
      this.setup()
    },
    sort(field, count) {
      this.records = this.records.sort(this.sortByField(field, count))
      this.setup()
    },
  },
  components: {
    HistoryTable,
    Pie,
  },
  computed: {
    chartData() {
      const randomColors = function (q) {
        if (!q) {
          return
        }
        const colors = []
        for (let i = 0; i <= q; i++) {
          colors.push(
            '#' + (Math.random().toString(16) + '0000000').slice(2, 8)
          )
        }
        return colors
      }
      return {
        labels: this.categories
          .filter((c) => c.type === 'cost')
          .map((c) => c.name),
        datasets: [
          {
            label: '',
            data: this.categories.map((c) => {
              return this.records.reduce((total, r) => {
                if (r.categoryId === c.id && c.type === 'cost') {
                  total += +r.amount
                }
                return total
              }, 0)
            }),
            backgroundColor: randomColors(this.categories.length),
            borderColor: ['#fff'],
            borderWidth: 1,
          },
        ],
      }
    },
  },
}
</script>
