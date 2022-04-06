<template>
  <ul class="sidenav app-sidenav" :class="{ open: myProps }">
    <router-link
      v-for="link in links"
      :key="link.url"
      :to="link.url"
      active-class="active"
      :exact="link.exact"
    >
      <li>
        <a href="#" class="waves-effect waves-orange pointer">
          {{ $localize(link.title) }}
        </a>
      </li>
    </router-link>
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
  }),
}
</script>
