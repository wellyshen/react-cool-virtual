# react-cool-virtual

## 0.0.27

### Patch Changes

- [#97](https://github.com/wellyshen/react-cool-virtual/pull/97) [`79ae7bd`](https://github.com/wellyshen/react-cool-virtual/commit/79ae7bdaa2a50a7bed85079f5f2cbd6bf08c75e0) Thanks [@wellyshen](https://github.com/wellyshen)! - fix: `scrollToItem` causes empty items when working with dynamic size

## 0.0.26

### Patch Changes

- [#96](https://github.com/wellyshen/react-cool-virtual/pull/96) [`90e093c`](https://github.com/wellyshen/react-cool-virtual/commit/90e093c92459cdc6a79baa765eba0347bc1f56cf) Thanks [@wellyshen](https://github.com/wellyshen)! - fix: the callback of `scrollTo` not called when scroll to the same position

* [#91](https://github.com/wellyshen/react-cool-virtual/pull/91) [`f244c41`](https://github.com/wellyshen/react-cool-virtual/commit/f244c4150832bd196f5fb8309c6723278fe01cd0) Thanks [@wellyshen](https://github.com/wellyshen)! - perf: slightly performance improvement

- [#95](https://github.com/wellyshen/react-cool-virtual/pull/95) [`ddc2846`](https://github.com/wellyshen/react-cool-virtual/commit/ddc2846676b4e2fe18eafc82eeb8fd668463e695) Thanks [@wellyshen](https://github.com/wellyshen)! - fix: wrong the scroll position of `scrollToItem` when working with dynamic size

* [#94](https://github.com/wellyshen/react-cool-virtual/pull/94) [`6a17acb`](https://github.com/wellyshen/react-cool-virtual/commit/6a17acbc9d258c1a96f419f82f8dfcf31b5abe64) Thanks [@wellyshen](https://github.com/wellyshen)! - fix: pass correct args to `scrollToItem` method

- [#93](https://github.com/wellyshen/react-cool-virtual/pull/93) [`0e187f9`](https://github.com/wellyshen/react-cool-virtual/commit/0e187f93a48011e14ad45dc8d0e50249e4d65e3a) Thanks [@wellyshen](https://github.com/wellyshen)! - fix: the callback of `scrollToItem` is called twice

## 0.0.25

### Patch Changes

- [#88](https://github.com/wellyshen/react-cool-virtual/pull/88) [`b5d483d`](https://github.com/wellyshen/react-cool-virtual/commit/b5d483d9a151113b30dc08c64a583416a355d550) Thanks [@wellyshen](https://github.com/wellyshen)! - fix: fallback tp default item size for SSR items

## 0.0.24

### Patch Changes

- [#86](https://github.com/wellyshen/react-cool-virtual/pull/86) [`3c55e86`](https://github.com/wellyshen/react-cool-virtual/commit/3c55e864595784b14b21df924bfd0621f068d08b) Thanks [@wellyshen](https://github.com/wellyshen)! - refactor: rename `loadMoreThreshold` option to `loadMoreCount`

## 0.0.23

### Patch Changes

- [#80](https://github.com/wellyshen/react-cool-virtual/pull/80) [`48ab76f`](https://github.com/wellyshen/react-cool-virtual/commit/48ab76f782eb229acf58895970adce61b7017696) Thanks [@wellyshen](https://github.com/wellyshen)! - fix: dynamic size scroll jumping

## 0.0.22

### Patch Changes

- [#79](https://github.com/wellyshen/react-cool-virtual/pull/79) [`1d3a212`](https://github.com/wellyshen/react-cool-virtual/commit/1d3a2129ada64bbda267d20c2a4aef4e53cd8514) Thanks [@wellyshen](https://github.com/wellyshen)! - refactor: export item size for SSR items

* [#73](https://github.com/wellyshen/react-cool-virtual/pull/73) [`2157b91`](https://github.com/wellyshen/react-cool-virtual/commit/2157b915817068699af94f2cc24cbe763cf0cadb) Thanks [@wellyshen](https://github.com/wellyshen)! - fix: resize-observer broken on Safari

- [#76](https://github.com/wellyshen/react-cool-virtual/pull/76) [`7d99d03`](https://github.com/wellyshen/react-cool-virtual/commit/7d99d03f83b647bbe3c9e0e67d46dfeefa6e7fa1) Thanks [@wellyshen](https://github.com/wellyshen)! - fix: real-time resize jumping

* [#75](https://github.com/wellyshen/react-cool-virtual/pull/75) [`616507f`](https://github.com/wellyshen/react-cool-virtual/commit/616507fb9d4698a779f300e5244f1b2f84c1456b) Thanks [@wellyshen](https://github.com/wellyshen)! - fix: `isScrolling` flash bug

- [#77](https://github.com/wellyshen/react-cool-virtual/pull/77) [`ff59175`](https://github.com/wellyshen/react-cool-virtual/commit/ff59175c10f2655c83ab91d1eb91e8b330699b82) Thanks [@wellyshen](https://github.com/wellyshen)! - perf: cache measurements for better performance

* [#78](https://github.com/wellyshen/react-cool-virtual/pull/78) [`669f6c2`](https://github.com/wellyshen/react-cool-virtual/commit/669f6c2eb6e9c083a7d6dcbc4368bd0df35a16f6) Thanks [@wellyshen](https://github.com/wellyshen)! - refactor: remove `keyExtractor` option

## 0.0.21

### Patch Changes

- [#72](https://github.com/wellyshen/react-cool-virtual/pull/72) [`97882ac`](https://github.com/wellyshen/react-cool-virtual/commit/97882ac9bac267bf0ce9e0d917bbaff7adab9995) Thanks [@wellyshen](https://github.com/wellyshen)! - fix: RWD not working

* [`eaf35c9`](https://github.com/wellyshen/react-cool-virtual/commit/eaf35c9bf5c4cc9ee9d98b39a2e63cfcd47625fa) Thanks [@wellyshen](https://github.com/wellyshen)! - perf: limit the cache number of resize observers with the length of items

## 0.0.20

### Patch Changes

- [#69](https://github.com/wellyshen/react-cool-virtual/pull/69) [`3201739`](https://github.com/wellyshen/react-cool-virtual/commit/32017392ea07309b9951eacbd91fdcfa9c66c6ed) Thanks [@wellyshen](https://github.com/wellyshen)! - fix: infinite scroll causes dynamic size item jumping

## 0.0.19

### Patch Changes

- [#68](https://github.com/wellyshen/react-cool-virtual/pull/68) [`ecbbfc9`](https://github.com/wellyshen/react-cool-virtual/commit/ecbbfc91131934ccecd11551036a1bdbb1144d03) Thanks [@wellyshen](https://github.com/wellyshen)! - fix: load more callback not working

* [`78dfd4d`](https://github.com/wellyshen/react-cool-virtual/commit/78dfd4dc7094910da8ddc2adbe4956be0e5526bd) Thanks [@wellyshen](https://github.com/wellyshen)! - refactor: extract common `measureItems` method

- [`8defe38`](https://github.com/wellyshen/react-cool-virtual/commit/8defe3819bef5d124a92e79151b4d17ab3557a8f) Thanks [@wellyshen](https://github.com/wellyshen)! - refactor(types): remove unnecessary type generics

* [`bcc59cf`](https://github.com/wellyshen/react-cool-virtual/commit/bcc59cfea997977480f72270b379657f6391dff6) Thanks [@wellyshen](https://github.com/wellyshen)! - Chore: update keywords

## 0.0.18

### Patch Changes

- [#63](https://github.com/wellyshen/react-cool-virtual/pull/63) [`01ca818`](https://github.com/wellyshen/react-cool-virtual/commit/01ca81813d0a664254e12e14814daab244615a88) Thanks [@wellyshen](https://github.com/wellyshen)! - fix: `scrollToItem` method not working with dynamic size

## 0.0.17

### Patch Changes

- [`bf7d25b`](https://github.com/wellyshen/react-cool-virtual/commit/bf7d25be40d2a6551a7741a710fb99da743dd3e1) Thanks [@wellyshen](https://github.com/wellyshen)! - fix: correct the high of bindary-search for finding the item index from scroll

## 0.0.16

### Patch Changes

- [#60](https://github.com/wellyshen/react-cool-virtual/pull/60) [`c25f06d`](https://github.com/wellyshen/react-cool-virtual/commit/c25f06d68c6398511222aa3ee046de8351a6a9f6) Thanks [@wellyshen](https://github.com/wellyshen)! - feat: support enable/disable `isScrolling` property of items by speed

* [#58](https://github.com/wellyshen/react-cool-virtual/pull/58) [`a594ab7`](https://github.com/wellyshen/react-cool-virtual/commit/a594ab7568c5e67578b917f28c6d1e418c472e62) Thanks [@wellyshen](https://github.com/wellyshen)! - perf: performance improvement

## 0.0.15

### Patch Changes

- [#52](https://github.com/wellyshen/react-cool-virtual/pull/52) [`bdf44c9`](https://github.com/wellyshen/react-cool-virtual/commit/bdf44c9309ea60a7d7ebf92f765b63bbf2395764) Thanks [@wellyshen](https://github.com/wellyshen)! - perf: performance improvement for large data of grid

* [#56](https://github.com/wellyshen/react-cool-virtual/pull/56) [`282aeb0`](https://github.com/wellyshen/react-cool-virtual/commit/282aeb0dadf780e9077d607bbc0d5396841158de) Thanks [@wellyshen](https://github.com/wellyshen)! - fix: scroll position behavior

- [#54](https://github.com/wellyshen/react-cool-virtual/pull/54) [`919144d`](https://github.com/wellyshen/react-cool-virtual/commit/919144d5bb54b91005a2548360204db7b53f22ed) Thanks [@wellyshen](https://github.com/wellyshen)! - feat: new `onResize` event

* [#55](https://github.com/wellyshen/react-cool-virtual/pull/55) [`9a80031`](https://github.com/wellyshen/react-cool-virtual/commit/9a800313fdf2fb6235212b503367c77632b538c6) Thanks [@wellyshen](https://github.com/wellyshen)! - perf: improvement the performance of calculating scroll offset

## 0.0.14

### Patch Changes

- [`d048609`](https://github.com/wellyshen/react-cool-virtual/commit/d048609efa24cc305c753486ef7c3516fe800060) Thanks [@wellyshen](https://github.com/wellyshen)! - perf: performance improvement

## 0.0.13

### Patch Changes

- [`c1ab0a0`](https://github.com/wellyshen/react-cool-virtual/commit/c1ab0a0d8139602733a4f06a4f3b563cc85d3496) Thanks [@wellyshen](https://github.com/wellyshen)! - perf: slightly performance improvement

* [`40c1fec`](https://github.com/wellyshen/react-cool-virtual/commit/40c1fec7868bbad68aa8cc77aa7e66ec003e770f) Thanks [@wellyshen](https://github.com/wellyshen)! - fix: correct the value of event objects

## 0.0.12

### Patch Changes

- [`c51eee7`](https://github.com/wellyshen/react-cool-virtual/commit/c51eee75d0832c29acfcbe769b068ad9eff88f6e) Thanks [@wellyshen](https://github.com/wellyshen)! - perf: slightly performance improvement

## 0.0.11

### Patch Changes

- [#40](https://github.com/wellyshen/react-cool-virtual/pull/40) [`fdc3aef`](https://github.com/wellyshen/react-cool-virtual/commit/fdc3aef2c4a0b0214b3c038466db96524cffcd16) Thanks [@wellyshen](https://github.com/wellyshen)! - perf: performance improvement for real-time resize

## 0.0.10

### Patch Changes

- [#35](https://github.com/wellyshen/react-cool-virtual/pull/35) [`07e2e35`](https://github.com/wellyshen/react-cool-virtual/commit/07e2e355504b2f0c60e1ffe55ab635af5508e171) Thanks [@wellyshen](https://github.com/wellyshen)! - Fix(useVirtual): real-time dynamic size not working

## 0.0.9

### Patch Changes

- [#31](https://github.com/wellyshen/react-cool-virtual/pull/31) [`3fb42de`](https://github.com/wellyshen/react-cool-virtual/commit/3fb42de49f02005559b4979e82436bf366936cf3) Thanks [@wellyshen](https://github.com/wellyshen)! - Fix(useVirtual): fix the randomly grid cells when working with dynamic size

## 0.0.8

### Patch Changes

- [#29](https://github.com/wellyshen/react-cool-virtual/pull/29) [`0488cbf`](https://github.com/wellyshen/react-cool-virtual/commit/0488cbfe1223ca6979246a8bc47615fa249050ae) Thanks [@wellyshen](https://github.com/wellyshen)! - Fix(useVirtual): correct the `start` value of `items`

## 0.0.7

### Patch Changes

- [#28](https://github.com/wellyshen/react-cool-virtual/pull/28) [`e55c138`](https://github.com/wellyshen/react-cool-virtual/commit/e55c138be22f67a73c1f76b59217417c5bc13f47) Thanks [@wellyshen](https://github.com/wellyshen)! - Feat(useVirtual): support table

* [#24](https://github.com/wellyshen/react-cool-virtual/pull/24) [`8ff6c76`](https://github.com/wellyshen/react-cool-virtual/commit/8ff6c7697b3e979c43ca8a1070c41afa1ad702d4) Thanks [@wellyshen](https://github.com/wellyshen)! - Refactor(useVirtual): rename the event properties of `onScroll` from `itemStartIndex/itemStopIndex` to `visibleStartIndex/visibleStopIndex`

- [#27](https://github.com/wellyshen/react-cool-virtual/pull/27) [`ccb66c1`](https://github.com/wellyshen/react-cool-virtual/commit/ccb66c13109b3aaf137cc851a4ecdef9f09f2740) Thanks [@wellyshen](https://github.com/wellyshen)! - Fix(types): correct the type of `outerRef` and `innerRef`

* [#26](https://github.com/wellyshen/react-cool-virtual/pull/26) [`b7480d0`](https://github.com/wellyshen/react-cool-virtual/commit/b7480d0c63fee707f2b3ce468716d45bd3fa27de) Thanks [@wellyshen](https://github.com/wellyshen)! - Fix(types): correct the type of `outerRef` and `innerRef`
