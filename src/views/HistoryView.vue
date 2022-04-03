<template>
  <div>
    <div class="page-title">
      <h3>История записей</h3>
    </div>

    <div class="history-chart">
      <canvas></canvas>
    </div>

    <section>
      <HistoryTable />
    </section>
  </div>
</template>

<script>
import HistoryTable from "@/components/app/HistoryTable.vue";
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "history",
  components: {
    HistoryTable,
  },
};
</script>
