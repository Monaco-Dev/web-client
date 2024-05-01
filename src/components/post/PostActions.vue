<template>
  <v-menu location="bottom">
    <template #activator="{ props }">
      <v-btn
        size="small"
        variant="text"
        icon="mdi-dots-horizontal"
        v-bind="props"
      />
    </template>

    <v-card min-width="200">
      <v-list
        nav
        density="compact"
      >
        <v-list-item
          v-if="post.pinned_at && !post.deleted_at"
          link
          nav
          color="primary"
          density="compact"
          @click="unpin"
        >
          <template #prepend>
            <v-icon
              icon="mdi-pin-off"
              start
              size="small"
            />
          </template>

          <v-list-item-title> Unpin </v-list-item-title>
        </v-list-item>

        <v-list-item
          v-else-if="!post.deleted_at"
          link
          nav
          color="primary"
          density="compact"
          @click="pin"
        >
          <template #prepend>
            <v-icon
              icon="mdi-pin"
              start
              size="small"
            />
          </template>

          <v-list-item-title> Pin </v-list-item-title>
        </v-list-item>

        <v-list-item
          v-if="isAuthenticated && !post.is_shared && !post.deleted_at"
          link
          nav
          color="primary"
          density="compact"
          @click="$emit('click:edit')"
        >
          <template #prepend>
            <v-icon
              icon="mdi-pencil"
              start
              size="small"
            />
          </template>

          <v-list-item-title> Edit </v-list-item-title>
        </v-list-item>

        <v-list-item
          v-if="!isAuthenticated && !post.hidden_at"
          link
          nav
          color="primary"
          density="compact"
          @click="hide"
        >
          <template #prepend>
            <v-icon
              icon="mdi-eye-off"
              start
              size="small"
            />
          </template>

          <v-list-item-title> Hide </v-list-item-title>
        </v-list-item>

        <v-list-item
          v-if="!isAuthenticated && post.hidden_at"
          link
          nav
          color="primary"
          density="compact"
          @click="unhide"
        >
          <template #prepend>
            <v-icon
              icon="mdi-eye"
              start
              size="small"
            />
          </template>

          <v-list-item-title> Unhide </v-list-item-title>
        </v-list-item>

        <v-list-item
          v-if="isAuthenticated && !post.deleted_at"
          link
          nav
          color="primary"
          density="compact"
          @click="archive"
        >
          <template #prepend>
            <v-icon
              icon="mdi-archive"
              start
              size="small"
            />
          </template>

          <v-list-item-title> Move to archive </v-list-item-title>
        </v-list-item>

        <v-list-item
          v-if="isAuthenticated && post.deleted_at"
          link
          nav
          color="primary"
          density="compact"
          @click="restore"
        >
          <template #prepend>
            <v-icon
              icon="mdi-restore"
              start
              size="small"
            />
          </template>

          <v-list-item-title> Restore </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script>
  import AuthService from '@/composables/auth'
  import Post from '@/api/feed/post'
  import httpException from '@/composables/http-exception'
  import { useSnackbarStore } from '@/store/snackbar'

  export default {
    name: 'PostActions',
    props: {
      post: {
        type: Object,
        default: Object,
        required: true,
      },
    },
    setup() {
      return {
        httpException,
        snackbarStore: useSnackbarStore(),
      }
    },
    computed: {
      isAuthenticated() {
        return AuthService.getUser().id === this.post.user_id
      },
    },
    methods: {
      unpin() {
        this.$emit('loading', true)

        return Post.unpin(this.post.id)
          .then(({ data }) => {
            this.snackbarStore.open({
              text: 'You have unpinned a post successfully.',
              color: 'success',
            })

            this.$emit('click:unpin', new Proxy(data, {}))
          })
          .catch(({ response }) => this.httpException(response))
          .finally(() => this.$emit('loading', false))
      },
      pin() {
        this.$emit('loading', true)

        return Post.pin(this.post.id)
          .then(({ data }) => {
            this.snackbarStore.open({
              text: 'You have pinned a post successfully.',
              color: 'success',
            })

            this.$emit('click:pin', new Proxy(data, {}))
          })
          .catch(({ response }) => this.httpException(response))
          .finally(() => this.$emit('loading', false))
      },
      archive() {
        this.$emit('loading', true)

        return Post.destroy(this.post.id)
          .then(() => {
            this.snackbarStore.open({
              text: 'You have archived a post successfully.',
              color: 'success',
            })

            this.$emit('click:archive', this.post.id)
          })
          .catch(({ response }) => this.httpException(response))
          .finally(() => this.$emit('loading', false))
      },
      restore() {
        this.$emit('loading', true)

        return Post.restore(this.post.id)
          .then(() => {
            this.snackbarStore.open({
              text: 'You have restored a post successfully.',
              color: 'success',
            })

            this.$emit('click:restore', this.post.id)
          })
          .catch(({ response }) => this.httpException(response))
          .finally(() => this.$emit('loading', false))
      },
      hide() {
        this.$emit('loading', true)

        return Post.hide(this.post.id)
          .then(() => {
            this.snackbarStore.open({
              text: 'You have hide a post successfully.',
              color: 'success',
            })

            this.$emit('click:hide', this.post.id)
          })
          .catch(({ response }) => this.httpException(response))
          .finally(() => this.$emit('loading', false))
      },
      unhide() {
        this.$emit('loading', true)

        return Post.unhide(this.post.id)
          .then(({ data }) => {
            this.snackbarStore.open({
              text: 'You have unhide a post successfully.',
              color: 'success',
            })

            this.$emit('click:unpin', new Proxy(data, {}))
          })
          .catch(({ response }) => this.httpException(response))
          .finally(() => this.$emit('loading', false))
      },
    },
  }
</script>
