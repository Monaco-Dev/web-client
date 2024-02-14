<template>
  <v-app-bar
    elevation="1"
    app
  >
    <v-row no-gutters>
      <v-col
        align-self="center"
        class="d-flex justify-start align-center"
        cols="4"
      >
        <v-card
          href="/"
          width="150"
          height="50"
          flat
          class="ml-3 mr-2 bg-transparent"
        >
          <v-img
            src="@/assets/brand.png"
            width="150"
            height="100"
            contain
          />
        </v-card>

        <v-btn
          icon="mdi-magnify"
          variant="tonal"
          size="small"
          flat
          @click="searchDialog"
        />
      </v-col>

      <v-col cols="4">
        <v-tabs
          v-model="tabValue"
          centered
          center-active
          align-tabs="center"
          :mandatory="true"
          color="primary"
        >
          <v-tab
            to="/"
            exact
            value="Home"
            rounded="pill"
            class="text-none"
          >
            <v-icon>mdi-home</v-icon>
            <v-tooltip
              activator="parent"
              location="top"
            >
              Home
            </v-tooltip>
          </v-tab>

          <v-tab
            to="/networks"
            value="Networks"
            rounded="pill"
            class="text-none"
          >
            <v-icon>mdi-account-group</v-icon>
            <v-tooltip
              activator="parent"
              location="top"
            >
              Networks
            </v-tooltip>
          </v-tab>

          <v-tab
            to="/pins"
            value="Pins"
            rounded="pill"
            class="text-none"
          >
            <v-icon>mdi-pin</v-icon>
            <v-tooltip
              activator="parent"
              location="top"
            >
              Pins
            </v-tooltip>
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
                  <v-img
                    :src="user.avatar_url"
                    cover
                  />
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
import AuthService from '@/composables/auth'

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
  computed: {
    user () {
      return AuthService.getUser()
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
