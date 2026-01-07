---
layout: '../../layouts/PostLayout.astro'
title: 'Countdown Timer'
date: 2026-01-07
tags: javascript, web components
excerpt: 'I built a web component to create countdown timers with a ring showing the seconds tick down'
permalink: '/posts/countdown-timer/'

---

Last year I built a web app to log my workouts and create intervals, you can read about it here: [intervals and workouts app](/posts/intervals-and-workouts/). As part of the intervals section I built a visual countdown ring similar to a clock. This was built in react, but with web components being my technology of choice recently, I figured I would make this into a reusabe web component.

<style>
  .countdown-container {
    width: 30%;
    min-width: 180px;
    aspect-ratio: 1/1;
  }
  .timer {
    display: block;
    width: 100%;
    height: 100%;
    background-color: #f5f5f5;
    border-radius: 50%;
    position: relative;
    border: 0.5rem solid #f5f5f5;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
  }
  .countdown-svg {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
  .circle {
    --pi: 3.14159;
    --circumference-as-percent: calc(var(--pi) * (100% - var(--stroke-width)));
    stroke: var(--mainColor);
    stroke-width: var(--stroke-width);
    stroke-dasharray: var(--circumference-as-percent);
    stroke-dashoffset: var(--circumference-as-percent);
    transition: stroke-dashoffset 1s;
    transition-timing-function: cubic-bezier(0, 0, 1, 1);
    transform: rotate(-90deg);
    transform-origin: 50% 50%;
    r: var(--radius);
    fill: transparent;
  }
  @media (prefers-reduced-motion) {
    .circle {
      transition: none;
    }
  }
  .time-remaining {
    font-size: 4rem;
    font-family: 'scifiknights', Impact, sans-serif;
    line-height: 3rem;
    font-weight: 600;
    color: var(--black);
    text-align: center;
    margin: 0 0 0.3rem 0;
  }
  .button {
    position: relative;
    z-index: 10;
    display: block;
    padding: 0.5rem 1rem;
    background-color: var(--mainColor);
    color: #ffffff;
    font-family: "kreonregular", arial, sans-serif;
    font-size: 1rem;
    border: 0;
    border-radius: 0.25rem;
    cursor: pointer;
  }
</style>

<div class="countdown-container">
  <countdown-timer
    class="timer"
    id="timer-1"
    time="10"
    show-ring="true"
    ring-width="5"
    fluid-ring="true">
      <p class="time-remaining" data-timer role="timer"></p>
      <button class="button" data-start-btn>Start</button>
  </countdown-timer>
</div>

<template data-countdown-ring>
  <svg class="countdown-svg"><circle class="circle" cx="50%" cy="50%" /></svg>
</template>

<script src="/js/countdown-timer.js"></script>


## Usage

Code is availble at [Github](https://github.com/Seetal/Countdown-Web-Component).

Link to the countdown-timer.js file.

Add the following html:

```html
<countdown-timer
  class="timer"
  id="timer-1"
  time="20"
  show-ring="true"
  auto-start="true">
    <p class="time-remaining" data-timer role="timer"></p>
    // Optional control button below, leave out if not needed.
    <button class="button" data-start-btn>Start</button>
</countdown-timer>
```

If using the ring, add the following template to your page:

```html
  <template data-countdown-ring>
    <svg class="countdown-svg">
      <circle class="circle" cx="50%" cy="50%"/>
    </svg>
  </template>
```

## Custom complete event

When a timer finishes, a custom event is dispatched which contains the id of the timer.
You can listen for this event with:

```js
document.addEventListener('timer-complete', (event) => {
  console.log(`Timer ${event.detail} finished`);
})
```

## Attributes

### auto-start
Timer will start automatically on connectedCallback. If not set, it defaults to false and then a 'start' button will show.

### show-ring
A ring will show around the timer giving a visual representation of time passed and remaining.

### ring-width
Width of the ring, this is a number, the unit will depend on the 'fluid-ring' attribute below.

### fluid-ring
If true the ring width will be percent based. If false it will be pixel based, this means if the countdown component is in a fluid container which could be different sizes based on viewport, the proportion of the ring width to the component could change. Setting 'true' for fluid-width will always keep the proportion of the ring width the same no matter the size of the components container.


## CSS

There is some basic css which should be simple to adapt. The important part is the .circle class which is used to animate the circle svg.

With the default css the ring transitions smoothly with no stop, if you want a more ticking feel, similar to a clock, you can have a play with the transition property on the .circle class. Reducing the transition duration adding a transition delay will do this.


