import { TweenLite } from 'gsap';

export default {
  name: 'AbstractScrollBlock',
  data: () => ({
    isInView: false,
    progress: 0,
  }),
  methods: {
    resetView() {
      TweenLite.set(this.$el, { x: 0 });
    },
    updateView(inView, dragX, progress) {
      this.isInView = inView;
      this.progress = progress;
      if (inView) {
        TweenLite.set(this.$el, { x: dragX });

        this.onViewUpdate(Math.abs(dragX) - this.$el.offsetLeft);
      } else {
        this.resetView();
      }
    },

    onViewUpdate() {}, // Has argument "xOffset"
  },
};
