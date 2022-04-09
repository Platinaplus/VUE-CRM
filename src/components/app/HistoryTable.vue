<template>
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>{{ $localize('Amount') }}</th>
        <th v-if="width">{{ $localize('Date') }}</th>
        <th>{{ $localize('Category') }}</th>
        <th>{{ $localize('History_Type') }}</th>
        <th>{{ $localize('History_Open') }}</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="(record) of records" :key="record.id">
        <td>{{ record.number + 1 }}</td>
        <td>{{ getCurrency(record.amount) }}</td>
        <td v-if="width">{{ $formatDate(record.date, 'date') }}</td>
        <td>{{ record.categoryName }}</td>
        <td>
          <span class="white-text badge" :class="[record.typeClass]">{{
            record.typeText
          }}</span>
        </td>
        <td>
          <button
            class="btn-small btn"
            @click="$router.push(`/detail-record/${record.id}`)"
            v-tooltip="$localize('History_Tooltip')"
          >
            <i class="material-icons">open_in_new</i>
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: {
    records: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    width: window.innerWidth >= 500
  }),
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
