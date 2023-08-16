---
layout: '../../layouts/PostLayout.astro'
title: 'Javascript Closure'
date: 2022-04-05
tags: javascript
excerpt: 'A closure is basically like a bundle of a function and any referenced variables in its lexical scope.'
permalink: '/posts/javascript-closure/'

---

Consider the below js:

```js
function hungry(val) {
    let food = val;
    function eat() {
        console.log(`I want to eat ${food}`);
    }
    return eat;
}

let timeToEat = hungry('cheesecake');

timeToEat(); // 'I want to eat cheesecake'
```

In the first line we are declaring a function, 'hungry' which requires one param. In that function we assign that param to a variable, 'food'. Under that we declare another function, 'eat', which contains a reference to the 'food' variable.  The 'food' variable is available to the 'eat' function because of lexical scope. This basically means any nested functions have access to any variable in the parent scope but not the other way round. If there was a new variable declared in the 'eat' function, it would not be available to the 'hungry' function.

The 'hungry' function returns the 'eat' function, so when we assign the hungry function to the let 'timeToEat', we get the 'eat' function returned. So we then call the 'timeToEat' function at the end and it logs out 'I want to eat cheesecake'.

But why does this work? Why does the 'timeToEat' function still have access to the 'food' variable when the outer function, 'hungry', has already finished executing? 

This is what we call a closure. When we return a function from an outer function call, the returned function will maintain a reference to any variables in its lexical scope, even after the parent function is finished executing.

An added benefit to a closure is that the variable referenced is now private, it can't be accessed anywhere else. The below returns undefined:

```js
console.log(timeToEat.food) // undefined
```

Below is another example of a closure:

```js
function multiplyNum(val) {
    let value = val;
    function multiply(anotherVal) {
        console.log(value * anotherVal);
    }
    return multiply;
}

const multiplication = multiplyNum(5);

multiplication(5); // 25
```