<template>
  <ul class="sidenav app-sidenav" :class="{ open: myProps, wide: !width }">
    <li v-for="link in links" :key="link.url" @click="onClick">
      <router-link
        :to="link.url"
        :exact="link.exact"
        active-class="active orange"
        class="pointer"
      >
        {{ $localize(link.title) }}
      </router-link>
    </li>
  </ul>
</template>

<script>
export default {
  props: ['myProps'],
  data: () => ({
    links: [
      { title: 'Bill', url: '/', exact: true },
      { title: 'History', url: '/history' },
      { title: 'Planning', url: '/planning' },
      { title: 'NewRecord', url: '/record' },
      { title: 'Categories', url: '/categories' },
    ],
    width: window.innerWidth >= 500,
  }),
  methods: {
    onClick() {
      if (!this.width) {
        this.$emit('close')
      }
    },
  },
}
</script>
