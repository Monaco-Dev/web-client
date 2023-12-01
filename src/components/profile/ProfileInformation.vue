<template>
  <v-skeleton-loader
    v-if="loading || !Object.keys(profile).length"
    boilerplate
    type="avatar, article"
  />

  <v-card
    v-else
    flat
    rounded
  >
    <template #prepend>
      <v-avatar size="100">
        <v-img
          src="@/assets/default-avatar.png"
        />
      </v-avatar>
    </template>

    <template #title>
      <span class="text-h5">{{ profile.full_name }}</span>
    </template>

    <template #subtitle>
      <v-chip-group>
        <v-chip>
          {{ profile.connections_count }} Connections
        </v-chip>

        <v-chip>
          {{ profile.followers_count }} Followers
        </v-chip>

        <v-chip v-if="auth">
          {{ profile.following_count }} Following
        </v-chip>
      </v-chip-group>
    </template>

    <template #append>
      <v-btn
        v-if="auth"
        size="small"
        variant="tonal"
        icon="mdi-pencil"
        to="/settings/profile"
      />
    </template>

    <v-card-text>
      <v-container
        fluid
        v-if="!auth"
      >
        <v-row>
          <v-col cols="6">
            <UserAction :user="profile" />
          </v-col>
        </v-row>
      </v-container>

      <v-list v-if="auth || profile.is_connection">
        <v-list-item v-if="profile.phone_number">
          <template #prepend>
            <v-icon
              icon="mdi-phone"
              start
              size="small"
            />
          </template>

          <v-list-item-title>
            {{ profile.phone_number }}
          </v-list-item-title>
        </v-list-item>

        <v-list-item v-if="profile.email">
          <template #prepend>
            <v-icon
              icon="mdi-email"
              start
              size="small"
            />
          </template>

          <v-list-item-title>
            {{ profile.email }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script>
import { computed } from 'vue'
import { useProfileStore } from '@/store/profile'
import AuthService from '@/composables/auth'
import httpException from '@/composables/http-exception'
import User from '@/api/auth/user'
import UserAction from '@/components/user/UserAction.vue'

export default {
  name: 'ProfileInformation',
  components: { UserAction },
  setup () {
    const profileStore = useProfileStore()

    const profile = computed(() => profileStore.profile)
    const loading = computed(() => profileStore.loading)

    return {
      httpException,
      profileStore,
      profile,
      loading
    }
  },
  data () {
    return {
      slug: null
    }
  },
  computed: {
    auth () {
      return AuthService.getUser().slug === this.profileStore.profile.slug
    }
  },
  async mounted () {
    this.profileStore.reset()

    this.slug = this.$router.currentRoute.value.params.slug

    if (!this.slug) this.$router.push({ name: 'PageNotFound' }).catch(() => {})

    this.profileStore.setProfile(await this.init())
  },
  methods: {
    init () {
      this.profileStore.setLoading(true)

      return User.show(this.slug)
        .then(({ data }) => data)
        .catch(({ response }) => {
          if (response.status === 404) {
            this.$router.push({ name: 'PageNotFound' }).catch(() => {})
          } else {
            this.httpException(response)
          }
        })
        .finally(() => this.profileStore.setLoading(false))
    },
    connect () {
      //
    },
    disconnect () {
      //
    },
    follow () {
      //
    },
    unfollow () {
      //
    },
    accept () {
      //
    }
  }
}
</script>
