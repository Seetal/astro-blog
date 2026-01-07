class CountdownTimer extends HTMLElement {
  constructor() {
    super();
    this.id = this.getAttribute('id');
    this.time = Number(this.getAttribute('time'));
    this.autoStart = this.getAttribute('auto-start');
    this.updatedTime = this.time;
    this.showRing = this.getAttribute('show-ring');
    this.timerElement = this.querySelector('[data-timer]');
    this.button = this.querySelector('[data-start-btn]');
    this.interval = null;
    this.status = 'ready';
    if (this.button) {
      this.button.addEventListener('click', this);
    }
  };

  connectedCallback() {
    this.timerElement.textContent = this.time;
    if(this.showRing) {
      this.setupRing();
    }
    if(this.autoStart) {
      setTimeout(this.startTimer.bind(this), 10);
    }
  };

  setupRing() {
    const tmpl = document.querySelector('[data-countdown-ring]').content.cloneNode(true);
    const ringWidth = this.getAttribute('ring-width');

    // svg stroke is on center of element border, need to offset it so it is inside of element border
    const radiusOffset = Number(ringWidth) / 2;
    this.ringUnit = this.getAttribute('fluid-ring') ? '%' : 'px';
    this.style.setProperty('--stroke-width', `${ringWidth}${this.ringUnit}`);
    this.style.setProperty('--radius', `calc(50% - ${radiusOffset}${this.ringUnit}`);
    this.appendChild(tmpl);
    this.circle = this.querySelector('.circle');
    this.circle.style.strokeDashoffset = `calc(${this.updatedTime} * (var(--circumference-as-percent) / ${this.time}))`;
  };

  // When countdown finishes, a custom event will be dispatched.
  dispatchCompletedEvent() {
    const completeEvent = new CustomEvent('timer-complete', {
      bubbles: true,
		  detail: this.id
    })
    this.dispatchEvent(completeEvent);
  };

  updateRing(time) {
    this.circle.style.strokeDashoffset = `calc(${time} * (var(--circumference-as-percent) / ${this.time}))`;
  };

  updateTimer() {
    this.updatedTime = this.updatedTime - 1;
    this.timerElement.textContent = this.updatedTime;
    if(this.showRing && this.updatedTime > 0) {
      this.updateRing(this.updatedTime - 1);
    }
    if(this.updatedTime === 0) {
      clearInterval(this.interval);
      this.dispatchCompletedEvent();
      this.status = 'finished';
      if(this.button) {
        this.button.textContent = 'Reset';
      }
    }
  };

  startTimer() {
    this.status = 'running';
    this.interval = setInterval(this.updateTimer.bind(this), 1000);
    if(this.showRing) {
      this.updateRing(this.updatedTime - 1);
    }
  };

  resetRing() {
    this.circle.style.transition = 'none';
    this.updateRing(this.updatedTime);
    setTimeout(() => {
      this.circle.style.removeProperty('transition');
    }, 10);
  };
  
  handleEvent(event) {
    if(this.status === 'ready' || this.status === 'paused') {
      this.startTimer();
      this.button.textContent = 'Pause';
      this.button.classList.add('btn-pause');
      return;
    }
    if(this.status === 'running') {
      clearInterval(this.interval);
      this.status = 'paused';
      this.button.textContent = 'Continue';
      this.button.classList.remove('btn-pause');
      this.button.classList.add('btn-continue');
      return;
    }
    if(this.status = 'finished') {
      this.updatedTime = this.time;
      this.status = 'ready';
      this.button.textContent = 'Start';
      this.timerElement.textContent = this.updatedTime;
      if(this.showRing) {
        this.resetRing();
      }
      return;
    }
  };
}

customElements.define('countdown-timer', CountdownTimer);

document.addEventListener('timer-complete', (event) => {
  console.log(`Timer ${event.detail} finished`);
})