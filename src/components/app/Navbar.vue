<template>
  <nav class="navbar orange lighten-1">
    <div class="nav-wrapper">
      <div class="navbar-left">
        <a href="#" @click.prevent="$emit('myClick')">
          <i class="material-icons black-text">dehaze</i>
        </a>
        <span class="black-text">{{ width ? $formatDate(date, "datetime") : $formatDate(date, "date")}}</span>
      </div>

      <ul class="right">
        <li>
          <a
            class="dropdown-trigger black-text"
            href="#"
            data-target="dropdown"
            ref="dropdown"
          >
            {{ name }}
            <i class="material-icons right">arrow_drop_down</i>
          </a>

          <ul id="dropdown" class="dropdown-content profile">
            <li>
              <router-link to="/profile" class="black-text">
                <i class="material-icons">account_circle</i>Профиль
              </router-link>
            </li>
            <li class="divider" tabindex="-1"></li>
            <li>
              <a href="#" class="black-text" @click.prevent="logout">
                <i class="material-icons">assignment_return</i>Выйти
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import { Dropdown } from 'materialize-css/dist/js/materialize'
export default {
  data: () => ({
    date: new Date(),
    interval: null,
    dropdown: null,
    width: window.innerWidth >=500
  }),
  methods: {
    async logout() {
      await this.$store.dispatch('logout')
      this.$router.push('/login?message=logout')
    },
  },
  computed: {
    name() {
      return this.$store.getters.info.name
    },
  },
  mounted() {
    this.interval = setInterval(() => {
      this.date = new Date()
    }, 1000)
    this.dropdown = Dropdown.init(this.$refs.dropdown, {
      constrainWidth: true,
    })
  },
  beforeUnmount() {
    clearInterval(this.interval)
    if (this.dropdown && this.dropdown.destroy) {
      this.dropdown.destroy()
    }
  },
}
</script>
