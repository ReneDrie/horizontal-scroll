<style src="./App.scss" module lang="scss"></style>
<script src="./App.js"></script>

<template>
  <main :class="[$style.app]">
    <transition @leave="onLeave">
      <router-view />
    </transition>
  </main>
</template>
