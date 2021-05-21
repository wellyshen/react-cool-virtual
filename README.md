<h1 align="center">
  <br />
  ♻️
  <br />
  react-cool-virtual
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

- ♻️ Renders millions of items without costing extra performance/memory, using [DOM recycling](https://developers.google.com/web/updates/2016/07/infinite-scroller) technique.
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

## Installation

Coming soon...

## Examples

Coming soon...

## Working in TypeScript

Coming soon...

## API

Coming soon...

## ResizeObserver Polyfill

[ResizeObserver has good support amongst browsers](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver), but it's not universal. You'll need to use polyfill for browsers that don't support it. Polyfills is something you should do consciously at the application level. Therefore `react-cool-virtual` doesn't include it.

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
