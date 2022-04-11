<template>
  <div class="scroll-wrapper">
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th class="sort" @click="sort('amount')">
            {{ $localize('Amount')
            }}<i class="tiny material-icons">{{
              count.amount % 2 ? 'arrow_downward' : 'arrow_upward'
            }}</i>
          </th>
          <th class="sort" @click="sort('date')">
            {{ $localize('Date')
            }}<i class="tiny material-icons">{{
              count.date % 2 ? 'arrow_downward' : 'arrow_upward'
            }}</i>
          </th>
          <th class="sort">
            {{ $localize('Category') }}
          </th>
          <th class="sort" @click="sort('type')">
            {{ $localize('History_Type')
            }}<i class="tiny material-icons">{{
              count.type % 2 ? 'arrow_downward' : 'arrow_upward'
            }}</i>
          </th>
          <th>{{ $localize('History_Open') }}</th>
          <th>{{ $localize('Delete') }}</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="record of records" :key="record.id">
          <td>{{ record.number + 1 }}</td>
          <td>{{ getCurrency(record.amount) }}</td>
          <td v-if="width">{{ $formatDate(record.date, 'datetime') }}</td>
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
          <td>
            <button
              class="btn-small btn"
              @click="deleteRecord(record.id, $event)"
              v-tooltip="$localize('Delete')"
            >
              <i class="material-icons">delete</i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import localize from '@/utils/localize'
export default {
  props: {
    records: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    width: window.innerWidth >= 500,
    count: {
      type: 0,
      amount: 0,
      date: 0,
      category: 0,
    },
  }),
  methods: {
    getCurrency(value) {
      return new Intl.NumberFormat('ru-Ru', {
        style: 'currency',
        currency: 'RUB',
      }).format(value)
    },
    async deleteRecord(id) {
      try {
        await this.$store.dispatch('deleteRecord', id)
        this.$message(localize('DeleteRecordSuccess'))
        this.$emit('deleted', id)
        // eslint-disable-next-line no-empty
      } catch (e) {}
    },
    sort(field) {
      this.count[field]++
      this.$emit('sort', field, this.count[field])
    },
  },
}
</script>
