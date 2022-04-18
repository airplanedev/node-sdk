# Airplane Node.js SDK [![npm](https://img.shields.io/github/v/tag/airplanedev/node-sdk?label=npm)](https://www.npmjs.com/package/airplane) [![License](https://img.shields.io/github/license/airplanedev/node-sdk)](https://github.com/airplanedev/node-sdk/blob/main/LICENSE) [![Docs](https://img.shields.io/badge/Docs-airplane-blue)](https://docs.airplane.dev/creating-tasks/node) [![CI status](https://img.shields.io/github/workflow/status/airplanedev/node-sdk/tests/main)](https://github.com/airplanedev/node-sdk/actions?query=branch%3Amain)

SDK for writing [Airplane](https://airplane.dev) tasks in JavaScript and TypeScript.

## Getting started

```sh
npm install airplane
```

## Usage

To write a Node.js task in Airplane, create a `.js` or `.ts` file and export a function like so:

```js
import airplane from 'airplane'

export default async function (params) {
  return `Hello, ${params.name}!`
}
```

You can configure the parameters that your task will receive in the [Airplane UI](http://app.airplane.dev/). They'll be passed through the `params` argument to your function as an object keyed by the slugs you see in the UI.

To execute your task, first [install the Airplane CLI](https://docs.airplane.dev/platform/airplane-cli).

Once installed, execute your task locally:

```sh
airplane dev ./path/to/file.js -- --name=World
```

If that looks good, deploy your task to Airplane then give it a [run in the UI](https://app.airplane.dev/library)!

```sh
airplane deploy ./path/to/file.js
```

