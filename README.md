# Airplane Node.js SDK [![Docs](https://img.shields.io/github/v/tag/airplanedev/node-sdk?label=docs)](https://docs.airplane.dev) [![License](https://img.shields.io/github/license/airplanedev/node-sdk)](https://github.com/airplanedev/node-sdk/blob/main/LICENSE) [![CI status](https://img.shields.io/github/workflow/status/airplanedev/node-sdk/test/main)](https://github.com/airplanedev/node-sdk/actions?query=branch%3Amain)

Node.js SDK for writing Airplane.dev tasks in JavaScript and TypeScript.

## Getting started

```sh
npm install airplane
```

## Usage

To write a Node.js task in Airplane, create a `.js` or `.ts` file and export a function like so:

```js
import airplane from 'airplane'

export default async function(parameters) {
  airplane.output(`Hello, ${parameters.name}!`)
}
```

You can configure the parameters that your task will receive in the [Airplane UI](http://app.airplane.dev/). Those parameters will be passed to the `parameters` argument of your function as an object keyed by the parameter slugs you see in the UI.

To execute your task, you will need to first [install the Airplane CLI](https://docs.airplane.dev/getting-started/install-the-airplane-cli).

Once you've done that, you can execute your task locally:

```sh
airplane execute ./path/to/file.js -- --name=World
```

Once that looks good, go ahead and deploy your task to Airplane and give it a run in the UI!

```sh
airplane deploy ./path/to/file.js
```

