<template>
  <v-app>
    <v-app-bar color="primary">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title
        text="Hexper"
        @click="router.push('/')"
      ></v-app-bar-title>
      <template #append>
        <v-switch
          class="d-flex align-center mx-2"
          v-model="themeSwitch"
          append-icon="mdi-theme-light-dark"
        ></v-switch>
      </template>
    </v-app-bar>
    <v-navigation-drawer color="secondary" v-model="drawer">
      <v-list>
        <v-list-group value="Experiment">
          <template #activator="{ props }">
            <v-list-item
              v-bind="props"
              title="实验项目"
              prepend-icon="mdi-test-tube"
            ></v-list-item>
          </template>
          <v-divider></v-divider>
          <v-list-item
            title="7 γ射线的吸收实验"
            @click="router.push('/experiment/7')"
          ></v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { useTheme } from 'vuetify'

const theme = useTheme()
const router = useRouter()
const drawer = ref<boolean>(false)

const themeSwitch = ref<boolean>(false)

watchEffect(() => {
  theme.global.name.value = themeSwitch.value ? 'leafDark' : 'leafLight'
})
</script>

<style scoped></style>
