<template>
  <v-dialog
    v-model="dialog"
    persistent
    scrollable
    max-width="500px"
  >
    <template
      #activator="{ props }"
      v-if="!isEdit"
    >
      <template v-if="!floating">
        <v-skeleton-loader
          type="list-item-avatar"
          v-if="loading"
        />

        <v-card
          v-else
          flat
          rounded
          :disabled="loading"
        >
          <template #prepend>
            <v-avatar color="grey">
              <v-img
                v-if="user?.avatar_url"
                :src="user?.avatar_url"
                cover
                :alt="user?.full_name"
              />
              <span
                class="text-white"
                v-else
              >
                {{ user?.first_name?.charAt(0) }}{{ user?.last_name?.charAt(0) }}
              </span>
            </v-avatar>
          </template>

          <template #title>
            <v-btn
              rounded
              flat
              color="grey"
              class="text-none justify-start"
              block
              variant="tonal"
              v-bind="props"
            >
              Create new post...
            </v-btn>
          </template>
        </v-card>
      </template>
    </template>

    <v-form @submit.prevent="submit">
      <v-card
        flat
        rounded
        density="compact"
      >
        <template #prepend>
          <v-avatar color="grey">
            <v-img
              v-if="user?.avatar_url"
              :src="user?.avatar_url"
              cover
              :alt="user?.full_name"
            />
            <span
              class="text-white"
              v-else
            >
              {{ user?.first_name?.charAt(0) }}{{ user?.last_name?.charAt(0) }}
            </span>
          </v-avatar>
        </template>

        <template #title>
          <span class="text-body-1">{{ user.full_name }}</span>
        </template>

        <template #append>
          <v-btn
            icon="mdi-close"
            flat
            variant="tonal"
            size="x-small"
            @click="reset"
          />
        </template>

        <v-card-text class="pa-0">
          <v-row class="ma-3">
            <v-col
              cols="12"
              align-self="center"
            >
              <v-select
                flat
                variant="solo-filled"
                density="comfortable"
                :items="types"
                hide-details="auto"
                item-title="title"
                item-value="value"
                v-model="form.type"
                mandatory
                label="Category"
              />
            </v-col>
          </v-row>

          <v-textarea
            v-model="form.content"
            class="mx-2"
            auto-grow
            hide-details="auto"
            flat
            placeholder="Write something..."
            rows="5"
            variant="solo"
            :max-errors="formErrors.content.length"
            :error-messages="formErrors.content"
            @blur="v$.form.content.$touch()"
          />

          <v-row class="ma-3">
            <v-col
              cols="12"
              align-self="center"
            >
              <v-combobox
                v-model="form.tags"
                :items="tags"
                label="Hashtags"
                chips
                closable-chips
                multiple
                @input="searchTags"
                hide-details="auto"
                variant="solo-filled"
                density="comfortable"
                flat
                :loading="fetching"
                clearable
                item-title="name"
                item-value="name"
                return-value="name"
                :return-object="false"
              >
                <template #chip="{ props, item }">
                  <v-chip
                    v-bind="props"
                    :text="item.name"
                  />
                </template>

                <template #item="{ props, item }">
                  <v-list-item
                    v-bind="props"
                    :subtitle="`${item.raw.taggables_count} posts`"
                    :title="`#${item.raw.name}`"
                  />
                </template>
              </v-combobox>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions class="pa-0 my-2 mx-3">
          <v-btn-primary
            type="submit"
            variant="tonal"
            class="text-none"
          >
            {{ isEdit ? 'Save changes' : 'Post' }}
          </v-btn-primary>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import { computed } from 'vue'
import { usePostStore } from '@/store/post'
import { useVuelidate } from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'
import _, { uniq } from 'lodash'
import Tag from '@/api/feed/tag'
import AuthService from '@/composables/auth'
import Post from '@/api/feed/post'
import httpException from '@/composables/http-exception'

export default {
  name: 'PostForm',
  props: {
    floating: {
      type: Boolean,
      default: false,
      required: false
    },
    isEdit: {
      type: Boolean,
      default: false,
      required: false
    },
    post: {
      type: Object,
      default: Object,
      required: false
    }
  },
  setup () {
    const postStore = usePostStore()

    const loading = computed(() => postStore.loading)

    return {
      postStore,
      loading,
      httpException,
      v$: useVuelidate()
    }
  },
  data () {
    return {
      fetching: false,
      dialog: false,
      tagMenu: false,
      form: {
        content: null,
        type: 'FS',
        tags: []
      },
      apiErrors: {
        type: [],
        content: [],
        tags: []
      },
      types: [
        {
          title: 'For sale (FS)',
          value: 'FS'
        },
        {
          title: 'For lease (FL)',
          value: 'FL'
        },
        {
          title: 'For rent (FR)',
          value: 'FR'
        },
        {
          title: 'Willing to buy (WTB)',
          value: 'WTB'
        },
        {
          title: 'Willing to lease (WTL)',
          value: 'WTL'
        },
        {
          title: 'Willing to rent (WTR)',
          value: 'WTR'
        }
      ],
      tags: []
    }
  },
  computed: {
    formErrors () {
      return {
        type: this.v$.form.type.$errors.map(v => v.$message).concat(this.apiErrors.type).filter(Boolean),
        content: this.v$.form.content.$errors.map(v => v.$message).concat(this.apiErrors.content).filter(Boolean)
      }
    },
    user () {
      return AuthService.getUser()
    }
  },
  watch: {
    'form.type' () {
      delete this.apiErrors.type
    },
    'form.content' () {
      delete this.apiErrors.content
    },
    dialog () {
      if (this.dialog) this.searchTags({})
    },
    'form.tags' () {
      this.form.tags = uniq(this.form.tags?.map((v) => (v[0] !== '#') ? `#${v}` : v))
    }
  },
  methods: {
    async submit () {
      const result = await this.v$.$validate()
      if (!result) return

      this.postStore.setLoading(true)

      const form = { ...this.form }

      form.tags = form.tags.map((v) => v.replace('#', ''))

      let action

      if (this.isEdit) {
        action = Post.update(this.post.id, form)
      } else {
        action = Post.store(form)
      }

      return action
        .then(({ data }) => {
          if (this.isEdit) {
            this.postStore.updatePost(data)
          } else {
            this.postStore.addPost(data)
          }

          this.reset()

          this.$emit('click:submit', data)
        })
        .catch(({ response }) => {
          this.loading = false

          switch (response.status) {
            case 422:
              this.apiErrors = response.data.errors
              break

            default:
              this.httpException(response)
              break
          }
        })
        .finally(() => this.postStore.setLoading(false))
    },
    onEdit () {
      this.form.content = this.post.content.original_body
      this.form.type = this.post.content.type
      this.form.tags = this.post.tags?.map((v) => v.name)
      this.dialog = true
    },
    reset () {
      this.v$.$reset()

      this.postStore.setLoading(false)

      this.fetching = false
      this.dialog = false
      this.tagMenu = false
      this.form = {
        content: null,
        type: 'FS'
      }
      this.apiErrors = {
        content: [],
        type: [],
        tags: []
      }
      this.types = [
        {
          title: 'For sale (FS)',
          value: 'FS'
        },
        {
          title: 'For lease (FL)',
          value: 'FL'
        },
        {
          title: 'For rent (FR)',
          value: 'FR'
        },
        {
          title: 'Willing to buy (WTB)',
          value: 'WTB'
        },
        {
          title: 'Willing to lease (WTL)',
          value: 'WTL'
        },
        {
          title: 'Willing to rent (WTR)',
          value: 'WTR'
        }
      ]
      this.tags = []
    },
    searchTags: _.debounce(function (val) {
      this.fetching = true

      let text = val.data ?? null

      if (text) text = text.replace('#', '')

      return Tag.search({ search: text })
        .then(({ data }) => {
          this.tags = data.data
        })
        .catch(({ response }) => this.httpException(response))
        .finally(() => { this.fetching = false })
    }, 500)
  },
  validations () {
    return {
      form: {
        type: {
          required: helpers.withMessage('This field cannot be empty', required)
        },
        content: {
          required: helpers.withMessage('This field cannot be empty', required)
        }
      }
    }
  }
}
</script>
