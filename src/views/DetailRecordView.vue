<template>
  <div>
    <Loader v-if="loading" />
    <div v-else-if="record">
      <div class="breadcrumb-wrap">
        <router-link to="/history" class="breadcrumb">{{ $localize('History') }}</router-link>
        <a @click.prevent class="breadcrumb"> {{record.type === 'cost' ? $localize('Cost') : $localize('Income')}} </a>
      </div>
      <div class="row">
        <div class="col s12 m6">
          <div class="card" 
          :class="{
           'red': record.type === 'cost',
           'green': record.type === 'income'
          }">
            <div class="card-content white-text">
              <p>{{ $localize('Description') }}: {{record.description}}</p>
              <p>{{ $localize('Amount') }}: {{record.amount}}</p>
              <p>{{ $localize('Category') }}: {{record.categoryName}}</p>

              <small>{{$formatDate(record.date, 'datetime')}}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
    <p class="center" v-else>{{ $localize('Record') }} id {{$route.params.id}} {{ $localize('Record_Message') }}</p>
  </div>
</template>

<script>
import { useHead } from '@vueuse/head'
import localize from '@/utils/localize'
import { computed } from 'vue'

export default {
    setup() {
    useHead({
      title: computed(() => localize('ProfileTitle'))
    })
  },
  // eslint-disable-next-line vue/multi-word-component-names
  name: "detail",
  data: () => ({
    record: null,
    loading: true,
  }),
  async mounted() {
    const record = await this.$store.dispatch(
      "fetchRecordById",
      this.$route.params.id
    ); //совпадает с написанным в роутере /:id
    const category = await this.$store.dispatch(
      "fetchCategoryById",
      record.categoryId
    );
    this.record = {
      ...record,
      categoryName: category.name,
    };
    this.loading = false;
  },
};
</script>
