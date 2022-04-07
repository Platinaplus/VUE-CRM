<template>
  <div>
    <div class="page-title">
      <h3>{{ $localize('HistoryRecord') }}</h3>
    </div>

    <div class="history-chart">
      <Pie :chart-options="chartOptions" :chart-data="chartData" />
    </div>
    <Loader v-if="loading" />
    <p class="center" v-else-if="!records.length">
      {{ $localize('Record_Message_History') }}
      <router-link to="/record">{{
        $localize('Record_Message_Add')
      }}</router-link>
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
            typeText: record.type === 'cost' ? localize('Cost') : localize('Income'),
            number: idx,
          }
        }))
      )
    },
  },
  components: {
    HistoryTable,
    Pie,
  },
  computed: {
    chartData() {
      return {
        labels: this.categories.map((c) => c.name),
        datasets: [
          {
            label: 'Расходы по категориям',
            data: this.categories.map((c) => {
              return this.records.reduce((total, r) => {
                if (r.categoryId === c.id && r.type === 'cost') {
                  total += +r.amount
                }
                return total
              }, 0)
            }),
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
          },
        ],
      }
    },
  },
}
</script>
