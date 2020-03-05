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
      const max = this.$el.offsetWidth - this.$refs.background.offsetWidth;
      TweenLite.set([this.$refs.background, this.$refs.title], {
        x: Math.min(max, Math.max(0, xOffset)),
      });

      // Ugly calculation to start later and speed up the text animation
      const textProgress = Math.max(0, Math.min(1, this.progress * 3 - 1));
      TweenLite.set(this.$refs.titleText, {
        backgroundPosition: `-${this.$refs.titleText.offsetWidth * textProgress}px 0`,
      });
    },
  },
};
