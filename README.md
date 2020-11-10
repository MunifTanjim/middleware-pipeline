[![GitHub Workflow Status: CI](https://img.shields.io/github/workflow/status/MunifTanjim/middleware-pipeline/CI?label=CI&style=for-the-badge)](https://github.com/MunifTanjim/middleware-pipeline/actions?query=workflow%3ACI)
[![Version](https://img.shields.io/npm/v/middleware-pipeline?style=for-the-badge)](https://npmjs.org/package/middleware-pipeline)
[![Coverage](https://img.shields.io/codecov/c/gh/MunifTanjim/middleware-pipeline?style=for-the-badge)](https://codecov.io/gh/MunifTanjim/middleware-pipeline)
[![License](https://img.shields.io/github/license/MunifTanjim/middleware-pipeline?style=for-the-badge)](https://github.com/MunifTanjim/middleware-pipeline/blob/main/LICENSE)

# Middleware Pipeline

Simple Middleware Pipeline

## Installation

```sh
# using yarn:
yarn add middleware-pipeline

# using npm:
npm install --save middleware-pipeline
```

## Usage

```ts
import { Pipeline } from 'middleware-pipeline'
import type { Middleware } from 'middleware-pipeline'

type Context = {
  value: number
}

// create a middleware pipeline
const pipeline = Pipeline<Context>(
  // with an initial middleware
  (ctx, next) => {
    console.log(ctx)
    next()
  }
)

// add some more middlewares
pipeline.push(
  (ctx, next) => {
    ctx.value = ctx.value + 21
    next()
  },
  (ctx, next) => {
    ctx.value = ctx.value * 2
    next()
  }
)

const terminatingMiddleware: Middleware<Context> = (ctx, next) => {
  console.log(ctx)
  // not calling `next()`
}

// add the terminating middleware
pipeline.push(terminatingMiddleware)

// add another one for fun ¯\_(ツ)_/¯
pipeline.push((ctx, next) => {
  console.log('this will not be logged')
})

// execute the pipeline with initial value of `ctx`
pipeline.execute({ value: 0 })
```

## License

Licensed under the MIT License. Check the [LICENSE](./LICENSE) file for details.
