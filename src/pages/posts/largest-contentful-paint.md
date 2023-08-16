---
layout: '../../layouts/PostLayout.astro'
title: 'Largest Contentful Paint - LCP - One of the Core Web Vitals'
date: 2022-04-21
tags: post
excerpt: 'One of the 3 Core Web Vitals (CWV), web.dev defines LCP as: ‘The Largest Contentful Paint (LCP) metric reports the render time of the largest image or text block visible within the viewport, relative to when the page first started loading’'
permalink: '/posts/largest-contentful-paint/'
---

One of the 3 Core Web Vitals (CWV), web.dev defines LCP as: 

<strong>‘The Largest Contentful Paint (LCP) metric reports the render time of the largest image or text block visible within the viewport, relative to when the page first started loading’</strong>.

It is an important performance metric, not only because CWV now affects google rankings but also for user experience. So how can we improve LCP? Let’s get into it.

## Server side not client side

First of all make sure the LCP element is not rendered client side. With the rise of frameworks, react, vue, etc, it is easy to rely on javascript to render some of the dom client side when it doesn’t need to be. This is also true of vanilla js.

I’ve recently been working on improving the performance of a site which used vanilla js and jQuery to generate separate link and script tags for each component on the page. This was done by traversing the dom and grabbing every data-module attribute which was on each component. It would then add these link and script tags to the head of the document and only then load the css and js files. This was all done client side. The LCP for most pages on that site for mobile was about 20 seconds, just removing this functionality alone reduced the LCP to about 7 seconds.

Regarding frameworks, don’t get me wrong, they have their use cases but quite often they are used when they don’t need to be.

## Reduce render blocking requests

This tip is a more generic performance tip but has a large effect on LCP.

It’s not uncommon to find html similar to the below in the head of the document:

```html
<link rel="stylesheet" href="styles.min.css">
<script src="main.min.js"></script>
```

The issue with this code is it is render blocking. This basically means when the browser is parsing the html and finds a link to a css or javascript file, it will request these files but during this time the rendering of the page is paused. Only when these files are returned will the dom start rendering. This increases your LCP load time.

So how do we fix this? If it is a script tag then you can load it asynchronously with either the ‘async’ or ‘defer’ attributes as shown below:

```html
<script async src="main.min.js"></script>
<script defer src="main.min.js"></script>
```

Although both these attributes load the scripts asynchronously, there are important differences.

‘async’ will load the script in the background and then execute it as soon as it is loaded and ready. This could mean if you have multiple script files then they might not be executed in the same order they are in the dom.

‘defer’ on the other hand will again load the script in the background but won’t execute it until the document has been parsed. Also, defer scripts are executed in the same order they are in the dom.

With CSS files it’s a little more complicated. ‘async’ and ‘defer’ aren’t available for ‘link’ tags so we need a different method to load these asynchronously. Previously this was done with some javascript but the awesome devs at filament group came up with a little trick:

```html
<link rel="stylesheet" href="style.css" media="print" onload="this.media='all'">
```

To read the full article about this pop over to <a href="https://www.filamentgroup.com/lab/load-css-simpler/">https://www.filamentgroup.com/lab/load-css-simpler/</a>. Basically what’s happening is by adding media=“print”, the browser loads the file asynchronously. Then when the file is loaded the onload attribute sets the media attribute to all and the css is applied.

If you apply this method of loading css asynchronously you may well see an issue, a flash of unstyled content. Usually the css link would block the rendering of the page so you would never see unstyled content but now the page will continue to render while the css is loading. This is where the next tip comes into play.

## Critical CSS

Critical css is any css required to render whatever is in the viewport when the user first loads the page. This css is extracted from the relevant css files and inlined into the head of the document so that the page can be rendered without any additional requests for css files. By the time the user has consumed whatever is in the viewport and then scrolled, the rest of the css files should have already loaded and been applied in the background.

There are a number of plugins/scripts available to generate critical css for you but I haven’t found one I am totally happy with. It's important to keep critical css to a minimum as it is css that will be loaded on every visit, it won’t be cached. I have found that auto generated critical css usually includes css not required and so I resorted to a manual process. It’s not the nicest job in the world but if you want the performance benefits of critical css then its got to be done.

## Text Element

If possible make your LCP a text element. If it is an image then the browser has to request that image which is another round trip to the server, delaying LCP. If it is text, then that text should be part of the initial html and if you have implemented critical css and have no render blocking requests, LCP should be very fast.

## Preload image?

If your LCP is an image then you could try preloading it.

```html
<link rel="preload" href=“image.png” as="image">
```

By adding the above into the head of your document you are telling the browser to request this image now as you will need it later in the html. So hopefully by the time the browser gets to where the image is referenced, it will already have been loaded, improving LCP.

But proceed with caution when preloading. When you preload an asset the browser downloads it with a high priority which means it could be taking away bandwidth from other resources. This could end up negatively affecting performance. So extensive testing is required, test on mobile, tablet and desktop with various connections ranging from slow 3G to cable.