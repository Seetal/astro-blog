---
layout: '../../layouts/PostLayout.astro'
title: 'Intervals & Workouts app'
date: 2024-05-03
tags: javascript, typescript, scss, game
excerpt: 'It’s called BlockJham. It’s quite a simple game, you basically have to tap to swap blocks of the same size but different colours to create a full line of the same colour. '
permalink: '/posts/intervals-and-workouts-app/'

---

I built a browser based app to create intervals and log workouts. Check it out over at [intervals-workouts.pages.dev](https://intervals-workouts.pages.dev).

<img src="/images/interval-workouts.webp" class="contentImage" alt="Screen shot of intervals and workouts app" />

It's built with Vite, React, Typescript and SCSS modules. This was also the first time I have tried Storybook. There is no database or authentication, it uses local storage to store data. Hosting is at cloudflare pages.

The code is over at [github.com/Seetal/Workouts](https://github.com/Seetal/Workouts).

There are a number of other features I would like to add such as a stats page and data export and import for when a user gets a new device.


