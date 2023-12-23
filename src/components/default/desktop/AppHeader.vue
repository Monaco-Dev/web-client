<template>
  <v-app-bar
    elevation="1"
    app
    color="primary"
  >
    <v-row no-gutters>
      <v-col
        align-self="center"
        class="d-flex justify-start align-center"
        cols="4"
      >
        <v-card
          href="/"
          width="30%"
          class="ml-3 mr-5 bg-transparent"
          flat
        >
          <v-img
            src="@/assets/text-logo.png"
            contain
            style="filter: brightness(0%)"
          />
        </v-card>

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
          @keyup.enter="searchDialog"
        />
      </v-col>

      <v-col cols="4">
        <v-tabs
          v-model="tabValue"
          centered
          center-active
          align-tabs="center"
          :mandatory="true"
        >
          <v-tab
            to="/"
            exact
            value="Home"
            rounded="pill"
            class="text-none"
            stacked
          >
            <v-icon>mdi-home</v-icon>
            Home
          </v-tab>

          <v-tab
            to="/networks"
            value="Networks"
            rounded="pill"
            class="text-none"
            stacked
          >
            <v-icon>mdi-account-group</v-icon>
            Networks
          </v-tab>

          <v-tab
            to="/pins"
            value="Pins"
            rounded="pill"
            class="text-none"
            stacked
          >
            <v-icon>mdi-pin</v-icon>
            Pins
          </v-tab>
        </v-tabs>
      </v-col>

      <v-col
        align-self="center"
        class="text-end"
        cols="4"
      >
        <v-menu location="bottom">
          <template #activator="{ props }">
            <v-btn
              icon
              variant="outlined"
              class="mr-3"
              v-bind="props"
            >
              <v-badge
                bordered
                icon="mdi-menu-down"
                location="bottom end"
                :offset-x="5"
                :offset-y="5"
              >
                <v-avatar size="46">
                  <v-img src="https://cdn.vuetifyjs.com/images/lists/1.jpg" />
                </v-avatar>
              </v-badge>
            </v-btn>
          </template>

          <AppMenu />
        </v-menu>
      </v-col>
    </v-row>
  </v-app-bar>
</template>

<script>
import { computed } from 'vue'
import { useTabStore } from '@/store/tab'
import { useSearchStore } from '@/store/search'
import AppMenu from '@/components/default/AppMenu.vue'

export default {
  name: 'AppHeader',
  components: { AppMenu },
  setup () {
    const tabStore = useTabStore()

    const tab = computed(() => tabStore.tab)

    return {
      searchStore: useSearchStore(),
      tabStore,
      tab
    }
  },
  data () {
    return {
      tabValue: null,
      search: null
    }
  },
  watch: {
    tabValue () {
      this.tabStore.setTab(this.tab)
    },
    tab () {
      this.tabValue = this.tab
    }
  },
  methods: {
    searchDialog () {
      if (this.search) {
        this.$router.push({ query: { search: this.search } })
      } else {
        this.$router.push({ query: {} })
        this.searchStore.setSearch(null)
        this.searchStore.openDialog()
      }
    }
  }
}
</script>
