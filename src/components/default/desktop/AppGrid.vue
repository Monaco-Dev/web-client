<template>
  <v-row no-gutters>
    <v-col
      :cols="left.cols"
      v-if="$vuetify.display.mdAndUp"
    >
      <v-infinite-scroll
        v-if="left.infinite"
        height="100%"
        @load="$emit('load:left')"
        empty-text="No more result"
        style="overflow-y: hidden"
      >
        <slot name="left" />
      </v-infinite-scroll>

      <slot
        v-else
        name="left"
      />
    </v-col>

    <v-col
      :cols="center.cols"
      :md="center.md"
    >
      <v-infinite-scroll
        v-if="center.infinite"
        height="100%"
        @load="loadCenter"
        empty-text="No more result"
        style="overflow-y: hidden"
      >
        <slot name="center" />
      </v-infinite-scroll>

      <slot
        v-else
        name="center"
      />
    </v-col>

    <v-col
      :cols="right.cols"
      v-if="$vuetify.display.mdAndUp"
    >
      <v-infinite-scroll
        v-if="right.infinite"
        height="100%"
        @load="$emit('load:right')"
        empty-text="No more result"
        style="overflow-y: hidden"
      >
        <slot name="right" />
      </v-infinite-scroll>

      <slot
        v-else
        name="right"
      />
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    options: {
      type: Object,
      default: Object,
      required: false
    }
  },
  data () {
    return {
      columns: 3,
      left: {
        infinite: false,
        cols: 3
      },
      center: {
        infinite: true,
        cols: 12,
        md: 6
      },
      right: {
        infinite: false,
        cols: 3
      }
    }
  },
  mounted () {
    if (Object.keys(this.options).length) {
      this.columns = this.options?.columns ?? 3

      this.left.infinite = this.options?.left?.infinite ?? false
      this.left.cols = this.options?.cols ?? 3

      this.center.infinite = this.options?.center?.infinite ?? true
      this.center.cols = this.options?.center?.cols ?? 12
      this.center.md = this.options?.center?.md ?? 6

      this.right.infinite = this.options?.right?.infinite ?? false
      this.right.cols = this.options?.right?.cols ?? 3
    }
  },
  methods: {
    loadLeft (e) {
      this.$emit('load:left', e)
    },
    loadCenter (e) {
      this.$emit('load:center', e)
    },
    loadRight (e) {
      this.$emit('load:right', e)
    }
  }
}
</script>
