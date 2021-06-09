<p align="center">
  <a href="https://github.com/wellyshen/react-cool-virtual/blob/master/README.md" title="React Cool Virtual"><img src="https://github.com/wellyshen/react-cool-virtual/blob/master/images/logo.svg" alt="React Cool Virtual"></a>
</p>

<p align="center">A tiny React hook for rendering large datasets like a breeze.</p>

<div align="center">

[![npm version](https://img.shields.io/npm/v/react-cool-virtual?style=flat-square)](https://www.npmjs.com/package/react-cool-virtual)
[![npm downloads](https://img.shields.io/npm/dt/react-cool-virtual?style=flat-square)](https://www.npmtrends.com/react-cool-virtual)
[![gzip size](https://badgen.net/bundlephobia/minzip/react-cool-virtual?label=gzip%20size&style=flat-square)](https://bundlephobia.com/result?p=react-cool-virtual)
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)

</div>

## Features <!-- omit in toc -->

- ♻️ Renders millions of items with highly performant way, using [DOM recycling](https://developers.google.com/web/updates/2016/07/infinite-scroller).
- 🎣 Easy to use, based on React [hook](https://reactjs.org/docs/hooks-custom.html#using-a-custom-hook).
- 💅🏼 Apply styles without hassle, just [few setups](#basic-usage).
- 🧱 Supports [fixed](#fixed-size), [variable](#variable-size), [dynamic](#dynamic-size), and [real-time](#real-time-resize) heights/widths.
- 🖥 Supports [responsive web design (RWD)](#responsive-web-design-rwd) for better UX.
- 📌 Supports [sticky headers](#sticky-headers) for building on-trend lists.
- 🚚 Built-ins [load more callback](#infinite-scroll) for you to deal with infinite scroll + [skeleton screens](https://uxdesign.cc/what-you-should-know-about-skeleton-screens-a820c45a571a).
- 🖱 Imperative [scroll-to methods](#scroll-to-offsetitems) for offset, items, and alignment.
- 🛹 Out-of-the-box [smooth scrolling](#smooth-scrolling) and the effect is DIY-able.
- ⛳ Provides `isScrolling` indicator to you for UI placeholders or [performance optimization](#use-isscrolling-indicator).
- 🗄️ Supports [server-side rendering (SSR)](#server-side-rendering-ssr) for a fast [FP + FCP](https://developers.google.com/web/updates/2019/02/rendering-on-the-web#server-rendering) and better [SEO](https://developers.google.com/web/updates/2019/02/rendering-on-the-web#server-rendering).
- 📜 Supports [TypeScript](#working-in-typescript) type definition.
- 🎛 Super flexible [API](#api) design, built with DX in mind.
- 🦔 Tiny size ([~ 2.9kB gzipped](https://bundlephobia.com/result?p=react-cool-virtual)). No external dependencies, aside for the `react`.

## Why? <!-- omit in toc -->

When rendering a large set of data (e.g. list, table etc.) in React, we all face performance/memory troubles. There're [some great libraries](https://www.npmjs.com/search?q=react%20virtualized) already available but most of them are component-based solutions that provide well-defineded way of using but increase a lot of bundle size. However [a library](https://github.com/tannerlinsley/react-virtual) comes out as a hook-based solution that is flexible and `headless` but applying styles for using it can be verbose. Furthermore, it lacks many of the [useful features](#features).

React Cool Virtual is a [tiny](https://bundlephobia.com/result?p=react-cool-virtual) React hook that gives you a **better DX** and **modern way** for virtualizing a large amount of data without struggle 🤯.

## Docs <!-- omit in toc -->

- [Getting Started](#getting-started)
  - [Requirement](#requirement)
  - [Installation](#installation)
  - [CDN](#cdn)
  - [Basic Usage](#basic-usage)
- [Examples](#examples)
  - [Fixed Size](#fixed-size)
  - [Variable Size](#variable-size)
  - [Dynamic Size](#dynamic-size)
  - [Real-time Resize](#real-time-resize)
  - [Responsive Web Design (RWD)](#responsive-web-design-rwd)
  - [Sticky Headers](#sticky-headers)
  - [Scroll to Offset/Items](#scroll-to-offsetitems)
  - [Smooth Scrolling](#smooth-scrolling)
  - [Infinite Scroll](#infinite-scroll)
  - [Working with Input Elements](#working-with-input-elements)
  - [Dealing with Dynamic Items](#dealing-with-dynamic-items)
  - [Server-side Rendering (SSR)](#server-side-rendering-ssr)
- [API](#api)
  - [Options](#options)
  - [Return Values](#return-values)
- [Others](#others)
  - [Performance Optimization](#performance-optimization)
  - [How to Share A `ref`?](#how-to-share-a-ref)
  - [Layout Items](#layout-items)
  - [Working in TypeScript](#working-in-typescript)
  - [ResizeObserver Polyfill](#resizeobserver-polyfill)

## Getting Started

### Requirement

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
      ref={outerRef} // Attach the `outerRef` to the scroll container
      style={{ width: "300px", height: "500px", overflow: "auto" }}
    >
      {/* Attach the `innerRef` to the wrapper of the items */}
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

const AccordionItem = forwardRef(({ children, height, ...rest }, ref) => {
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
    // The event will be triggered on outer's size changes
    onResize: (size) => console.log("Outer's size: ", size),
  });

  return (
    <div
      style={{ width: "100%", height: "400px", overflow: "auto" }}
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

> 💡 If the item size is specified through the function of `itemSize`, please ensure there's no the [measureRef](#items) on the item element. Otherwise, the hook will use the measured (cached) size for the item. When working with RWD, we can only use either of the two.

### Sticky Headers

This example demonstrates how to make sticky headers with React Cool Virtual.

[![Edit RCV - Sticky Headers](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/rcv-sticky-headers-pm79x?fontsize=14&hidenavigation=1&theme=dark)

```js
import useVirtual from "react-cool-virtual";

const List = () => {
  const { outerRef, innerRef, items } = useVirtual({
    itemCount: 1000,
    itemSize: 75,
    stickyIndices: [0, 10, 20, 30, 40, 50], // The values must be provided in ascending order
  });

  return (
    <div
      style={{ width: "300px", height: "300px", overflow: "auto" }}
      ref={outerRef}
    >
      <div ref={innerRef}>
        {items.map(({ index, size, isSticky }) => {
          let style = { height: `${size}px` };
          // Use the `isSticky` property to style the sticky item, that's it ✨
          style = isSticky ? { ...style, position: "sticky", top: "0" } : style;

          return (
            <div key={someData[index].id} style={style}>
              {someData[index].content}
            </div>
          );
        })}
      </div>
    </div>
  );
};
```

> 💡 Scrollbars disappear when using Chrome in Mac? If you encounter [this issue](https://bugs.chromium.org/p/chromium/issues/detail?id=1033712), you can add `will-change:transform` to the outer element to workaround this problem.

### Scroll to Offset/Items

You can imperatively scroll to offset or items as follows:

[![Edit RCV - Scroll-to Methods](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/rcv-scroll-to-methods-cs9x9?fontsize=14&hidenavigation=1&theme=dark)

```js
const { scrollTo, scrollToItem } = useVirtual();

const scrollToOffset = () => {
  // Scrolls to 500px
  scrollTo(500, () => {
    // 🤙🏼 Do whatever you want through the callback
  });
};

const scrollToItem = () => {
  // Scrolls to the 500th item
  scrollToItem(500, () => {
    // 🤙🏼 Do whatever you want through the callback
  });

  // We can control the alignment of the item with the `align` option
  // Acceptable values are: "auto" (default) | "start" | "center" | "end"
  // Using "auto" will scroll the item into the view at the start or end, depending on which is closer
  scrollToItem({ index: 10, align: "auto" });
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
const scrollToItem = () => scrollToItem({ index: 10, smooth: true });
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
    // The number of items that you want to load/or pre-load, it will trigger the `loadMore` callback
    // when the user scrolls within every items, e.g. 1 - 5, 6 - 10, and so on (default = 15)
    loadMoreCount: BATCH_COMMENTS,
    // Provide the loaded state of a batch items to the callback for telling the hook
    // whether the `loadMore` should be triggered or not
    isItemLoaded: (loadIndex) => isItemLoadedArr[loadIndex],
    // We can fetch the data through the callback, it's invoked when more items need to be loaded
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
            key={comments[index]?.id || `fb-${index}`}
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
// We only have 50 (500 / 5) batches of items, so set the 51th (index = 50) batch as `true`
// to avoid the `loadMore` callback from being invoked, yep it's a trick 😉
isItemLoadedArr[50] = true;

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
    loadMoreCount: BATCH_COMMENTS,
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
            const showLoading =
              index === comments.length - 1 && comments.length < TOTAL_COMMENTS;

            return (
              <Fragment key={comments[index].id}>
                <div ref={measureRef}>{comments[index].body}</div>
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

### Working with Input Elements

This example demonstrates how to handle input elements (or form fields) in a virtualized list.

[![Edit RCV - Input Elements](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/rcv-input-elements-9p6ot?fontsize=14&hidenavigation=1&theme=dark)

```js
import { useState } from "react";
import useVirtual from "react-cool-virtual";

const defaultValues = new Array(20).fill(false);

const Form = () => {
  const [formData, setFormData] = useState({ todo: defaultValues });
  const { outerRef, innerRef, items } = useVirtual({
    itemCount: defaultValues.length,
  });

  const handleInputChange = ({ target }, index) => {
    // Store the input values in React state
    setFormData((prevData) => {
      const todo = [...prevData.todo];
      todo[index] = target.checked;
      return { todo };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(JSON.stringify(formData, undefined, 2));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div
        style={{ width: "300px", height: "300px", overflow: "auto" }}
        ref={outerRef}
      >
        <div ref={innerRef}>
          {items.map(({ index, size }) => (
            <div key={index} style={{ height: `${size}px` }}>
              <input
                id={`todo-${index}`}
                type="checkbox"
                // Populate the corresponding state to the default value
                defaultChecked={formData.todo[index]}
                onChange={(e) => handleInputChange(e, index)}
              />
              <label htmlFor={`todo-${index}`}>{index}. I'd like to...</label>
            </div>
          ))}
        </div>
      </div>
      <input type="submit" />
    </form>
  );
};
```

When dealing with forms, we can use [React Cool Form](react-cool-form.netlify.app) to handle the form state and boost performance for use.

```js
import useVirtual from "react-cool-virtual";
import { useForm } from "react-cool-form";

const defaultValues = new Array(20).fill(false);

const Form = () => {
  const { outerRef, innerRef, items } = useVirtual({
    itemCount: defaultValues.length,
  });
  const { form } = useForm({
    defaultValues: { todo: defaultValues },
    removeOnUnmounted: false, // To keep the value of unmounted fields
    onSubmit: (formData) => alert(JSON.stringify(formData, undefined, 2)),
  });

  return (
    <form ref={form}>
      <div
        style={{ width: "300px", height: "300px", overflow: "auto" }}
        ref={outerRef}
      >
        <div ref={innerRef}>
          {items.map(({ index, size }) => (
            <div key={index} style={{ height: `${size}px` }}>
              <input
                id={`todo-${index}`}
                name={`todo[${index}]`}
                type="checkbox"
              />
              <label htmlFor={`todo-${index}`}>{index}. I'd like to...</label>
            </div>
          ))}
        </div>
      </div>
      <input type="submit" />
    </form>
  );
};
```

### Dealing with Dynamic Items

React requires [keys](https://reactjs.org/docs/lists-and-keys.html#keys) for array items. I'd recommend using an unique id as the key as possible as we can, especially when working with reordering, filtering etc. Refer to [this article](https://robinpokorny.medium.com/index-as-a-key-is-an-anti-pattern-e0349aece318) to learn more.

```js
const List = () => {
  const { outerRef, innerRef, items } = useVirtual();

  return (
    <div
      ref={outerRef}
      style={{ width: "300px", height: "300px", overflow: "auto" }}
    >
      <div ref={innerRef}>
        {items.map(({ index, size }) => (
          // Use IDs from your data as keys
          <div key={someData[index].id} style={{ height: `${size}px` }}>
            {someData[index].content}
          </div>
        ))}
      </div>
    </div>
  );
};
```

### Server-side Rendering (SSR)

Server-side rendering allows us to provide a fast [FP and FCP](https://developers.google.com/web/updates/2019/02/rendering-on-the-web#server-rendering), it also benefits for [SEO](https://developers.google.com/web/updates/2019/02/rendering-on-the-web#seo). React Cool Virtual supplies you a seamless DX between SSR and CSR.

```js
const List = () => {
  const { outerRef, innerRef, items } = useVirtual({
    itemCount: 1000,
    ssrItemCount: 30, // Renders 0th - 30th items on SSR
    // or
    ssrItemCount: [50, 80], // Renders 50th - 80th items on SSR
  });

  return (
    <div
      style={{ width: "300px", height: "300px", overflow: "auto" }}
      ref={outerRef}
    >
      <div ref={innerRef}>
        {/* The items will be rendered both on SSR and CSR, depending on our settings */}
        {items.map(({ index, size }) => (
          <div key={someData[index].id} style={{ height: `${size}px` }}>
            {someData[index].content}
          </div>
        ))}
      </div>
    </div>
  );
};
```

> 💡 Please note, when using the `ssrItemCount`, the initial items will be the SSR items but it has no impact to the UX. In addition, you might notice that some styles (i.e. width, start) of the SSR items are `0`. It's by design, because there's no way to know the outer's size on SSR. However, you can make up these styles based on the environments if you need.

## API

React Cool Virtual is a custom React [hook](https://reactjs.org/docs/hooks-custom.html#using-a-custom-hook) that supplies you with [all the features](#features) for building highly performant virtualized datasets easily 🚀. It takes `options` parameters and returns useful methods as follows.

```js
const returnValues = useVirtual(options);
```

### Options

An `object` with the following options:

#### itemCount (Required)

`number`

The total number of items. It can be an arbitrary number if actual number is unknown, see the [example](#working-with-a-loading-indicator) to learn more.

#### ssrItemCount

`number | [number, number]`

The number of items that are rendered on server-side, see the [example](#server-side-rendering-ssr) to learn more.

#### itemSize

`number | (index: number, width: number) => number`

The size of an item (default = 50). When working with **dynamic size**, it will be the default/or estimated size of the unmeasured items.

- For `number` use case, please refer to the [fixed size example](#fixed-size).
- For `index` callback use case, please refer to the [variable size example](#variable-size).
- For `width` callback use case, please refer to the [RWD example](#responsive-web-design-rwd).

#### horizontal

`boolean`

The layout/orientation of the list (default = false). When `true` means left/right scrolling, so the hook will use `width` as the [item size](#itemsize) and use the `left` as the [start](#items) position.

#### overscanCount

`number`

The number of items to render behind and ahead of the visible area (default = 1). That can be used for two reasons:

- To slightly reduce/prevent a flash of empty screen while the user is scrolling. Please note, too many can negatively impact performance.
- To allow the tab key to focus on the next (invisible) item for better accessibility.

#### useIsScrolling

`boolean`

To enable/disable the [isScrolling](#items) indicator of an item (default = false). It's useful for UI placeholders or [performance optimization](#use-isscrolling-indicator) when the list is being scrolled. Please note, using it will result in an additional render after scrolling has stopped.

#### stickyIndices

`number[]`

An array of indexes to make certain items in the list sticky. See the [example](#sticky-headers) to learn more.

- The values must be provided **in ascending order**, i.e. `[0, 10, 20, 30, ...]`.

#### scrollDuration

`number`

The duration of [smooth scrolling](#smooth-scrolling), the unit is milliseconds (default = 500ms).

#### scrollEasingFunction

`(time: number) => number`

A function that allows us to customize the easing effect of [smooth scrolling](#smooth-scrolling) (default = [easeInOutCubic](https://easings.net/#easeInOutCubic)).

#### loadMoreCount

`number`

How many number of items that you want to load/or pre-load (default = 15), it's used for [infinite scroll](#infinite-scroll). A number 15 means the [loadMore](#loadmore) callback will be invoked when the user scrolls within every 15 items, e.g. 1 - 15, 16 - 30, and so on.

#### isItemLoaded

`(index: number) => boolean`

A callback for us to provide the loaded state of a batch items, it's used for [infinite scroll](#infinite-scroll). It tells the hook whether the [loadMore](#loadmore) should be triggered or not.

#### loadMore

`(event: Object) => void`

A callback for us to fetch (more) data, it's used for [infinite scroll](#infinite-scroll). It's invoked when more items need to be loaded, which based on the mechanism of [loadMoreCount](#loadmorecount) and [isItemLoaded](#isitemloaded).

```js
const props = useVirtual({
  onScroll: ({
    startIndex, // (number) The index of the first batch item
    stopIndex, // (number) The index of the last batch item
    loadIndex, // (number) The index of the current batch items (e.g. 1 - 15 as `0`, 16 - 30 as `1`, and so on)
    scrollOffset, // (number) The scroll offset from top/left, depending on the `horizontal` option
    userScroll, // (boolean) Tells you the scrolling is through the user or not
  }) => {
    // Fetch data...
  },
});
```

#### onScroll

`(event: Object) => void`

This event will be triggered when scroll position is being changed by the user scrolls or [scrollTo](#scrollto)/[scrollToItem](#scrolltoitem) methods.

```js
const props = useVirtual({
  onScroll: ({
    overscanStartIndex, // (number) The index of the first overscan item
    overscanStopIndex, // (number) The index of the last overscan item
    visibleStartIndex, // (number) The index of the first visible item
    visibleStopIndex, // (number) The index of the last visible item
    scrollOffset, // (number) The scroll offset from top/left, depending on the `horizontal` option
    scrollForward, // (boolean) The scroll direction of up/down or left/right, depending on the `horizontal` option
    userScroll, // (boolean) Tells you the scrolling is through the user or not
  }) => {
    // Do something...
  },
});
```

#### onResize

`(event: Object) => void`

This event will be triggered when the size of the outer element changes.

```js
const props = useVirtual({
  onResize: ({
    width, // (number) The content width of the outer element
    height, // (number) The content height of the outer element
  }) => {
    // Do something...
  },
});
```

### Return Values

An `object` with the following properties:

#### outerRef

`React.useRef<HTMLElement>`

A [ref](https://reactjs.org/docs/hooks-reference.html#useref) to attach to the outer element. We must [apply it](#basic-usage) for using this hook.

#### innerRef

`React.useRef<HTMLElement>`

A [ref](https://reactjs.org/docs/hooks-reference.html#useref) to attach to the inner element. We must [apply it](#basic-usage) for using this hook.

#### items

`Object[]`

The virtualized items for rendering rows/columns. Each item is an `object` that contains the following properties:

| Name        | Type              | Description                                                                                                     |
| ----------- | ----------------- | --------------------------------------------------------------------------------------------------------------- |
| index       | number            | The index of the item.                                                                                          |
| size        | number            | The fixed/variable/measured size of the item.                                                                   |
| width       | number            | The current content width of the outer element. It's useful for a [RWD row/column](#responsive-web-design-rwd). |
| start       | number            | The starting position of the item. We might only need this when [working with grids](#layout-items).            |
| isScrolling | true \| undefined | An indicator to show a placeholder or [optimize performance](#use-isscrolling-indicator) for the item.          |
| isSticky    | true \| undefined | An indicator to make certain items become [sticky in the list](#sticky-headers).                                |
| measureRef  | Function          | It's used to measure an item with [dynamic](#dynamic-size) or [real-time](#real-time-resize) heights/widths.    |

#### scrollTo

`(offsetOrOptions: number | Object, callback?: () => void) => void`

This method allows us to scroll to the specified offset from top/left, depending on the [horizontal](#horizontal) option.

```js
// Basic usage
scrollTo(500);

// Using options
scrollTo({
  offset: 500,
  smooth: true, // Enable/disable smooth scrolling (default = false)
});
```

> 💡 It's possible to customize the easing effect of the smoothly scrolling, see the [example](#smooth-scrolling) to learn more.

#### scrollToItem

`(indexOrOptions: number | Object, callback?: () => void) => void`

This method allows us to scroll to the specified item.

```js
// Basic usage
scrollToItem(10);

// Using options
scrollTo({
  index: 10,
  // Control the alignment of the item, acceptable values are: "auto" (default) | "start" | "center" | "end"
  // Using "auto" will scroll the item into the view at the start or end, depending on which is closer
  align: "auto",
  // Enable/disable smooth scrolling (default = false)
  smooth: true,
});
```

> 💡 It's possible to customize the easing effect of the smoothly scrolling, see the [example](#smooth-scrolling) to learn more.

## Others

### Performance Optimization

Items are re-rendered whenever the user scrolls. If your item is a **heavy data component**, there're two strategies for performance optimization.

#### Use [React.memo](https://reactjs.org/docs/react-api.html#reactmemo)

When working with **non-dynamic size**, we can extract the item to it's own component and wrap it with `React.memo`. It shallowly compares the current props and the next props to avoid unnecessary re-renders.

```js
import { memo } from "react";
import useVirtual from "react-cool-virtual";

const MemoizedItem = memo(({ height, ...rest }) => {
  // A lot of heavy computing here... 🤪

  return (
    <div {...rest} style={{ height: `${height}px` }}>
      🐳 Am I heavy?
    </div>
  );
});

const List = () => {
  const { outerRef, innerRef, items } = useVirtual({
    itemCount: 1000,
    itemSize: 75,
  });

  return (
    <div
      style={{ width: "300px", height: "300px", overflow: "auto" }}
      ref={outerRef}
    >
      <div ref={innerRef}>
        {items.map(({ index, size }) => (
          <MemoizedItem key={index} height={size} />
        ))}
      </div>
    </div>
  );
};
```

#### Use `isScrolling` Indicator

If the above solution can't meet your case or you're working with **dynamic size**. React Cool Virtual supplies you an `isScrolling` indicator that allows you to replace the heavy component with a light one while the user is scrolling.

```js
import { forwardRef } from "react";
import useVirtual from "react-cool-virtual";

const HeavyItem = forwardRef((props, ref) => {
  // A lot of heavy computing here... 🤪

  return (
    <div {...props} ref={ref}>
      🐳 Am I heavy?
    </div>
  );
});

const LightItem = (props) => <div {...props}>🦐 I believe I can fly...</div>;

const List = () => {
  const { outerRef, innerRef, items } = useVirtual({
    itemCount: 1000,
    useIsScrolling: true, // Just use it (default = false)
    // or
    useIsScrolling: (speed) => speed > 50, // Use it based on the scroll speed (more user friendly)
  });

  return (
    <div
      style={{ width: "300px", height: "300px", overflow: "auto" }}
      ref={outerRef}
    >
      <div ref={innerRef}>
        {items.map(({ index, isScrolling, measureRef }) =>
          isScrolling ? (
            <LightItem key={index} />
          ) : (
            <HeavyItem key={index} ref={measureRef} />
          )
        )}
      </div>
    </div>
  );
};
```

> 💡 Well... the `isScrolling` can also be used in many other ways, please use your imagination 🤗.

### How to Share A `ref`?

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

### Layout Items

React Cool Virtual is designed to [simplify the styling and keep all the items in the document flow for rows/columns](#basic-usage). However, when working with grids, we need to layout the items in two-dimensional. For that reason, we also provide the [start](#items) property for you to achieve it.

```js
import { Fragment } from "react";
import useVirtual from "react-cool-virtual";

const Grid = () => {
  const row = useVirtual({
    itemCount: 1000,
  });
  const col = useVirtual({
    horizontal: true,
    itemCount: 1000,
    itemSize: 100,
  });

  return (
    <div
      style={{ width: "400px", height: "400px", overflow: "auto" }}
      ref={(el) => {
        row.outerRef.current = el;
        col.outerRef.current = el;
      }}
    >
      <div
        style={{ position: "relative" }}
        ref={(el) => {
          row.innerRef.current = el;
          col.innerRef.current = el;
        }}
      >
        {row.items.map((rowItem) => (
          <Fragment key={rowItem.index}>
            {col.items.map((colItem) => (
              <div
                key={colItem.index}
                style={{
                  position: "absolute",
                  height: `${rowItem.size}px`,
                  width: `${colItem.size}px`,
                  // The `start` property can be used for positioning the items
                  transform: `translateX(${colItem.start}px) translateY(${rowItem.start}px)`,
                }}
              >
                ⭐️ {rowItem.index}, {colItem.index}
              </div>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
};
```

### Working in TypeScript

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

### ResizeObserver Polyfill

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

## To Do... <!-- omit in toc -->

- [ ] Unit testing (WIP)
- [ ] Supports chat
- [ ] `scrollBy` method

## Contributors ✨ <!-- omit in toc -->

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
