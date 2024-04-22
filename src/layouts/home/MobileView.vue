<template>
  <v-app>
    <!-- <v-system-bar window class="test" color="surface" v-if="device != 'web'"/> -->
    <AppHeader @click:form="openForm"/>
    
    <v-main>
      {{ model }}
      <router-view class="view"/>

      <PostForm
        floating
        ref="form"
      />
    </v-main>

    <AppBottomNavigation />

    <AlertDialog />
    <ConfirmationDialog />
    <AppSnackbar />
    <SearchDialog />
  </v-app>
</template>

<script>
import { ref } from 'vue'
import AppHeader from '@/components/default/mobile/AppHeader.vue'
import AppBottomNavigation from '@/components/default/mobile/AppBottomNavigation.vue'
import SearchDialog from '@/components/search/SearchDialog.vue'
import AlertDialog from '@/components/default/AlertDialog.vue'
import ConfirmationDialog from '@/components/default/ConfirmationDialog.vue'
import AppSnackbar from '@/components/default/AppSnackbar.vue'
import PostForm from '@/components/post/PostForm.vue'
import { Device } from '@capacitor/device';
import { ScreenOrientation } from '@capacitor/screen-orientation';

export default {
  components: {
    AppHeader,
    AppBottomNavigation,
    SearchDialog,
    AlertDialog,
    ConfirmationDialog,
    AppSnackbar,
    PostForm
  },
  setup () {
    return {
      form: ref(null)
    }
  },
  data(){
    return {
      device: null,
      model: null
    }
  },
  async created(){
    const info = await Device.getInfo();

    this.device = info.platform;

    if(this.device != 'web'){
      await ScreenOrientation.lock({ orientation: 'portrait' });
    }
  },
  methods: {
    openForm () {
      this.$refs.form.dialog = true
    }
  }
}
</script>

<style>
:root {
  --inset-top: env(safe-area-inset-top);
  --inset-bottom: env(safe-area-inset-bottom);
}

/* body, */
.v-navigation-drawer,
.v-overlay__content > .v-card {
  padding-top: var(--inset-top) !important;
  padding-bottom: var(--inset-bottom) !important;
  /* border: 1px solid green; */
}

.v-app-bar:not(.v-app-bar--bottom) {
  /* padding-top: var(--inset-top) !important; */
  /* border: 1px solid red; */
}

.v-app-bar--bottom {
  padding-bottom: var(--inset-bottom) !important;
  /* border: 1px solid red; */
}

.test {
  padding-top: var(--inset-top) !important;
  /* height: var(--inset-top) !important; */
  border: 1px solid blue;
}

main {
  /* margin-top: var(--inset-top) !important;
  margin-bottom: var(--inset-bottom) !important;
  padding-top: var(--inset-top) !important;
  padding-bottom: var(--inset-bottom) !important; */
  /* border: 1px solid yellow; */
}

.view {
  /* margin-bottom: var(--inset-bottom) !important; */
  /* border: 1px solid violet; */
}
</style>