---
layout: '../../layouts/PostLayout.astro'
title: 'View Transitions'
date: 2023-08-23
tags: css
excerpt: 'Transitioning between multi page apps has become very easy with the view transitions api.'
permalink: '/posts/javascript-console-time/'

---

One of the really cool things about mobile apps are the transitions between pages or views. You tap a button and the next page flies in from the right or fades in or the button animates to give the effect of going into it, etc. This has been missing on websites, there have been some javascript solutions but they are generally not good for performance and especially bad for core web vitals which has become increasingly important in recent years.

All this is about to change with view transitions api. Currently this only works behind a flag in chrome, to enable it simply copy the following lines into the address bar of chrome and enable them:

```html 
chrome://flags#view-transition
chrome://flags#view-transition-on-navigation
```

Then add the following meta tag to the head of your templates:

```html
<meta name="view-transition" content="same-origin" />
```
Basically that’s it, you will now have a fading page transition.

If you want to transition an element on one page to another element on the next page you simply give each of the elements the same css view-transition-name:

```css
.element-on-page-one {
	view-transition-name: cheesecake;
}
.element-on-page-two {
	view-transition-name: cheesecake;
}
```
I won’t go much further into the implementation of view transitions, there’s a lot of writing out there already. I found a great writeup over at https://daverupert.com/2023/05/getting-started-view-transitions/, definitely worth a read.

What I was curious about is how view transitions will affect performance and core web vitals therefore I applied view transitions to this site so I can test it. If the flag is turned on, you will see pages fade from one to another. Also on the homepage when you click on a blog post to view it, the title will animate to its position at the top of the blog post page.

## Cumulative Layout Shift

Usually if there is any movement in elements during the loading of a page then it is seen as a layout shift and could affect CLS scores. I suspected view transitions would not affect CLS as they are purposeful transitions that could be beneficial to usability, and I was right. There was no impact on CLS at all.

## Largest Contentful Paint

This is where things got a little interesting. My test methodology was:

- Use chrome dev tools performance tab
- On the homepage of this blog, click start recording in the performance tab
- Click on a blog post to navigate to the blog post page
- Once the page is loaded, stop recording
- Repeat 5 times

I repeated these steps for:

- Mobile and desktop
- A text element as LCP and an image element as LCP
- No throttling and fast 3G
- With and without view transitions

The tables below show the average of the 5 runs for each scenario.

<table class="table">
    <caption>Mobile text element</caption>
    <thead>
        <tr>
            <td rowspan="2" class="empty"></td>
            <th scope="colgroup" colspan="2">No throttling</th>
            <th scope="colgroup" colspan="2">Fast 3G</th>
        </tr>
        <tr>
            <th scope="col">Without</th>
            <th scope="col">With</th>
            <th scope="col">Without</th>
            <th scope="col">With</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th>FP</th>
            <td>188.216</td>
            <td>172.074</td>
            <td>1.21</td>
            <td>1.22</td>
        <tr>
        <tr>
            <th>FCP</th>
            <td>188.216</td>
            <td>172.074</td>
            <td>1.21</td>
            <td>1.22</td>
        <tr>
        <tr>
            <th>LCP</th>
            <td>188.216</td>
            <td>172.074</td>
            <td>1.21</td>
            <td>1.22</td>
        <tr>
    </tbody>
</table>

Not too much interesting in the above table, no throttling with transitions was slightly faster but fast 3G was slightly slower with transitions. With the LCP being a text element it is no surprise that first paint (FP), first contentful paint (FCP) and largest contentful paint (LCP) all have the same timings.

<table class="table">
    <caption>Desktop text element</caption>
    <thead>
        <tr>
            <td rowspan="2" class="empty"></td>
            <th scope="colgroup" colspan="2">No throttling</th>
            <th scope="colgroup" colspan="2">Fast 3G</th>
        </tr>
        <tr>
            <th scope="col">Without</th>
            <th scope="col">With</th>
            <th scope="col">Without</th>
            <th scope="col">With</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th>FP</th>
            <td>183.63</td>
            <td>226.096</td>
            <td>1.222</td>
            <td>1.24</td>
        <tr>
        <tr>
            <th>FCP</th>
            <td>183.63</td>
            <td>226.096</td>
            <td>1.222</td>
            <td>1.24</td>
        <tr>
        <tr>
            <th>LCP</th>
            <td>183.63</td>
            <td>226.096</td>
            <td>1.222</td>
            <td>1.24</td>
        <tr>
    </tbody>
</table>

The above table shows that desktop was slower with transitions in both no throttling and fast 3G. This is what I was expecting with both mobile and desktop as the browser has to do slightly more work to setup the transitions.

<table class="table">
    <caption>Mobile image element</caption>
    <thead>
        <tr>
            <td rowspan="2" class="empty"></td>
            <th scope="colgroup" colspan="2">No throttling</th>
            <th scope="colgroup" colspan="2">Fast 3G</th>
        </tr>
        <tr>
            <th scope="col">Without</th>
            <th scope="col">With</th>
            <th scope="col">Without</th>
            <th scope="col">With</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th>FP</th>
            <td>214.924</td>
            <td>292.668</td>
            <td>1.246</td>
            <td>1.294</td>
        <tr>
        <tr>
            <th>FCP</th>
            <td>214.924</td>
            <td>292.668</td>
            <td>1.246</td>
            <td>1.294</td>
        <tr>
        <tr>
            <th>LCP</th>
            <td>256.132</td>
            <td>292.668</td>
            <td>3.758</td>
            <td>3.776</td>
        <tr>
    </tbody>
</table>

Image element on mobile shows to be slower with both no throttling and fast 3G with transitions. The interesting thing here is that when the LCP is an image it is expected that it will be slower than FP and FCP which will usually be text elements, but no throttling with transitions, the image LCP was also the FP and FCP. This was the case for all 5 runs.

<table class="table">
    <caption>Desktop image element</caption>
    <thead>
        <tr>
            <td rowspan="2" class="empty"></td>
            <th scope="colgroup" colspan="2">No throttling</th>
            <th scope="colgroup" colspan="2">Fast 3G</th>
        </tr>
        <tr>
            <th scope="col">Without</th>
            <th scope="col">With</th>
            <th scope="col">Without</th>
            <th scope="col">With</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th>FP</th>
            <td>187.924</td>
            <td>178.136</td>
            <td>1.25</td>
            <td>1.266</td>
        <tr>
        <tr>
            <th>FCP</th>
            <td>187.924</td>
            <td>178.136</td>
            <td>1.25</td>
            <td>1.266</td>
        <tr>
        <tr>
            <th>LCP</th>
            <td>212.414</td>
            <td>187.888</td>
            <td>3.746</td>
            <td>3.752</td>
        <tr>
    </tbody>
</table>

This time no throttling is slightly faster with transitions but 3G is slightly slower with transitions. One thing to note here is that no throttling with transitions, the LCP is showing as only slightly slower than FP and FCP, the reason for this is that for 4 of the 5 runs, the LCP, FP and FCP were all the same. This is similar to what we saw with mobile where all 5 runs were the same.

It seems like with transitions on and an image element as LCP on a fast network, the LCP is also generally the FP and FCP. Is this a good thing? Not sure really. If the LCP is speeding up to be in line with the FP and FCP then yes, but if the FP and FCP are slowing down to be in line with the LCP then no.

## Limitations

There are some limitations to these results. The tests were done on this site which is a very small and fast site so the variations in timings could be just noise.

Also I only did 5 test runs for each scenario which might not be enough.