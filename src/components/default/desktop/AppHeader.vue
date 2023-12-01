<template>
  <v-app-bar
    flat
    app
    color="white"
    style="border-bottom: 1px solid lightgray !important"
  >
    <v-row no-gutters>
      <v-col
        align-self="center"
        class="d-flex justify-start align-center"
        cols="3"
      >
        <v-btn
          icon
          variant="tonal"
          href="/"
          class="mx-5"
        >
          <v-icon size="x-large">
            <template #default>
              <v-img src="@/assets/logo.png" />
            </template>
          </v-icon>
        </v-btn>

        <v-row no-gutters>
          <v-col cols="11">
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
        </v-row>
      </v-col>

      <v-col
        cols="6"
        class="px-2"
      >
        <v-tabs
          grow
          centered
          center-active
          color="primary"
          align-tabs="center"
          bg-color="white"
          :mandatory="true"
        >
          <v-tab
            to="/"
            exact
            rounded="pill"
          >
            <v-icon>mdi-home</v-icon>
          </v-tab>

          <v-tab
            to="/networks"
            exact
            rounded="pill"
          >
            <v-icon>mdi-account-group</v-icon>
          </v-tab>

          <v-tab
            to="/posts"
            exact
            rounded="pill"
          >
            <v-icon>mdi-store</v-icon>
          </v-tab>

          <v-tab
            to="/pins"
            exact
            rounded="pill"
          >
            <v-icon>mdi-pin</v-icon>
          </v-tab>
        </v-tabs>
      </v-col>

      <v-col
        align-self="center"
        class="text-end"
        cols="3"
      >
        <v-btn
          icon
          variant="tonal"
        >
          <v-badge
            bordered
            content="5"
            color="red"
          >
            <v-icon size="x-large">
              mdi-bell
            </v-icon>
          </v-badge>
        </v-btn>

        <v-menu location="bottom">
          <template #activator="{ props }">
            <v-btn
              icon
              variant="tonal"
              class="mx-5"
              v-bind="props"
            >
              <v-badge
                bordered
                icon="mdi-menu-down"
                location="bottom end"
                :offset-x="5"
                :offset-y="5"
              >
                <v-img
                  src="@/assets/default-avatar.png"
                  width="50"
                  height="50"
                />
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
import { useSearchStore } from '@/store/search'
import AppMenu from '@/components/default/AppMenu.vue'

export default {
  name: 'AppHeader',
  components: { AppMenu },
  setup () {
    return { searchStore: useSearchStore() }
  },
  data () {
    return {
      search: null
    }
  },
  methods: {
    searchDialog () {
      this.searchStore.setSearch(this.search)
      this.searchStore.openDialog()
      this.search = null
    }
  }
}
</script>
