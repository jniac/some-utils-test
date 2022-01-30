# some-utils-test
some tests for `some-utils`

## I know
Using `yarn` with [the js test suit](https://www.npmjs.com/package/tap) of [the npm inventor](https://github.com/isaacs), really?

## Dev & test

```
yarn start
```

will execute `scripts/dev.mjs` which will watch two folder in `src`:
- `src/some-utils`: if any changes rebuild
- `src/some-tests`: if any changes run the tests
