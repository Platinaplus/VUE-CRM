<template>
  <div>
    <Loader v-if="loading" />
    <div v-else-if="record">
      <div class="breadcrumb-wrap">
        <router-link to="/history" class="breadcrumb">История</router-link>
        <a @click.prevent class="breadcrumb"> {{record.type === 'cost' ? 'Расход' : 'Доход'}} </a>
      </div>
      <div class="row">
        <div class="col s12 m6">
          <div class="card" 
          :class="{
           'red': record.type === 'cost',
           'green': record.type === 'income'
          }">
            <div class="card-content white-text">
              <p>Описание: {{record.description}}</p>
              <p>Сумма: {{record.amount}}</p>
              <p>Категория: {{record.categoryName}}</p>

              <small>{{$formatDate(record.date, 'datetime')}}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
    <p class="center" v-else>Запись с id {{$route.params.id}} не существует</p>
  </div>
</template>

<script>
export default {
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
    console.log(record);
    this.loading = false;
  },
};
</script>
