import { AbstractTransitionComponent } from 'vue-transition-component';
import ContentBlockTransitionController from './ContentBlockTransitionController';
import AbstractScrollBlock from '../../util/scroll/AbstractScrollBlock';

// @vue/component
export default {
  name: 'ContentBlock',
  extends: AbstractTransitionComponent,
  mixins: [AbstractScrollBlock],
  methods: {
    handleAllComponentsReady() {
      this.transitionController = new ContentBlockTransitionController(this);
      this.isReady();
    },
  },
};
