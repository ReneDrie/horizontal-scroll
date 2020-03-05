<style src="./HeroBlock.scss" module lang="scss"></style>
<script src="./HeroBlock.js"></script>

<template>
  <div :class="[$style.heroBlock]">
    <div ref="background" :class="$style.background" />
    <h1 ref="title" :class="$style.title">
      <span ref="titleText" data-title="Norway">Norway</span>
    </h1>
    <div :class="$style.overlay" />
  </div>
</template>
