import { AbstractTransitionComponent } from 'vue-transition-component';
import { TweenLite } from 'gsap';
import HeroBlockTransitionController from './HeroBlockTransitionController';
import AbstractScrollBlock from '../../util/scroll/AbstractScrollBlock';

// @vue/component
export default {
  name: 'HeroBlock',
  extends: AbstractTransitionComponent,
  mixins: [AbstractScrollBlock],
  methods: {
    handleAllComponentsReady() {
      this.transitionController = new HeroBlockTransitionController(this);
      this.isReady();
    },

    onViewUpdate(xOffset) {
      // We make the "Title" and the "Background" sticky with code here
      const max = this.$el.offsetWidth - this.$refs.background.offsetWidth;
      TweenLite.set(this.$refs.title, {
        x: Math.min(max, Math.max(0, xOffset)),
      });

      // Added some parralax at the end
      TweenLite.set(this.$refs.background, {
        x: xOffset < max ? xOffset : max + (xOffset - max) / 2,
      });

      // Ugly calculation to start later and speed up the text animation
      const textProgress = Math.max(0, Math.min(1, this.progress * 3 - 1));
      TweenLite.set(this.$refs.titleText, {
        backgroundPosition: `-${this.$refs.titleText.offsetWidth * textProgress}px 0`,
      });
    },
  },
};
