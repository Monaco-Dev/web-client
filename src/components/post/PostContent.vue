<template>
  <div>
    <v-chip
      density="compact"
      class="mb-3"
      variant="tonal"
      color="primary"
      label
    >
      {{ content?.type }}
      <v-tooltip
        activator="parent"
        location="top"
      >
        {{ Constants.post.types[content?.type] }}
      </v-tooltip>
    </v-chip>

    <p
      v-if="!content?.hasSummary"
      class="ma-0"
      v-html="content?.body"
    />
    <p
      v-else-if="content?.hasSummary && content?.expanded"
      class="ma-0"
      v-html="content?.body"
    />
    <p
      v-else
      class="ma-0"
      v-html="content?.summary"
    />

    <div
      class="text-center"
      v-if="content?.hasSummary"
    >
      <v-btn
        size="small"
        flat
        variant="tonal"
        class="text-none"
        @click.stop="$emit('click:seeMore')"
      >
        See {{ content?.expanded ? 'less' : 'more' }}
        <v-icon end>
          {{ content?.expanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
        </v-icon>
      </v-btn>
    </div>

    <v-slide-group
      show-arrows
      class="mt-3"
    >
      <v-slide-group-item
        v-for="tag in tags"
        :key="tag"
      >
        <v-chip
          :href="`?search=#${tag.name}`"
          size="small"
          class="mx-1"
          variant="outlined"
        >
          #{{ tag.name }}
        </v-chip>
      </v-slide-group-item>
    </v-slide-group>
  </div>
</template>

<script>
import Constants from '@/config/constants'

export default {
  props: {
    content: {
      type: Object,
      required: true
    },
    tags: {
      type: Array,
      required: true
    }
  },
  setup () {
    return { Constants }
  }
}
</script>
