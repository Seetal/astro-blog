---
layout: '../../layouts/PostLayout.astro'
title: 'Screen Wake Lock API'
date: 2026-01-14
tags: javascript
excerpt: 'A web api to stop the screen from dimming or locking as a result of inactivity.'
permalink: '/posts/screen-wake-lock-api/'

---

I recently added a timer feature to my workouts app so I can time the rests between sets, previously I would have to switch to the clock app on my iphone and set a 2 minute timer. This was annoying. The new timer worked great but there was an issue where after some time, my iphone screen would dim and then lock. The solution to this is the Screen Wake Lock Api.

Devices usually lock the screen after a specified amount of inactive time, this is done for a number of reasons including saving battery life. The screen wake lock api will prevent the screen from locking and also provides a way to release it.

I won't go into implementation details here, you can read all about that over on the mdn page, [Screen Wake Lock Api](https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API).

