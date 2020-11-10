import { Pipeline } from './index'
import type { Middleware } from './index'

test('invokes initial middlewares', () => {
  type Context = { value: number }

  const context: Context = { value: 0 }

  const mockFn = jest.fn()

  const plusOne: Middleware<Context> = (ctx, next) => {
    ctx.value += 1
    mockFn(ctx.value)
    next()
  }

  const pipeline = Pipeline<Context>(plusOne, plusOne)

  pipeline.execute(context)

  expect(context.value).toMatchInlineSnapshot(`2`)

  expect(mockFn).toHaveBeenCalledTimes(2)
  expect(mockFn.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        1,
      ],
      Array [
        2,
      ],
    ]
  `)
})

test('invokes pushed middlewares', () => {
  type Context = { value: number }

  const context: Context = { value: 0 }

  const mockFn = jest.fn()

  const plusOne: Middleware<Context> = (ctx, next) => {
    ctx.value += 1
    mockFn(ctx.value)
    next()
  }

  const pipeline = Pipeline<Context>(plusOne)
  pipeline.push(plusOne)

  pipeline.execute(context)

  expect(context.value).toMatchInlineSnapshot(`2`)

  expect(mockFn).toHaveBeenCalledTimes(2)
  expect(mockFn.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        1,
      ],
      Array [
        2,
      ],
    ]
  `)
})

test('supports async middlewares', async () => {
  type Context = { value: number }

  const context: Context = { value: 0 }

  const mockFn = jest.fn()

  const middleware: Middleware<Context> = async (ctx, next) => {
    await new Promise((resolve) => {
      setTimeout(() => {
        ctx.value += 1
        resolve()
      })
    })

    await next()
  }

  const pipeline = Pipeline<Context>(async (ctx, next) => {
    mockFn(ctx.value)
    await next()
    mockFn(ctx.value)
  })

  pipeline.push(middleware, middleware)

  await pipeline.execute(context)

  expect(context.value).toMatchInlineSnapshot(`2`)

  expect(mockFn).toHaveBeenCalledTimes(2)
  expect(mockFn.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        0,
      ],
      Array [
        2,
      ],
    ]
  `)
})

test('throws on multiple next() calls', async () => {
  type Context = { value: number }

  const middleware: Middleware<Context> = async (ctx, next) => {
    await new Promise((resolve) => {
      setTimeout(() => {
        ctx.value += 1
        resolve()
      })
    })

    await next()
    await next()
  }

  const pipeline = Pipeline<Context>(middleware, middleware)

  const ctx: Context = { value: 0 }

  try {
    await pipeline.execute(ctx)
  } catch (err) {
    expect(err).toMatchInlineSnapshot(`[Error: next() called multiple times]`)
  }
})
