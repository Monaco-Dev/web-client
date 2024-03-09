<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
    persistent
  >
    <v-card
      flat
      tile
    >
      <v-card-title class="d-flex align-center pt-3">
        <v-btn
          icon
          variant="tonal"
          flat
          size="small"
          class="mr-3"
          @click="close"
        >
          <v-icon icon="mdi-chevron-left" />
        </v-btn>

        <v-combobox
          hide-details
          prepend-inner-icon="mdi-magnify"
          menu-icon=""
          placeholder="Search"
          density="compact"
          flat
          variant="solo-filled"
          rounded
          v-model="search"
          @keyup.enter="applySearch"
        />
      </v-card-title>

      <v-card-text class="pa-0">
        <v-tabs
          v-model="tab"
          centered
          center-active
          color="primary"
          align-tabs="center"
          density="compact"
        >
          <v-tab
            value="searchAll"
            class="text-none"
            rounded="pill"
            @click="applySearch"
          >
            All
          </v-tab>
          <v-tab
            value="searchPosts"
            class="text-none"
            rounded="pill"
            @click="applySearch"
          >
            Posts
          </v-tab>
          <v-tab
            value="searchUsers"
            class="text-none"
            rounded="pill"
            @click="applySearch"
          >
            People
          </v-tab>
        </v-tabs>

        <v-window
          v-model="tab"
          class="bg-background"
        >
          <v-window-item value="searchAll">
            <SearchAll
              ref="searchAll"
              :search="search"
              @click:seeMore="tab='searchUsers'"
              class="mt-3"
            />
          </v-window-item>

          <v-window-item value="searchPosts">
            <SearchPosts
              ref="searchPosts"
              :search="search"
              class="mt-1"
            />
          </v-window-item>

          <v-window-item value="searchUsers">
            <SearchUsers
              ref="searchUsers"
              :search="search"
              class="mt-3"
            />
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { ref, computed } from 'vue'
import { useSearchStore } from '@/store/search'
import SearchAll from '@/components/search/SearchAll.vue'
import SearchPosts from '@/components/search/SearchPosts.vue'
import SearchUsers from '@/components/search/SearchUsers.vue'

export default {
  name: 'SearchDialog',
  components: {
    SearchAll,
    SearchPosts,
    SearchUsers
  },
  setup () {
    const searchStore = useSearchStore()

    const dialog = computed(() => searchStore.dialog)

    return {
      searchStore,
      dialog,
      searchAll: ref(null)
    }
  },
  data () {
    return {
      tab: null,
      search: null
    }
  },
  watch: {
    dialog () {
      if (this.dialog) {
        this.search = this.searchStore.search ?? null
        this.searchStore.reset()
        this.applySearch()
      } else {
        this.searchStore.reset()
      }
    }
  },
  methods: {
    applySearch () {
      this.$nextTick(() => {
        this.$refs[this.tab].applySearch()
      })
    },
    close () {
      this.$router.push({ query: {} })
      this.searchStore.closeDialog()
    }
  }
}
</script>
