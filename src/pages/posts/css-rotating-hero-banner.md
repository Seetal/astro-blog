---
layout: '../../layouts/PostLayout.astro'
title: "CSS Rotating Hero Banner"
date: 2018-03-27
published: true
tags: post
excerpt: 'I recently gave myself a challenge of creating a rotating hero banner using only sass. Why would you want to do that, I hear you ask?'
---

I recently gave myself a challenge of creating a rotating hero banner using only sass. 

## But why?

There are loads of javascript plugins, why not use one of them? A few reasons.

* I wanted to learn more sass, most of the sass I had done previously was quite simple, a few mixins, variables for colours, etc
* Wanted to keep javascript to a minimum, adding more and more plugins to a site can slow it down
* I had been playing with css transforms and wondered if I could make them work for a hero banner

## Sass Mixin

Below is the Sass mixin, its quite long and complicated but it works. There's probably a shorter way to do this, I will go through it sometime to try and optimise it.

```scss
@mixin banner($num, $holdSecs, $moveSecs, $transition) {	
	$fullRotation: (($holdSecs + $moveSecs) * $num);
	$singleRotationSeconds: $holdSecs + $moveSecs;
	$singleRotationPercent: 100% / $num;
	$holdPercent: ($holdSecs / $singleRotationSeconds) * $singleRotationPercent;
	$movePercent: $singleRotationPercent - $holdPercent;
	$firstMoveBackStart: $singleRotationPercent + $holdPercent;
	$firstMoveBackEnd: $firstMoveBackStart + $movePercent;
	$firstFinalMoveIn: 100% - $movePercent;
	.banner-1 {
		animation: move-1 $fullRotation+s infinite;
	}
	@if $transition == move {
		@keyframes move-1 {
			0% {
				left: 0;
			}
			#{$holdPercent} {
				left: 0;
			}
			#{$singleRotationPercent} {
				left: -100%;
			}
			#{$firstMoveBackStart} {
				left: -100%;
			}
			#{$firstMoveBackEnd} {
				left: 100%;
			}
			#{$firstFinalMoveIn} {
				left: 100%;
			}
			100% {
				left: 0;
			}
		}
		@for $i from 2 through $num {
			.banner-#{$i} {
				animation: move-#{$i} $fullRotation+s infinite;
			}
			$moveInStart: ($singleRotationPercent * ($i - 1)) - $movePercent;
			$moveInEnd: $moveInStart + $movePercent;
			$moveOutStart: $moveInEnd + $holdPercent;
			$moveOutEnd: $moveOutStart + $movePercent;
			@keyframes move-#{$i} {
				0% {
					left: 100%;
				}
				#{$moveInStart} {
					left: 100%;
				}
				#{$moveInEnd} {
					left: 0%;[]
				}
				#{$moveOutStart} {
					left: 0%;
				}
				#{$moveOutEnd} {
					left: -100%;
				}
				100% {
					left: -100%;
				}
			}
		}
	} @else if $transition == fade {
		@keyframes move-1 {
			0% {
				opacity: 1;
			}
			#{$holdPercent} {
				opacity: 1;
			}
			#{$singleRotationPercent} {
				opacity: 0;
			}
			#{$firstFinalMoveIn} {
				opacity: 0;
			}
			100% {
				opacity: 1;
			}
		}
		@for $i from 2 through $num {
			.banner-#{$i} {
				animation: move-#{$i} $fullRotation+s infinite;
			}
			$moveInStart: ($singleRotationPercent * ($i - 1)) - $movePercent;
			$moveInEnd: $moveInStart + $movePercent;
			$moveOutStart: $moveInEnd + $holdPercent;
			$moveOutEnd: $moveOutStart + $movePercent;
			@keyframes move-#{$i} {
				0% {
					opacity: 0;
				}
				#{$moveInStart} {
					opacity: 0;
				}
				#{$moveInEnd} {
					opacity: 1;
				}
				#{$moveOutStart} {
					opacity: 1;
				}
				#{$moveOutEnd} {
					opacity: 0;
				}
				100% {
					opacity: 0;
				}
			}
		}
	} 
}
```

## Usage

To use this, write up your html as follows:

```html
<div class="wrapper">
	<ul>
		<li class="banner_item banner-1">One</li>
		<li class="banner_item banner-2">Two</li>
		<li class="banner_item banner-3">Three</li>
	</ul>
</div>
```

The surrounding div needs to have a width assigned and the following css:

```css
.wrapper {
	width: 100%;
	position: relative;	
	overflow: hidden;
}
```

Include the mixin using 4 arguments:

```scss
@include banner(4, 4, 2, fade);
```

The arguments in order are:

1. Number of items
2. Time in seconds each item will remain static after the transition. 
3. Time in seconds for the transition to take place
4. The type of transition, currently accepts ‘move’ or ‘fade’

## How it works

There are currently 2 options for transitioning between items, 'move' and 'fade'. 

For 'move' the item's will transition from being in the viewport of the surrounding div to moving out to the right. The first item is absolutely placed in the div so it is visible whereas the other items are placed at -100% left and so won't be visible. The mixin basically calculates the keyframes required for the number of items and populates the keyframes css.

* First item is showing
* First item moves out to the right and second item moves in from left
* Second item moves out to the right, third item moves in from left, first item moves back to the left -100%
* Third item moves out to the right and the first item moves in from the left
* The whole process repeats

'fade' basically has all items stacked in the viewport and changes the opacity of each item in turn, showing the one below.


## Demo

<style type="text/css">
	.wrapper {
		width: 100%;
		height: 100px;
		position: relative;
		margin: 0 auto 1.5em auto;
		overflow: hidden;
	}
	.banner-item {
		display: block;
		padding-top: 1.3em;
		height: 100px;
		position: absolute;
		width: 100%;
		text-align: center;
		color: #fff;
	}
	.banner-1 {
		background-color: #aaa;
	}
	.banner-2 {
		background-color: #888;
	}
	.banner-3 {
		background-color: #444;
	}
.banner-1 {
  animation: move-1 12s infinite;
}

@keyframes move-1 {
  0% {
    left: 0;
  }
  25% {
    left: 0;
  }
  33.33333% {
    left: 100%;
  }
  58.33333% {
    left: 100%;
  }
  66.66667% {
    left: -100%;
  }
  91.66667% {
    left: -100%;
  }
  100% {
    left: 0;
  }
}
.banner-2 {
  animation: move-2 12s infinite;
}

@keyframes move-2 {
  0% {
    left: -100%;
  }
  25% {
    left: -100%;
  }
  33.33333% {
    left: 0%;
  }
  58.33333% {
    left: 0%;
  }
  66.66667% {
    left: 100%;
  }
  100% {
    left: 100%;
  }
}
.banner-3 {
  animation: move-3 12s infinite;
}

@keyframes move-3 {
  0% {
    left: -100%;
  }
  58.33333% {
    left: -100%;
  }
  66.66667% {
    left: 0%;
  }
  91.66667% {
    left: 0%;
  }
  100% {
    left: 100%;
  }
  100% {
    left: 100%;
  }
}
</style>
<div class="wrapper">
	<ul>
		<li class="banner-1 banner-item">One</li>
		<li class="banner-2 banner-item">Two</li>
		<li class="banner-3 banner-item">Three</li>
	</ul>
</div>

You can also see an example of this being used on [www.jin-long.co.uk](https://www.jin-long.co.uk "Jin Long")