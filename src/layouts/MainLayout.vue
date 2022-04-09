<template>
  <Loader v-if="loading" />
  <div v-else class="app-main-layout">
    <Navbar @myClick="isOpen = !isOpen"></Navbar>
    <Sidebar :myProps="isOpen"  @close="closeSidebar"></Sidebar>

    <main class="app-content" :class="{ full: !isOpen }">
      <div class="app-page">
        <router-view />
      </div>
    </main>

    <div class="fixed-action-btn">
      <router-link
        class="btn-floating btn-large blue"
        to="/record"
        v-tooltip="$localize('Record_Message_Add')"
      >
        <i class="large material-icons">add</i>
      </router-link>
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/app/Navbar.vue";
import Sidebar from "@/components/app/Sidebar.vue";
import messages from "../utils/messages";

export default {
  name: "main-layout",
  components: {
    Navbar,
    Sidebar,
  },
  data: () => ({
    isOpen: window.innerWidth >= 500,
    loading: true,
  }),
  async mounted() {
    if (!Object.keys(this.$store.getters.info).length) {
      await this.$store.dispatch("fetchInfo");
    }
    this.loading = false;
  },
  computed: {
    error() {
      return this.$store.getters.error;
    },
  },
  watch: {
    error(fbError) {
      this.$error(messages[fbError.code] || "Что-то пошло не так");
    },
  },
  methods: {
    closeSidebar() {
      this.isOpen = false
    }
  }
};
</script>
