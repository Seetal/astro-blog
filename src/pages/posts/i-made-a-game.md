---
layout: '../../layouts/PostLayout.astro'
title: 'I made a game'
date: 2024-01-16
tags: javascript, typescript, scss, game
excerpt: 'It’s called BlockJham. It’s quite a simple game, you basically have to tap to swap blocks of the same size but different colours to create a full line of the same colour. '
permalink: '/posts/i-made-a-game/'

---

It’s called BlockJham, go check it out at https://block-jham.netlify.app/.

<img src="/images/blockJham.png" class="contentImage" alt="Screen shot of Blockjham game" />

It’s quite a simple game, you basically have to tap to swap blocks of the same size but different colours to create a full line of the same colour. Each completed line will reward you 100 points.

A new row is added every 7 seconds but this speeds up every 1000 points gained.

You can break blocks of 2 and 3 into smaller blocks by swiping up on them, this uses 1 assist. You start with 5 assists but gain an additional assist every 1000 points.

It works best on mobile but can also be played on a desktop browser. Swiping up to break up blocks  is currently missing on desktop, I will implement this soon, probably as a mouse right click instead.

## Accessibility feature

A common accessibility issue that often shows up is using just colour to convey information, this is an issue for colour-blindness. An example of this is when a required input field has a red border, some people who are colour-blind may not be able to see the red border. The issue with this game is you differentiate blocks by colour with no other distinguishing features. To fix this issue there is a setting that will add shapes to blocks.

<img src="/images/blockJham-accessibility.png" class="contentImage" alt="Screen shot of Blockjham game" />

## Tech stack

### Astro

I initially started building this game by using Vite to create a typescript application but it soon became evident that I needed to break up the app into smaller components to make it more manageable. So I switched to Astro. If you want the benefits of using a component architecture without the overhead of a larger js bundle then astro is the way to go. This blog was initially built with Jekyll, I then converted it to eleventy but recently changed it to Astro and found it a pleasure to use.

### Javascript with typescript

Being an SPA (Single Page App), it would be tempting to use a library like react but I wanted to practice vanilla javascript with typescript.  The js is a total of 22kb minified, 6.6kb compressed.

With it being a SPA I needed to write some js to navigate between views. I created a function called changeView which accepts 2 params, viewToHide and viewToShow. It returns a promise which is resolved when a transitionend event on viewToShow is triggered.

```js
export const changeView = (viewToHide: HTMLElement | null, viewToShow: HTMLElement | null) => {
    return new Promise((resolve) => {
        const waitForViewToShow = () => {
            viewToShow?.addEventListener('transitionend', function() {
                resolve(true);
            }, {once : true});
        };

        viewToHide?.classList.add('fade-off');
        viewToHide?.classList.remove('fade-on');
        viewToHide?.addEventListener('transitionend', function() {
            // Wait for fade off transition to end before adding 'display: none' to view
            viewToHide?.classList.add('hide');
            viewToShow?.classList.remove('hide');
            setTimeout(function() {
                viewToShow?.classList.add('fade-on');
                waitForViewToShow();
            }, 10);
        }, {once : true});
    });
};
```

### SASS

I use sass mainly for the nesting and mixins. Once css nesting is more widely supported, I may be tempted to ditch sass.

### Netlify

It’s hosted on netlify. It’s very easy to set up a new site and connect it to a GitHub repository. I can make a change in my local dev environment, commit to GitHub and netlify will automatically build and deploy the change. Usually live within 30 seconds of pushing my changes.

### Planetscale

Planetscale was very easy to implement as a database for the leaderboard. It’s got some great features such as branches and it integrates seamlessly with netlify. When connecting a netlify site to a planetscale database it automatically syncs environment variables as well. 

It was also very easy to implement netlify serverless functions to interact with planetscale.

### Additional features

There are a bunch of other features I would like to add to this game. The feature I’m most excited about implementing is an online versus mode potentially using web sockets.

