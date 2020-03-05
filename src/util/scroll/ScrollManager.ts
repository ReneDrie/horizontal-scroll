import EventDispatcher from 'seng-event';
import { DisposableManager } from 'seng-disposable-manager';
import KeyCodes from 'seng-keycodes';
import lerp from 'lerp';
import MouseWheel from 'mouse-wheel';
import { TweenLite } from 'gsap';
import Draggable from 'gsap/Draggable';
import ThrowPropsPlugin from '../../vendor/gsap/ThrowPropsPlugin';
import { DisposableEventListener } from 'seng-disposable-event-listener';
import { IAbstractTransitionComponent } from 'vue-transition-component';

// tslint:disable
ThrowPropsPlugin;

interface IPosition {
  start: number;
  end: number;
}

export default class ScrollManager extends EventDispatcher {
  private static ARROW_STEP_SIZE: number = 25;

  private dragProxy: HTMLElement | null = null;
  private wrapper: HTMLElement | null = null;
  private elements: IAbstractTransitionComponent[] = [];
  private positions: IPosition[] = [];

  // @ts-ignore
  private dragger: Draggable | null = null;

  private currentX: number = 0;
  private targetX: number = 0;

  private isDragging: boolean = false;

  private disposables: DisposableManager = new DisposableManager();
  private wheelListener: EventListener | null = null;

  private raf: any;

  public init(wrapper: HTMLElement, elements: IAbstractTransitionComponent[]): void {
    this.wrapper = wrapper;
    this.elements = elements;

    this.createDragger();
    this.addKeyEvents();

    this.setPositions();

    this.tick();
  }

  private addKeyEvents(): void {
    this.disposables.add(
      new DisposableEventListener(window, 'keydown', this.handleKeyDown.bind(this)),
    );
    this.disposables.add(
      new DisposableEventListener(window, 'resize', this.handleResize.bind(this)),
    );
    this.wheelListener = MouseWheel(window, (dx: number, dy: number) => this.updateDragger(-dy));
  }

  // Check for KeyDown code event and Update the dragger + scroll Manually
  private handleKeyDown(event: Event): void {
    const { keyCode } = event as KeyboardEvent;

    switch (keyCode) {
      case KeyCodes.LEFT:
      case KeyCodes.UP:
        this.updateDragger(ScrollManager.ARROW_STEP_SIZE);
        break;
      case KeyCodes.RIGHT:
      case KeyCodes.DOWN:
        this.updateDragger(-ScrollManager.ARROW_STEP_SIZE);
        break;
      case KeyCodes.PAGE_UP:
        this.updateDragger(window.innerWidth);
        break;
      case KeyCodes.PAGE_DOWN:
        this.updateDragger(-window.innerWidth);
        break;
      case KeyCodes.SPACE:
        this.updateDragger(-window.innerWidth * 0.5);
        break;
    }
  }

  private handleResize(): void {
    this.elements.forEach(component => (<any>component).resetView());

    // TODO: Currently Always returning to start. Save the current position somehwere and go there
    if (this.dragger) {
      this.updateDragger(-this.dragger.minX);
      this.dragger.applyBounds(this.bounds);
    }

    this.setPositions();
  }

  // Set the block positions (please also call on resize)
  private setPositions(): void {
    this.positions = this.elements.map(element => ({
      start: (<HTMLElement>element.$el).offsetLeft,
      end: (<HTMLElement>element.$el).offsetLeft + (<HTMLElement>element.$el).offsetWidth,
    }));
  }

  // Create the dragger on a new "Proxy" element
  private createDragger(): void {
    this.dragProxy = document.createElement('div');
    [this.dragger] = Draggable.create(this.dragProxy, {
      type: 'x',
      trigger: this.elements.map(component => component.$el),
      throwProps: true,
      bounds: this.bounds,
      onDragStart: () => {
        this.isDragging = true;
      },
      onDrag: this.handleDrag.bind(this),
      onThrowUpdate: this.handleDrag.bind(this),
      onThrowComplete: () => {
        this.isDragging = false;
      },
    });
  }

  // Get the bounds for the Dragger
  private get bounds(): { minX: number; maxX: number } {
    return {
      minX: this.wrapper === null ? 0 : -(this.wrapper.scrollWidth - this.wrapper.offsetWidth),
      maxX: 0,
    };
  }

  // Update the Target X on Drag/Throw Update
  private handleDrag(): void {
    this.targetX = this.dragger !== null ? this.dragger.x : 0;
  }

  // Manually update the dragger and proxy element X. After that, call the Drag
  private updateDragger(position: number): void {
    if (this.dragProxy && this.dragger) {
      this.isDragging = false;
      TweenLite.set(this.dragProxy, {
        x: Math.max(this.dragger.minX, Math.min(this.dragger.x + position, this.dragger.maxX)),
      });
      this.dragger.update();
      this.handleDrag();
    }
  }

  // The real "Scrolling" every frame. Also update the individual scrolling blocks
  private tick(): void {
    this.raf = window.requestAnimationFrame(this.tick.bind(this));

    this.currentX = ScrollManager.round(
      lerp(this.currentX, this.targetX, this.isDragging ? 1 : 0.1),
    );

    const absolutePosition = Math.abs(this.currentX);
    const { innerWidth } = window;

    this.positions.forEach((position, index) => {
      const inView =
        absolutePosition >= position.start - innerWidth && absolutePosition <= position.end;
      const progress = Math.max(
        0,
        Math.min(
          1,
          ScrollManager.round(
            ScrollManager.normalizedValue(
              absolutePosition,
              position.start - innerWidth,
              position.end,
            ),
          ),
        ),
      );
      (<any>this.elements[index]).updateView(inView, this.currentX, progress);
    });
  }

  public static normalizedValue(value: number, min: number, max: number): number {
    const diff: number = max - min;
    if (diff === 0) return min;
    return (1 / diff) * (value - min);
  }

  private static round(value: number): number {
    return Math.round(value * 1000) / 1000;
  }

  public dispose(): void {
    window.cancelAnimationFrame(this.raf);

    if (this.wheelListener !== null) {
      window.removeEventListener('wheel', this.wheelListener);
      this.wheelListener = null;
    }

    this.disposables.dispose();
  }
}
