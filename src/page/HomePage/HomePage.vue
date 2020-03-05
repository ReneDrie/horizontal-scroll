<style src="./HomePage.scss" module lang="scss"></style>
<script src="./HomePage.js"></script>

<template>
  <div :class="[$style.homePage]">
    <component
      v-for="(component, index) in blocks"
      ref="block"
      :is="component.name"
      :key="`block-${index}`"
      :style="{ backgroundColor: component.color }"
    ></component>
  </div>
</template>
