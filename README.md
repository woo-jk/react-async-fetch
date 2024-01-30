# react-async-fetch

비동기 통신 처리 작업을 쉽게 해주는 React Hooks 모듈입니다.

[tanstack-query](https://tanstack.com/query/latest)와 유사하지만, 캐싱과 같이 다른 무거운 기능들은 제거하고 `비동기 처리` 기능에만 집중한 라이브러리입니다.

# 설치 방법

Using npm:

```
npm i react-async-fetch
```

Using yarn:

```
yarn add react-async-fetch
```

# 사용 방법

in ES Module:

```js
import { useFetch, useMutation, useSuspenseFetch } from "react-async-fetch";
```

in CommonJS:

```js
const { useFetch, useMutation, useSuspenseFetch } = require("react-async-fetch");
```

# useFetch

서버로부터 데이터를 요청 할 때의 비동기 처리 로직을 쉽게 다룰 수 있게 해주는 React Hook입니다.

```js
const { result, status, isLoading, isError, error, clearResult, refetch } = useFetch(request, {
  enabled,
  suspense,
  errorBoundary,
  refetchInterval,
  onSuccess,
  onError,
});
```

### Options

- `request: () => Promise<T>`
  - _Required_
  - 데이터를 요청하는데 필요한 비동기 함수입니다.
  - `fetch`, `axios` 등을 사용한 통신 요청 함수가 필요합니다.
- `enabled: boolean`
  - _Optional_
  - Default: `true`
  - `enabled`가 `false`라면, request는 실행되지 않습니다.
- `suspense: boolean`
  - _Optional_
  - Default: `true`
  - `suspense`가 `true`라면, 요청이 `pending` 상태일 때 가장 가까운 상위 *Suspense*가 작동합니다.
  - 데이터 요청 Promise가 throw 됩니다.
- `errorBoundary: boolean`
  - _Optional_
  - Default: `true`
  - `errorBoundary`가 `true`라면, 요청이 `rejected` 상태가 될 때 가장 가까운 상위 *Error Boundary*가 작동합니다.
- `refetchInterval: number`
  - _Optional_
  - `refetchInterval`의 숫자를 설정한다면, 해당 밀리초마다 request를 다시 실행합니다.
- `onSuccess: (result: T) => void | Promise<void>`
  - _Optional_
  - request가 데이터를 성공적으로 가져왔을 때 실행되는 함수입니다.
- `onError: (error: Error) => void`
  - _Optional_
  - request가 데이터를 가져오는데 실패했을 때 실행되는 함수입니다.

### Returns

- `result: T | null`
  - request로 가져온 데이터입니다.
  - request가 실패했거나, 아직 요청 중인 상태일 경우 `null` 값을 가집니다.
- `status: "success" | "pending" | "error"`
  - request에 대한 현재 상태입니다.
  - `success`: request가 성공적으로 이루어진 상태입니다.
  - `pending`: request가 진행중인 상태입니다.
  - `error`: request 중 에러가 발생한 상태입니다.
- `isLoading: boolean`
  - request가 진행 중인 경우 `true` 값을 가집니다.
- `isError: boolean`
  - request가 실패했을 때 `true` 값을 가집니다.
- `error: Error`
  - request가 실패했을 때 발생한 에러 객체 값을 가집니다.
- `clearResult: () => void`
  - `result` 값을 `null`로 설정하는 함수입니다.
- `refetch: () => void`
  - request를 재시도 하는 함수입니다.

# useMutation

서버의 데이터를 변경 시킬 때의 요청에 대한 비동기 처리 로직을 쉽게 다룰 수 있게 해주는 React Hook입니다.

```js
const {
  mutate
  result,
  status,
  isLoading,
  isError,
  error
} = useMutation(request, {
  errorBoundary,
  onSuccess,
  onError,
})
```

### Options

- `request: () => Promise<T>`
  - _Required_
  - 서버로 요청하는데 필요한 비동기 함수입니다.
  - `fetch`, `axios` 등을 사용한 통신 요청 함수가 필요합니다.
- `errorBoundary: boolean`
  - _Optional_
  - Default: `true`
  - `errorBoundary`가 `true`라면, 요청이 `rejected` 상태가 될 때 가장 가까운 상위 *Error Boundary*가 작동합니다.
- `onSuccess: (result: T) => void | Promise<void>`
  - _Optional_
  - request가 성공했을 때 실행되는 함수입니다.
- `onError: (error: Error) => void`
  - _Optional_
  - request가 실패했을 때 실행되는 함수입니다.

### Returns

- `mutate: () => Promise<T>`
  - request를 트리거하는 함수입니다.
  - request의 결과 데이터를 반환합니다.
- `result: T | null`
  - request로 가져온 데이터입니다.
  - request가 실패했거나, 아직 요청 중인 상태일 경우 `null` 값을 가집니다.
- `status: "default" | "pending" | "fulfilled" | "error"`
  - request에 대한 현재 상태입니다.
  - `default`: request가 아직 실행되지 않은 상태입니다.
  - `pending`: request가 진행중인 상태입니다.
  - `fulfilled`: request가 성공적으로 이루어진 상태입니다.
  - `error`: request 중 에러가 발생한 상태입니다.
- `isLoading: boolean`
  - request가 진행 중인 경우 `true` 값을 가집니다.
- `isError: boolean`
  - request가 실패했을 때 `true` 값을 가집니다.
- `error: Error`
  - request가 실패했을 때 발생한 에러 객체 값을 가집니다.

# useSuspenseFetch

서버 통신 비동기 처리를 Suspense와 ErrorBoundary로 쉽게 다룰 수 있게 해주는 React Hook입니다.

`suspense:true` 옵션을 사용하는 `useFetch`와 다른 점은, `result` 타입에 `null`이 포함되지 않고, 확정적으로 데이터를 가져올 수 있다는 장점이 있습니다.
다만, 요청한 데이터에 대한 캐싱 작업을 수행하기 때문에 `requestKey` 인자가 필요합니다.

```js
const { result, status, error, refetch } = useFetch(requestKey, request);
```

### Options

- `requestKey: string`
  - _Required_
  - 데이터를 요청 캐싱에 사용하는 key입니다.
  - request key를 통해 요청에 대한 데이터 값이 캐싱됩니다.
  - 각 요청마다 고유의 key 값을 사용해야 합니다.
- `request: () => Promise<T>`
  - _Required_
  - 데이터를 요청하는데 필요한 비동기 함수입니다.
  - `fetch`, `axios` 등을 사용한 통신 요청 함수가 필요합니다.

### Returns

- `result: T | null`
  - request로 가져온 데이터입니다.
  - request가 실패했거나, 아직 요청 중인 상태일 경우 `null` 값을 가집니다.
- `status: "success" | "pending" | "error"`
  - request에 대한 현재 상태입니다.
  - `success`: request가 성공적으로 이루어진 상태입니다.
  - `pending`: request가 진행중인 상태입니다.
  - `error`: request 중 에러가 발생한 상태입니다.
- `error: Error`
  - request가 실패했을 때 발생한 에러 객체 값을 가집니다.
- `refetch: () => void`
  - request를 재시도 하는 함수입니다.

# License

MIT
