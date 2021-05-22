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

<p align="center">A tiny React hook for rendering large data like a breeze.</p>

<div align="center">

[![npm version](https://img.shields.io/npm/v/react-cool-virtual?style=flat-square)](https://www.npmjs.com/package/react-cool-virtual)
[![npm downloads](https://img.shields.io/npm/dt/react-cool-virtual?style=flat-square)](https://www.npmtrends.com/react-cool-virtual)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/react-cool-virtual?style=flat-square)](https://bundlephobia.com/result?p=react-cool-virtual)
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)

</div>

- ♻️ Renders millions of items with highly performant way, using [DOM recycling](https://developers.google.com/web/updates/2016/07/infinite-scroller).
- 🎣 Easy to use, based on React [hook](https://reactjs.org/docs/hooks-custom.html#using-a-custom-hook).
- 💅🏼 Apply styles without hassle, just [few steps](#TBC).
- ✨ Supports [fixed](#TBC),[variable](#TBC), [dynamic](#TBC), and [real-time dynamic](#TBC) heights/widths.
- 🖥 Supports [responsive web design (RWD)](#TBC) for better UX.
- 🧻 Built-ins [load more event](#TBC) for you to deal with infinite scroll without struggle.
- 🖱 Imperative [scroll-to controls](#TBC) for offset, index, and smooth scrolling.
- 🗄️ Supports [server-side rendering](#TBC) for faster [FCP](https://developers.google.com/web/updates/2019/02/rendering-on-the-web#server-rendering) and better SEO.
- 📜 Supports [TypeScript](#working-in-typescript) type definition.
- 🎛 Super flexible [API](#api) design, built with DX in mind.
- 🦔 A tiny size ([~ 2.5kB gzipped](https://bundlephobia.com/result?p=react-cool-virtual)) library, it's completely self-contained.

## Getting Started

Coming soon...

### Requirement

To use `react-cool-virtual`, you must use `react@16.8.0` or greater which includes hooks.

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

## Examples

Coming soon...

## Working in TypeScript

Coming soon...

## API

Coming soon...

## ResizeObserver Polyfill

[ResizeObserver has good support amongst browsers](https://caniuse.com/?search=ResizeObserver), but it's not universal. You'll need to use polyfill for browsers that don't support it. Polyfills is something you should do consciously at the application level. Therefore `react-cool-virtual` doesn't include it.

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
