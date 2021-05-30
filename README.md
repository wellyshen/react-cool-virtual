<h4 align="center"><code><strong>🚧 Work in progress, most APIs are done. Not production ready yet, but you can try it!</strong></code></h4>

<h1 align="center">
  <br />
  <br />
  ♻️
  <br />
  react-cool-virtual
  <br />
  <br />
  <br />
</h1>

<p align="center">A tiny React hook for rendering large datasets like a breeze.</p>

<div align="center">

[![npm version](https://img.shields.io/npm/v/react-cool-virtual?style=flat-square)](https://www.npmjs.com/package/react-cool-virtual)
[![npm downloads](https://img.shields.io/npm/dt/react-cool-virtual?style=flat-square)](https://www.npmtrends.com/react-cool-virtual)
[![gzip size](https://badgen.net/bundlephobia/minzip/react-cool-virtual?label=gzip%20size&style=flat-square)](https://bundlephobia.com/result?p=react-cool-virtual)
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)

</div>

## Features

- ♻️ Renders millions of items with highly performant way, using [DOM recycling](https://developers.google.com/web/updates/2016/07/infinite-scroller).
- 🎣 Easy to use, based on React [hook](https://reactjs.org/docs/hooks-custom.html#using-a-custom-hook).
- 💅🏼 Apply styles without hassle, just [few setups](#basic-usage).
- 🧱 Supports [fixed](#fixed-size), [variable](#variable-size), [dynamic](#dynamic-size), and [real-time resize](#real-time-resize) heights/widths.
- 🖥 Supports [RWD (responsive web design)](#responsive-web-design-rwd) for better UX.
- 🚚 Built-ins [load more callback](#infinite-scroll) for you to deal with infinite scroll + [skeleton screens](https://uxdesign.cc/what-you-should-know-about-skeleton-screens-a820c45a571a).
- 🖱 Imperative [scroll-to controls](#scroll-to-offsetitems) for offset, items, and alignment.
- 🛹 Out of the box [smooth scrolling](#smooth-scrolling) and the effect is DIY-able.
- ⛳ Provides `isScrolling` indicator to you for [performance optimization](#performance-optimization) or other purposes.
- 🗄️ Supports [server-side rendering (SSR)](#server-side-rendering-ssr) for faster [FCP](https://developers.google.com/web/updates/2019/02/rendering-on-the-web#server-rendering) and better SEO.
- 📜 Supports [TypeScript](#working-in-typescript) type definition.
- 🎛 Super flexible [API](#api) design, built with DX in mind.
- 🦔 Tiny size ([~ 2.8kB gzipped](https://bundlephobia.com/result?p=react-cool-virtual)). No external dependencies, aside for the `react`.

## Why?

When rendering a large set of data (e.g. list, table etc.) in React, we all face performance/memory troubles. There're [some great libraries](https://www.npmjs.com/search?q=react%20virtualized) already available but most of them are component-based solutions that provide well-defineded way of using but increase a lot of bundle size. However [a library](https://github.com/tannerlinsley/react-virtual) comes out as a hook-based solution that is flexible and `headless` but applying styles for using it can be verbose. Furthermore, it lacks many of the [useful features](#features).

React Cool Virtual is a [tiny](https://bundlephobia.com/result?p=react-cool-virtual) React hook that gives you a **better DX** and **modern way** for virtualizing a large amount of data without struggle 🤯.

## Docs

Frequently viewed docs:

- [Getting Started](#getting-started)
- [Examples](#examples)
- [API](#api)
- [Performance Optimization](#performance-optimization)
- [Working in TypeScript](#working-in-typescript)
- [Sharing A `ref`](#how-to-share-a-ref)
- [Polyfill](#resizeobserver-polyfill)

## Getting Started

To use React Cool Virtual, you must use `react@16.8.0` or greater which includes hooks.

### Installation

This package is distributed via [npm](https://www.npmjs.com/package/react-cool-virtual).

```sh
$ yarn add react-cool-virtual
# or
$ npm install --save react-cool-virtual
```

> ⚠️ This package using [ResizeObserver API](https://developer.mozilla.org/en-US/docs/Web/API/Resize_Observer_API) under the hook. [Most modern browsers support it natively](https://caniuse.com/?search=ResizeObserver), you can also add [polyfill](#resizeobserver-polyfill) for full browser support.

### CDN

If you're not using a module bundler or package manager. We also provide a [UMD](https://github.com/umdjs/umd) build which is available over the [unpkg.com](https://unpkg.com) CDN. Simply use a `<script>` tag to add it after [React CND links](https://reactjs.org/docs/cdn-links.html) as below:

<!-- prettier-ignore-start -->
```html
<script crossorigin src="https://unpkg.com/react/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom/umd/react-dom.production.min.js"></script>
<!-- react-cool-virtual comes here -->
<script crossorigin src="https://unpkg.com/react-cool-virtual/dist/index.umd.production.min.js"></script>
```
<!-- prettier-ignore-end -->

Once you've added this you will have access to the `window.ReactCoolVirtual.useVirtual` variable.

### Basic Usage

Here's the basic concept of how it rocks:

```js
import useVirtual from "react-cool-virtual";

const List = () => {
  const { outerRef, innerRef, items } = useVirtual({
    itemCount: 10000, // Provide the total number for the list items
    itemSize: 50, // The size of each item (default = 50)
  });

  return (
    <div
      ref={outerRef} // Set the scroll container with the `outerRef`
      style={{ width: "300px", height: "500px", overflow: "auto" }}
    >
      {/* Set the inner element with the `innerRef` */}
      <div ref={innerRef}>
        {items.map(({ index, size }) => (
          // You can set the item's height with the `size` property
          <div key={index} style={{ height: `${size}px` }}>
            ⭐️ {index}
          </div>
        ))}
      </div>
    </div>
  );
};
```

✨ Pretty easy right? React Cool Virtual is more powerful than you think. Let's explore more use cases through the examples!

## Examples

Some of the common use cases that React Cool Virtual can help you out.

### Fixed Size

This example demonstrates how to create a fixed size row. For column or grid, please refer to CodeSandbox.

[![Edit RCV - Fixed Size](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/rcv-fixed-size-bowcu?fontsize=14&hidenavigation=1&theme=dark)

```js
import useVirtual from "react-cool-virtual";

const List = () => {
  const { outerRef, innerRef, items } = useVirtual({
    itemCount: 1000,
  });

  return (
    <div
      style={{ width: "300px", height: "300px", overflow: "auto" }}
      ref={outerRef}
    >
      <div ref={innerRef}>
        {items.map(({ index, size }) => (
          <div key={index} style={{ height: `${size}px` }}>
            ⭐️ {index}
          </div>
        ))}
      </div>
    </div>
  );
};
```

### Variable Size

This example demonstrates how to create a variable size row. For column or grid, please refer to CodeSandbox.

[![Edit RCV - Variable Size](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/rcv-variable-size-8vu3u?fontsize=14&hidenavigation=1&theme=dark)

```js
import useVirtual from "react-cool-virtual";

const List = () => {
  const { outerRef, innerRef, items } = useVirtual({
    itemCount: 1000,
    itemSize: (idx) => (idx % 2 ? 100 : 50),
  });

  return (
    <div
      style={{ width: "300px", height: "300px", overflow: "auto" }}
      ref={outerRef}
    >
      <div ref={innerRef}>
        {items.map(({ index, size }) => (
          <div key={index} style={{ height: `${size}px` }}>
            ⭐️ {index}
          </div>
        ))}
      </div>
    </div>
  );
};
```

### Dynamic Size

This example demonstrates how to create a dynamic (unknown) size row. For column or grid, please refer to CodeSandbox.

[![Edit RCV - Dynamic Size](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/rcv-dynamic-size-0wurg?fontsize=14&hidenavigation=1&theme=dark)

```js
import useVirtual from "react-cool-virtual";

const List = () => {
  const { outerRef, innerRef, items } = useVirtual({
    itemCount: 1000,
    itemSize: 75, // The unmeasured item sizes will refer to this value (default = 50)
  });

  return (
    <div
      style={{ width: "300px", height: "300px", overflow: "auto" }}
      ref={outerRef}
    >
      <div ref={innerRef}>
        {items.map(({ index, measureRef }) => (
          // Use the `measureRef` to measure the item size
          <div key={index} ref={measureRef}>
            {/* Some data... */}
          </div>
        ))}
      </div>
    </div>
  );
};
```

> 💡 Scrollbar thumb is jumping? It's because the total size of the items is gradually corrected along with an item has been measured. You can tweak the `itemSize` to reduce the phenomenon.

### Real-time Resize

This example demonstrates how to create a real-time resize row (e.g. accordion, collapse etc.). For column or grid, please refer to CodeSandbox.

[![Edit RCV - Real-time Resize](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/rcv-real-time-resize-fixvr?fontsize=14&hidenavigation=1&theme=dark)

```js
import { useState, forwardRef } from "react";
import useVirtual from "react-cool-virtual";

const Item = forwardRef(({ children, height, ...rest }, ref) => {
  const [h, setH] = useState(height);

  return (
    <div
      {...rest}
      style={{ height: `${h}px` }}
      ref={ref}
      onClick={() => setH((prevH) => (prevH === 50 ? 100 : 50))}
    >
      {children}
    </div>
  );
});

const List = () => {
  const { outerRef, innerRef, items } = useVirtual({
    itemCount: 50,
  });

  return (
    <div
      style={{ width: "300px", height: "300px", overflow: "auto" }}
      ref={outerRef}
    >
      <div ref={innerRef}>
        {items.map(({ index, size, measureRef }) => (
          // Use the `measureRef` to measure the item size
          <AccordionItem key={index} height={size} ref={measureRef}>
            👋🏻 Click Me
          </AccordionItem>
        ))}
      </div>
    </div>
  );
};
```

### Responsive Web Design (RWD)

This example demonstrates how to create a list with RWD to provide a better UX for the user.

[![Edit RCV - RWD](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/rcv-rwd-x6lvc?fontsize=14&hidenavigation=1&theme=dark)

```js
import useVirtual from "react-cool-virtual";

const List = () => {
  const { outerRef, innerRef, items } = useVirtual({
    itemCount: 1000,
    // Use the outer's width (2nd parameter) to adjust the item's size
    itemSize: (_, width) => (width > 400 ? 50 : 100),
    // The event will be triggered on outer's size is being changed
    onResize: (rect) => console.log("Outer's rect: ", rect),
  });

  return (
    <div
      style={{ width: "300px", height: "400px", overflow: "auto" }}
      ref={outerRef}
    >
      <div ref={innerRef}>
        {/* We can also access the outer's width here */}
        {items.map(({ index, size, width }) => (
          <div key={index} style={{ height: `${size}px` }}>
            ⭐️ {index} ({width})
          </div>
        ))}
      </div>
    </div>
  );
};
```

### Scroll to Offset/Items

You can imperatively scroll to offset or items as follows:

[![Edit RCV - Scroll-to Controls](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/rcv-scroll-to-controls-v5b3i?fontsize=14&hidenavigation=1&theme=dark)

```js
const { scrollTo, scrollToItem } = useVirtual();

const scrollToOffset = () => {
  // Scroll to 500px
  scrollTo(500, () => {
    // 🤙🏼 Do whatever you want through the callback
  });
};

const scrollToItem = () => {
  // Scroll to the 500th item
  scrollToItem(500, () => {
    // 🤙🏼 Do whatever you want through the callback
  });

  // Control the alignment of the item with the `align` option
  // Available values: "auto" (default) | "start" | "center" | "end"
  scrollToItem({ index: 500, align: "center" });
};
```

### Smooth Scrolling

React Cool Virtual provides the smooth scrolling feature out of the box, all you need to do is turn the `smooth` option on.

[![Edit RCV - Smooth Scrolling](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/rcv-smooth-scrolling-noy4d?fontsize=14&hidenavigation=1&theme=dark)

```js
const { scrollTo, scrollToItem } = useVirtual();

// Smoothly scroll to 500px
const scrollToOffset = () => scrollTo({ offset: 500, smooth: true });

// Smoothly scroll to the 500th item
const scrollToItem = () => scrollToItem({ index: 500, smooth: true });
```

The default easing effect is [easeInOutCubic](https://easings.net/#easeInOutCubic), and the duration is 500 milliseconds. You can easily customize your own effect as follows:

```js
const { scrollTo } = useVirtual({
  // For 500 milliseconds (default = 500ms)
  scrollDuration: 500,
  // Using "easeInOutBack" effect (default = easeInOutCubic), see: https://easings.net/#easeInOutBack
  scrollEasingFunction: (t) => {
    const c1 = 1.70158;
    const c2 = c1 * 1.525;

    return t < 0.5
      ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
      : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
  },
});

const scrollToOffset = () => scrollTo({ offset: 500, smooth: true });
```

> 💡 For more cool easing effects, please [check it out](https://easings.net).

### Infinite Scroll

It's possible to make a complicated infinite scroll logic simple by just using a hook, no kidding! Let's see how possible 🤔.

[![Edit RCV - Infinite Scroll](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/rcv-infinite-scroll-3y351?fontsize=14&hidenavigation=1&theme=dark)

#### Working with [Skeleton Screens](https://uxdesign.cc/what-you-should-know-about-skeleton-screens-a820c45a571a)

```js
import { useState } from "react";
import useVirtual from "react-cool-virtual";
import axios from "axios";

const TOTAL_COMMENTS = 500;
const BATCH_COMMENTS = 5;
const isItemLoadedArr = [];

const loadData = async ({ loadIndex }, setComments) => {
  // Set the state of a batch items as `true`
  // to avoid the callback from being invoked repeatedly
  isItemLoadedArr[loadIndex] = true;

  try {
    const { data: comments } = await axios(`/comments?postId=${loadIndex + 1}`);

    setComments((prevComments) => [...prevComments, ...comments]);
  } catch (err) {
    // If there's an error set the state back to `false`
    isItemLoadedArr[loadIndex] = false;
    // Then try again
    loadData({ loadIndex }, setComments);
  }
};

const List = () => {
  const [comments, setComments] = useState([]);
  const { outerRef, innerRef, items } = useVirtual({
    itemCount: TOTAL_COMMENTS,
    // Estimated item size (with padding)
    itemSize: 122,
    // Starts to pre-fetch data when the user scrolls within every 5 items, e.g. 1-5, 6-10 and so on (default = 15)
    loadMoreThreshold: BATCH_COMMENTS,
    // Provide the loaded state for a batch items to tell the hook whether the `loadMore` should be triggered or not
    isItemLoaded: (loadIndex) => isItemLoadedArr[loadIndex],
    // The callback will be invoked when more data needs to be loaded
    loadMore: (e) => loadData(e, setComments),
  });

  return (
    <div
      style={{ width: "300px", height: "300px", overflow: "auto" }}
      ref={outerRef}
    >
      <div ref={innerRef}>
        {items.map(({ index, measureRef }) => (
          <div
            key={index}
            style={{ padding: "16px", minHeight: "122px" }}
            ref={measureRef} // Used to measure the unknown item size
          >
            {comments[index]?.body || "⏳ Loading..."}
          </div>
        ))}
      </div>
    </div>
  );
};
```

#### Working with A Loading Indicator

```js
import { Fragment, useState } from "react";
import useVirtual from "react-cool-virtual";
import axios from "axios";

const TOTAL_COMMENTS = 500;
const BATCH_COMMENTS = 5;
const isItemLoadedArr = [];

const loadData = async ({ loadIndex }, setComments) => {
  isItemLoadedArr[loadIndex] = true;

  try {
    const { data: comments } = await axios(`/comments?postId=${loadIndex + 1}`);

    setComments((prevComments) => [...prevComments, ...comments]);
  } catch (err) {
    isItemLoadedArr[loadIndex] = false;
    loadData({ loadIndex }, setComments);
  }
};

const Loading = () => <div>⏳ Loading...</div>;

const List = () => {
  const [comments, setComments] = useState([]);
  const { outerRef, innerRef, items } = useVirtual({
    itemCount: comments.length, // Provide the number of comments
    itemSize: 122,
    loadMoreThreshold: BATCH_COMMENTS,
    isItemLoaded: (loadIndex) => isItemLoadedArr[loadIndex],
    loadMore: (e) => loadData(e, setComments),
  });

  return (
    <div
      style={{ width: "300px", height: "300px", overflow: "auto" }}
      ref={outerRef}
    >
      <div ref={innerRef}>
        {items.length ? (
          items.map(({ index, measureRef }) => {
            const len = comments.length;
            const showLoading = index === len - 1 && len < TOTAL_COMMENTS;

            return (
              <Fragment key={index}>
                <div
                  style={{ padding: "16px", minHeight: "122px" }}
                  ref={measureRef}
                >
                  {comments[index].body}
                </div>
                {showLoading && <Loading />}
              </Fragment>
            );
          })
        ) : (
          <Loading />
        )}
      </div>
    </div>
  );
};
```

### Dealing with Dynamic Items

Coming soon...

### Server-side Rendering (SSR)

Coming soon...

## Performance Optimization

Coming soon...

## How to Share A `ref`?

You can share a `ref` as follows, here we take the `outerRef` as the example:

```js
import { useRef } from "react";
import useVirtual from "react-cool-virtual";

const App = () => {
  const ref = useRef();
  const { outerRef } = useVirtual();

  return (
    <div
      ref={(el) => {
        outerRef.current = el; // Set the element to the `outerRef`
        ref.current = el; // Share the element for other purposes
      }}
    />
  );
};
```

## Working in TypeScript

React Cool Virtual is built with [TypeScript](https://www.typescriptlang.org), you can tell the hook what type of your **outer** and **inner** elements are as follows:

```tsx
const App = () => {
  // 1st is the `outerRef`, 2nd is the `innerRef`
  const { outerRef, innerRef } = useVirtual<HTMLDivElement, HTMLDivElement>();

  return (
    <div ref={outerRef}>
      <div ref={innerRef}>{/* Rendering items... */}</div>
    </div>
  );
};
```

💡 For more available types, please [check it out](src/types/react-cool-virtual.d.ts).

## API

Coming soon...

## ResizeObserver Polyfill

[ResizeObserver has good support amongst browsers](https://caniuse.com/?search=ResizeObserver), but it's not universal. You'll need to use polyfill for browsers that don't support it. Polyfills is something you should do consciously at the application level. Therefore React Cool Virtual doesn't include it.

We recommend using [@juggle/resize-observer](https://github.com/juggle/resize-observer):

```sh
$ yarn add @juggle/resize-observer
# or
$ npm install --save @juggle/resize-observer
```

Then pollute the `window` object:

```js
import { ResizeObserver } from "@juggle/resize-observer";

if (!("ResizeObserver" in window)) window.ResizeObserver = ResizeObserver;
```

You could use dynamic imports to only load the file when the polyfill is required:

```js
(async () => {
  if (!("ResizeObserver" in window)) {
    const module = await import("@juggle/resize-observer");
    window.ResizeObserver = module.ResizeObserver;
  }
})();
```

## To Do...

- [ ] Unit testing
- [ ] Reverse scrolling
- [ ] Infinite loop
- [ ] `scrollBy` method

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="http://wellyshen.com"><img src="https://avatars.githubusercontent.com/u/21308003?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Welly</b></sub></a><br /><a href="#ideas-wellyshen" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/wellyshen/react-cool-virtual/commits?author=wellyshen" title="Code">💻</a> <a href="https://github.com/wellyshen/react-cool-virtual/commits?author=wellyshen" title="Documentation">📖</a> <a href="#infra-wellyshen" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#maintenance-wellyshen" title="Maintenance">🚧</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
