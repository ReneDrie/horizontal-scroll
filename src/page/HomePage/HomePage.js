import { AbstractPageTransitionComponent } from 'vue-transition-component';
import HomePageTransitionController from './HomePageTransitionController';
import ScrollManager from '../../util/scroll/ScrollManager';
import HeroBlock from '../../component/HeroBlock';
import ContentBlock from '../../component/ContentBlock';

const TMP_COLORS = [
  { name: 'HeroBlock', color: 'blue' },
  { name: 'ContentBlock', color: 'green' },
  { name: 'ContentBlock', color: 'yellow' },
  { name: 'ContentBlock', color: 'orange' },
  { name: 'ContentBlock', color: 'red' },
  { name: 'ContentBlock', color: 'purple' },
];

// @vue/component
export default {
  name: 'HomePage',
  extends: AbstractPageTransitionComponent,
  components: {
    HeroBlock,
    ContentBlock,
  },
  data: () => ({
    blocks: TMP_COLORS,
  }),
  mounted() {
    this.scroll = new ScrollManager();
  },
  methods: {
    handleAllComponentsReady() {
      this.transitionController = new HomePageTransitionController(this);
      this.isReady();

      this.scroll.init(this.$el, this.$refs.block);
    },
  },
};
