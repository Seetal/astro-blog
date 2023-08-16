---
layout: '../../layouts/PostLayout.astro'
title: 'Javascript Value vs Reference'
date: 2022-03-30
tags: javascript
excerpt: 'Value vs reference is an important concept in javascript and can be the source of many bugs if not understood correctly.'
---

## Value types

Consider the below js:

```js
let cake = 'vanilla cheesecake';
let anotherCake = cake;

console.log(cake); // cheesecake
console.log(anotherCake); // cheesecake
```

There's nothing complicated about this code but hidden in there is an important javascript concept, lets break it down.

In the first line we are creating a variable 'cake' and assigning the value of 'vanilla cheesecake' to it. This value is a string, which is a primitive. Other primitives include number, boolean, symbol, null and undefined. When you assign a primitive value to a variable, that value is saved in the memory and the variable points at that value. 

In the second line we are assigning the variable 'cake' to a new variable called 'anothercake'. When we console.log both variables we get 'cheesecake'. It would be reasonable to assume that both variables are now pointing to the same value in memory but this is not the case. Instead what happens is the value 'vanilla cheesecake' gets copied to another place in the memory and the 'anothercake' variable points to this new copied value. So both variables point to different values.

Lets test this:

```js
let cake = 'vanilla cheesecake';
let anotherCake = cake;

console.log(cake); // vanilla cheesecake
console.log(anotherCake); // vanilla cheesecake

cake = 'lemon cheesecake';

console.log(cake); // lemon cheesecake
console.log(anotherCake); // vanilla cheesecake
```

Above we are changing the value of 'cake' to 'lemon cheesecake'. When we then log out both variables, they are now different, this shows both variables are pointing to different values. Primitive values are immutable, which means they cannot be changed, so when we assigned a different value to 'cake', a new value was created in memory to which the variable 'cake' points.

## Reference types

Objects work differently to primitives, instead of pointing to the value, the variable points to an address in the memory which holds the value. 

Lets say we have:

```js
let cheesecake = { flavour: 'vanilla' };
let anotherCheesecake = cheesecake;

console.log(cheesecake); // { flavour: 'vanilla' }
console.log(anotherCheesecake); // { flavour: 'vanilla' }
```

Above we are creating a variable 'cheesecake' and assigning an object to it. The variable 'cheesecake' is now pointing to a reference, or you could call it an address in memory, which holds the object. So when we then create a new variable, 'anotherCheesecake' and assign 'cheesecake' to it, this new variable points to the same reference, so both are pointing to the same place in memory.

Lets test this:

```js
let cheesecake = { flavour: 'vanilla' };
let anotherCheesecake = cheesecake;

console.log(cheesecake); // { flavour: 'vanilla' }
console.log(anotherCheesecake); // { flavour: 'vanilla' }

cheesecake.flavour = 'lemon';

console.log(cheesecake); // { flavour: 'lemon' }
console.log(anotherCheesecake); // { flavour: 'lemon' }
```

Above we are changing the value of 'cheesecake.flavour' to 'lemon'. If we now log out both variables, they are both 'lemon' because they point to the same reference. Objects are mutable, meaning they can be changed, so when we change the value of one, any variable that is pointing to that same reference will see the new updated value.

