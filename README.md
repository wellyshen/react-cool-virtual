<h4 align="center"><code><strong>🚧 Work in progress, don't use it now.</strong></code></h4>

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
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/react-cool-virtual?style=flat-square)](https://bundlephobia.com/result?p=react-cool-virtual)
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)

</div>

## Features

- ♻️ Renders millions of items with highly performant way, using [DOM recycling](https://developers.google.com/web/updates/2016/07/infinite-scroller).
- 🎣 Easy to use, based on React [hook](https://reactjs.org/docs/hooks-custom.html#using-a-custom-hook).
- 💅🏼 Apply styles without hassle, just [few setups](#basic-usage).
- 🧱 Supports [fixed](#TBC), [variable](#TBC), [dynamic](#TBC), and [real-time dynamic](#TBC) heights/widths.
- 🖥 Supports [RWD (responsive web design)](#TBC) for better UX.
- 🚚 Built-ins [load more callback](#TBC) for you to deal with infinite scroll + [skeleton screens](https://uxdesign.cc/what-you-should-know-about-skeleton-screens-a820c45a571a).
- 🖱 Imperative [scroll-to controls](#TBC) for offset, index, and alignment.
- 🛹 Out of the box [smooth scrolling](#TBC) and be able to customize it.
- ⛳ Provides `isScrolling` indicator to you for [performance optimization](#performance-optimization) or other purposes.
- 🗄️ Supports [server-side rendering](#TBC) for faster [FCP](https://developers.google.com/web/updates/2019/02/rendering-on-the-web#server-rendering) and better SEO.
- 📜 Supports [TypeScript](#working-in-typescript) type definition.
- 🎛 Super flexible [API](#api) design, built with DX in mind.
- 🦔 Tiny size ([~ 2.5kB gzipped](https://bundlephobia.com/result?p=react-cool-virtual)). No external dependencies, aside for the `react`.

## Motivation

When rendering a large set of data (e.g. list, table etc.) in React, we all face performance/memory troubles. There're [some great libraries](https://www.npmjs.com/search?q=react%20virtualized) already available but most of them are component-based solutions that increase a lot of bundle size for our app(s). However [a library](https://github.com/tannerlinsley/react-virtual) comes out as a hook-based solution, but applying styles for using it can be verbose. Furthermore, it lacks some of the [useful features](#features).

React Cool Virtual is a [tiny](https://bundlephobia.com/result?p=react-cool-virtual) React hook that gives you a **better DX** and **modern way** for virtualizing a large amount of data without struggle 🤯.

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
            Row {index}
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

This example demonstrates how to create a fixed size list. For horizontal list or table, please refer to CodeSandbox.

[![Edit RCV - Fixed Size](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/rcv-fixed-size-bowcu?fontsize=14&hidenavigation=1&theme=dark)

```js
import useVirtual from "react-cool-virtual";

const List = () => {
  const { outerRef, innerRef, items } = useVirtual({
    itemCount: 1000,
  });

  return (
    <div
      className="outer"
      style={{ width: "300px", height: "300px", overflow: "auto" }}
      ref={outerRef}
    >
      <div ref={innerRef}>
        {items.map(({ index, size }) => (
          <div key={index} style={{ height: `${size}px` }}>
            ♻️ {index}
          </div>
        ))}
      </div>
    </div>
  );
};
```

### Variable Size

This example demonstrates how to create a variable size list. For horizontal list or table, please refer to CodeSandbox.

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
      className="outer"
      style={{ width: "300px", height: "300px", overflow: "auto" }}
      ref={outerRef}
    >
      <div ref={innerRef}>
        {items.map(({ index, size }) => (
          <div key={index} style={{ height: `${size}px` }}>
            ♻️ {index}
          </div>
        ))}
      </div>
    </div>
  );
};
```

### Dynamic Size

This example demonstrates how to create a dynamic size list. For horizontal list or table, please refer to CodeSandbox.

[![Edit RCV - Dynamic Size](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/rcv-dynamic-size-0wurg?fontsize=14&hidenavigation=1&theme=dark)

```js
import useVirtual from "react-cool-virtual";

const rowHeights = () =>
  new Array(1000).fill().map(() => 35 + Math.round(Math.random() * 50));

const List = () => {
  const { outerRef, innerRef, items } = useVirtual({
    itemCount: rowHeights.length,
    itemSize: 75, // The unmeasured item sizes will refer to this value (default = 50)
  });

  return (
    <div
      className="outer"
      style={{ width: "300px", height: "300px", overflow: "auto" }}
      ref={outerRef}
    >
      <div ref={innerRef}>
        {items.map(({ index, size, measureRef }) => (
          <div
            key={index}
            style={{ height: `${rowHeights[index]}px` }}
            ref={measureRef} // It will measure the item size for us
          >
            📏 {size}
          </div>
        ))}
      </div>
    </div>
  );
};
```

> 💡 Jumping while scrolling? It's because the total size of the items is gradually corrected along with an item has been measured. You can tweak the `itemSize` to reduce the phenomenon.

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
import useVirtual from "react-cool-virtual";

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
