---
layout: '../../layouts/PostLayout.astro'
title: 'Web workers'
date: 2025-04-02
tags: javascript, web workers
excerpt: 'Web workers allow you to execute javascript on a separate thread to the main thread.'
permalink: '/posts/web-workers/'

---

I recently implemented a client side inactivity timeout with javascript. After 20 mins of inactivity the next time a user interacts with the site they would be logged out and redirected to the login page.

It was a pretty straight forward implementation, a setInterval would keep track of the number of seconds since last interaction, it would get reset to 0 each time the user interacts with the page. If seconds passes 1200 then they get redirected. 

But when this went into test, there was a bug, the tester waited more than 20 mins and then interacted with the site but didn’t get redirected.

So I tested this in the testing environment, I waited more than 20 mins, it was about 24 mins during which time I browsed the web on another tab. At 24 mins I checked what number the setInterval was at in the console, it was only 700, that made no sense. 24 x 60 = 1440. Something was not right.

Having done some research, unsurprisingly I’m not the first person to have this issue. It turns out that browsers throttle javascript in background tabs to aid performance. This means intervals will either slow down or come to a complete stop, in this case it was slowing down to about half speed.

The solution was web workers.

## Single threaded

Javascript is a single threaded language. This means only one instruction can be executed at a time and instructions will be processed in order. Whilst one instruction is being executed, the main thread is blocked, this could be bad for the user experience if not managed properly.

Say you have a large calculation or some other javascript that will take some time to process. No other javascript can run until it is finished, the user cannot interact with any elements on the page.

In the example below, we have 2 buttons, clicking the ‘change colour’ button will toggle a class that will change the background colour, the ‘calculate’ button will do a large calculation that will stop any other javascript from executing. 

Try clicking the ‘change colour’ button, it works fine. Now click the ‘calculate’ button and then click the ‘change colour’ button, it won’t work until the calculation has finished.

<button class="ww-button" data-colour-btn>Change colour</button> <button class="ww-button" data-calculate-btn>Large calculation</button>

Result: <span data-result>0</span>

```js
  const colourBtn = document.querySelector('[data-colour-btn]');
  const calculateBtn = document.querySelector('[data-calculate-btn]');
  const result = document.querySelector('[data-result]');
  colourBtn.addEventListener('click', () => {
    colourBtn.classList.toggle('orange');
  });
  calculateBtn.addEventListener('click', () => {
    result.textContent = 'calculating...';
    // Double requestAnimationFrame required because the event loop runs faster than the browser refresh rate and therefore updating 'result' text is blocked until large calculation is done.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        let total = 0;
        for(let i = 0; i < 5000000000; i++) {
          total++;
        }
        result.textContent = total;
      });
    });
  });
```

<script>
  (() => {
    const colourBtn = document.querySelector('[data-colour-btn]');
    const calculateBtn = document.querySelector('[data-calculate-btn]');
    const result = document.querySelector('[data-result]');
    colourBtn.addEventListener('click', () => {
      colourBtn.classList.toggle('orange');
    });
    calculateBtn.addEventListener('click', () => {
      result.textContent = 'calculating...';

      // Double requestAnimationFrame required because the event loop runs faster than the browser refresh rate and therefor updating 'result' text is blocked until large calculation is done.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          let total = 0;
          for(let i = 0; i < 5000000000; i++) {
            total++;
          }
          result.textContent = total;
        });
      });
    });
  })();
</script>

<style>
  .ww-button {
    background-color: var(--mainColor);
    border: 0;
    padding: 0.5rem 0.8rem;
    font-family: 'kreonregular', arial, sans-serif;
    font-weight: normal;
    font-size: 1.2rem;
    color: #fff;
  }
  .orange {
    background-color: #F29F05;
  }
</style>

In a multithreaded language this wouldn’t be an issue, if one thread was busy then a different thread could be used.

In javascript we can do something similar using web workers.

## Web Workers API

Web workers allow us to execute javascript on a separate thread to the main thread. This will free up the main thread to continue executing more javascript without being blocked.

You create a worker by using a worker constructor and pass in the name of a separate javascript file.

```js
const calculateWorker = new Worker('/js/calculateWorker.js');
```

Any javascript in the worker file will run on a separate thread. The main limitation of workers is that it does not have access to the DOM but where they excel is in doing large time consuming calculations.

Communication and passing of data between the main thread and the worker thread is done using the postmessage() method and the onmessage event handler.

From the example above, we can move the large calculation to the worker file, wrap the calculation in an onmessage event handler and post the total value back to the main thread:

```js
// calculateWorker.js
onmessage = (message) => {
  let total = 0;
  for(let i = 0; i < 5000000000; i++) {
    total++;
  }
  postMessage(total);
}
```

In our main thread on clicking the calculate button we postMessage to the worker thread which will start the calculation. We also listen for a message from the worker thread:

```js
calculateBtn.addEventListener('click', () => {
  result.textContent = 'calculating...';
  calculateWorker.postMessage('This can be any data');
});

calculateWorker.onmessage = (message) => {
  result.textContent = message.data;
}
```

Now if you click the calculate button below and then click the colour button it should still work.

<button class="ww-button" data-colour-btn-b>Change colour</button> <button class="ww-button" data-calculate-btn-b>Large calculation</button>

Result: <span data-result-b>0</span>

<script>
  (() => {
    const calculateWorker = new Worker('/js/calculateWorker.js');
    const colourBtnB = document.querySelector('[data-colour-btn-b]');
    const calculateBtnB = document.querySelector('[data-calculate-btn-b]');
    const resultB = document.querySelector('[data-result-b]');
    colourBtnB.addEventListener('click', () => {
      colourBtnB.classList.toggle('orange');
    });
    calculateBtnB.addEventListener('click', () => {
      resultB.textContent = 'calculating...';
      calculateWorker.postMessage('This can be any data');
    });
    calculateWorker.onmessage = (message) => {
      resultB.textContent = message.data;
    }
  })();
</script>

Going back to the original issue with the browser throttling the javascript in background tabs. It turns out the browser only throttles javascript in the main thread so the solution is to move the timer to a worker thread. Every second the worker would postMessage and the main thread would listen for it and update the secondsElapsed variable. This worked a charm.

This was my first use case for web workers but now that I know about them I'm sure more will come up.