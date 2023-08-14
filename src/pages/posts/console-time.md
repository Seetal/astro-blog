---
layout: '../../layouts/PostLayout.astro'
title: 'JS Quick Tip: console.time'
date: 2022-04-10
tags: post
excerpt: 'Console.time allows you to quickly test how long it takes for a block of javascript to execute.'
permalink: '/posts/javascript-console-time/'

---

Say you're writing some Javascript and you have more than one way to get to the same solution and not sure which one to go with. One thing you could do is to test how long it takes for the javascript to execute using console.time().

Let's look at an example:

```js
console.time('Add 10');
const numbersArray = [1,2,3,4,5,6,7,8,9,10];

const addTenToNumber = (arr) => {
    const newArray = [];
    for (let i = 0; i < arr.length; i++) {
        newArray.push(arr[i] + 10);
    }
    console.log(newArray); // [11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
}
addTenToNumber(numbersArray);
console.timeEnd('Add 10'); // For loop: 0.200927734375 ms
```

This is a basic for loop that adds 10 to each item in the array. In the first line we start a timer and give it a name 'Add 10', this is because we can have multiple timers running at the same time. At the end we finish it with console.timeEnd('Add 10') and the console logs out the time.