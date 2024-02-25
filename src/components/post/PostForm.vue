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
          <v-sheet class="ma-3">
            <v-chip-group
              v-model="form.type"
              color="primary"
              mandatory="force"
            >
              <v-chip
                v-for="type in Object.keys(types)"
                :key="type"
                :value="type"
                density="compact"
                class="mx-2"
                variant="outlined"
              >
                {{ type }}
                <v-tooltip
                  activator="parent"
                  location="top"
                >
                  {{ types[type] }}
                </v-tooltip>
              </v-chip>
            </v-chip-group>
          </v-sheet>

          <v-menu
            v-model="tagMenu"
            transition="scale-transition"
            min-width="auto"
            offset-y
            :close-on-content-click="false"
          >
            <template #activator="{ props }">
              <v-textarea
                id="content"
                v-model="form.content"
                class="mx-2"
                autofocus
                auto-grow
                hide-details="auto"
                flat
                placeholder="Write something..."
                rows="5"
                variant="solo"
                v-bind="props"
                @input="onInput"
                :max-errors="formErrors.content.length"
                :error-messages="formErrors.content"
                @blur="v$.form.content.$touch()"
              />
            </template>

            <v-list>
              <v-list-item
                v-for="(tag, key) in tags"
                :key="key"
                link
                two-line
                @click="add(tag)"
              >
                <v-list-item-title>
                  {{ `#${tag.name.en}` }}
                </v-list-item-title>

                <v-list-item-subtitle>
                  {{ tag.taggables_count }} posts
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-menu>
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
import _ from 'lodash'
import Tag from '@/api/feed/tag'
import AuthService from '@/composables/auth'
import Constants from '@/config/constants'
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
      dialog: false,
      tagMenu: false,
      form: {
        content: null,
        type: null
      },
      apiErrors: {
        type: [],
        content: []
      },
      tags: [],
      word: ''
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
    },
    types () {
      return Constants.post.types
    }
  },
  watch: {
    'form.type' () {
      delete this.apiErrors.type
    },
    'form.content' () {
      delete this.apiErrors.content
    }
  },
  methods: {
    async submit () {
      const result = await this.v$.$validate()
      if (!result) return

      this.postStore.setLoading(true)

      let action

      if (this.isEdit) {
        action = Post.update(this.post.id, this.form)
      } else {
        action = Post.store(this.form)
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
      this.dialog = true
    },
    reset () {
      this.v$.$reset()

      this.postStore.setLoading(false)

      this.dialog = false
      this.tagMenu = false
      this.form = {
        content: null,
        type: null
      }
      this.apiErrors = {
        content: [],
        type: []
      }
      this.tags = []
      this.word = ''
    },
    async onInput () {
      const textarea = document.getElementById('content')
      const sentence = textarea.value

      let pos = textarea.selectionStart

      if (pos === undefined) {
        pos = 0
      }

      const before = sentence.substr(0, pos)
      const text = /\S+$/.exec(before)

      this.word = text ? text[0] : ''

      if (this.word.charAt(0) === '#') {
        await this.searchTags()
        this.tagMenu = true
      } else {
        this.tagMenu = false
      }
    },
    add (tag) {
      const insertText = `#${tag.name.en} `
      if (!insertText.length) return

      const textarea = document.getElementById('content')
      const sentence = textarea.value
      const len = sentence.length
      let pos = textarea.selectionStart
      if (pos === undefined) {
        pos = 0
      }

      let before = sentence.substr(0, pos)
      const after = sentence.substr(pos, len)

      before = before.substring(0, before.lastIndexOf('#'))

      this.form.content = before + insertText + after

      this.$nextTick().then(() => {
        textarea.focus()
        textarea.selectionEnd = pos + insertText.length
      })
    },
    searchTags: _.debounce(function () {
      return Tag.search({ search: this.word.replace('#', '') })
        .then(({ data }) => {
          this.tags = data.data
        })
        .catch(({ response }) => this.httpException(response))
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
