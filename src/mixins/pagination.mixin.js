import _ from 'lodash';

export default {
  data() {
    return {
      page: +this.$route.query.page || 1, //в модели число приводим строку из url к числу
      pageSize: 5,
      pageCount: 0,
      allItems: [], //все что загрузили с сервера
      items: [], //только те, которые показываем
    };
  },
  methods: {
    setupPagination(allItems) {
      this.allItems = _.chunk(allItems, this.pageSize); //разбили на подмассивы с помощью лодаш
      this.pageCount = _.size(allItems);
      this.items = this.allItems[this.page - 1] || this.allItems[0];
    },
    pageChangeHandler(page) {
        this.$router.push(`${this.$route.path}?page=${page}`)
        this.items = this.allItems[page - 1] || this.allItems[0];
    },
  },
};
