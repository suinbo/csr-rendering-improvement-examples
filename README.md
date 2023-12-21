# CSR 환경 렌더링 최적화 예제

### Environment

-   [nodejs] - v.18.18.2
-   [reactjs] - v.18.2.37
-   [vite] - v.5.0.7

### Main Plugins

-   [react-router-dom] - Routing (v.6.20.1)
-   [react-query] - Data caching & Auto fetch (v.3.39.3)

### Development

will be run at local-environment

```bash
yarn dev
```

### Setting

-   Node.js 모듈 사용시

    -   tsconfig.json에 아래 설정 추가

    ```
    {
      "compilerOptions": {
        "types": ["node"]
      }
    }
    ```

    -   @types/node 패키지 설치: `npm install --save-dev @types/node`

## Note 1

### [목표]

```
CSR 환경에서의 렌더링 최적화 방안을 여러 예제를 통해 학습한다.
```

### [예제]

1. react-query의 suspense 옵션을 활용한 API 병렬 요청

    - **[문제]**
      react-query 를 할용하여 하나의 컴포넌트에서 여러 개의 데이터 호출하는 경우,
      선언적 로딩 처리를 위해 두 개의 useQuery에 `suspense: true` 옵션을 추가하면 API 가 순차적으로 호출 되는데
      호출하는 API 수가 늘어날수록 화면 렌더링 끝나는 시점이 느려짐 (비효율)

        - **[분석 1]**
          두 개의 useQuery에 `suspense: true` 옵션을 추가하면 (선언적 로딩 처리 시),
          첫번째 쿼리가 내부적으로 Promise 를 발생시키고 다른 쿼리가 실행되기 전에 컴포넌트를 일시 중단하여
          순차적으로 API 호출이 발생

            ![![Alt text](image.png)](src/assets/image1.png)

        - **[분석 2]**
          두 개의 useQuery에 `suspense: true` 옵션을 제거하면 병렬적 API 호출이 가능하나,
          API 호출 시 로딩처리에 대한 부가적인 로직이 필요함. (선언적 로딩 처리 불가)

            ```
            const { data: userData, isLoading: isUserLoading } = useQuery({...})
            const { data: bannerData, isLoading: isBannerLoading } = useQuery({...})

            if (isUserLoading || isBannerLoading) {
              return <Loading />
            }
            ```

    - **[성능 개선]**

        - **[방법 1]** `request.ts > useFetches`
          useQueries 훅을 이용하여 useQuery 훅에 전달하던 매개변수들을 배열형태로 전달
          => 병렬 API 요청

            ![![Alt text](image.png)](src/assets/image2.png)

2. Throttling / rAF / Intersection Observer API (Feat. 무한 스크롤)

    - (1) **Throttling**

        - 특정 동작이 연이어 빠르게 여러 번 발생하는 것을 제어하는 메커니즘 (이벤트 핸들러가 일정 시간 동안 한 번만 호출되도록 제어)

        - `useThrottle.ts > throttle`

            ```
            return 내부 함수 호출 시

            현재 시간과 이전에 핸들러가 호출된 시간 간의 차이가 일정 시간(timeout) 이상 시 => "일정 시간 지났음"
            1. 핸들러 재호출
            2. 핸들러 호출 시간 갱신

            그렇지 않으면 => "일정 시간 지나지 않았음"
            1. 예약된 타이머 취소
            2. 새로운 타이머 등록 : 핸들러가 일정 시간(timeout) 후에 호출되도록 설정
            ```

    - (2) **rAF (requestAnimationFrame)**

        - `useThrottle.ts > throttleByAnimationFrame`

            ```
            throttle은 setTimeout 기반으로 비동기적으로 작동하기 때문에, 다른 기능에 밀려 콜스택이 비워지지 않아
            일정 시간(timeout) 마다 발생하지 않을 수 있다 (보장 X)

            => requestAnimationFrame은 브라우저가 렌더링하는 빈도 60fps에 맞춰서 실행되며 (초당 60회 실행 보장)
            setTimeout이 처리되는 task queue 보다 우선순위에 있는 animation frame에서 처리되기에 좀 더 최적화 된 방법
            ```

    - (3) **Intersection Observer API**

        - `useIntersect.ts`

        - [동작 방식]

            ※ 브라우저에서 작동하는 무한 스크롤의 경우

            1. 요소 가시성 변화 관찰 : 브라우저 Viewport와 Target으로 설정한 요소의 교차점을 관찰
                - 페이지 가장 하단에 Target 위치
                - 해당 Target이 Viewport에 포함되는지 판단
            2. 2를 충족할 시 설정한 콜백함수 실행
            3. 요소 가시성 종료

            ```
            const intersectionCallbackFunc = entries => {
                entries.forEach(entry => {
                  if (entry.isIntersecting) {
                    setIsFetching(true)
                  }
                });
                setIsFetching(false)
              }

              useEffect(() => {
                let observer

                if (targetElement) {
                  observer = new IntersectionObserver(intersectionCallbackFunc, options)
                  observer.observe(targetElement)
                }

                return () => observer?.disconnect(targetElement)

              }, [])
            ```

## Note 2

```
Note 1과 관련하여 부가적으로 학습한 내용
```

1.  [react-error-boundary]

    -   하위 컴포넌트 트리의 어디에서든 자바스크립트 에러를 기록하며 깨진 컴포넌트 트리 대신 폴백 UI를 보여주는 React 컴포넌트
    -   react-query 의 suspsense 와 함께 사용 => `useErrorBoundary : true` (default)

2.  [react-query]

    -   useQuery의 suspense 옵션 사용 시 주의해야 할 사항

        -   **[케이스]**  
            useQuery의 `suspense: true` + `onSuccess: res => setState(res)` 할 경우, re-render가 일어나지 않는 것처럼 보임 (즉시 data-fetching 불가)

            ```
            useQuery<AxiosResponse<any>>(queryKey, () => mswRequest(queryKey), {
              suspense: true
              ...,
              onSuccess: res => {
                  const {
                      data: { contents },
                  } = res

                  setDatas(prev => [...prev, ...contents])
              },
            })

            console.log(datas) // API 호출 후에 빈 배열로 출력
            ```

        -   **[분석]**  
            `suspense: true` 로 data-fetching 시 아래와 같이 동작

            -   Suspense mount
            -   (1)`MainComponent mount`
            -   MainComponent에서 useQuery에 있는 api Call
            -   MainComponent unmount, fallback UI인 Loader mount
            -   api Call 응답이 Success일 경우, useQuery에 있는 onSuccess 동작
            -   onSuccess 완료 이후 Loader unmount, (2)`MainComponent mount`

            => setState가 바라보고있는 state는 최초 mount된 (1)MainComponent의 state이고,  
             변경하고자하는 state는 api Call이 성공한 이후 다시 re-mount된 (2)MainComponent의 state이기 때문

        -   **[방법]**

            -   (1) React-Query의 메인테이너는 최대한 해당 케이스를 지양하나, 꼭 필요하다면 useEffect를 통해 변경

                ```
                const { data: resultData } = useTestQuery({
                  suspense: true
                })

                useEffect(() => {
                  setState(...)
                }, [resultData])
                ```

    -   useInfiniteQuery

        -   파라미터 값만 변경하여 동일한 useQuery를 무한정 호출할 때 사용 (ex. 무한 스크롤)
        -   **[사용 형태]**

            ```
            const res = useInfiniteQuery(queryKey, queryFn)

            // how-to-use
            const res = useInfiniteQuery(
                ['infinitePerson'],
                ({ pageParam = 5 }) => axios.get('http://localhost:8080/person', {
                    params: {
                        id: pageParam
                    }
                }),
                ...options,
                getNextPageParam: (lastPage, allPages) => lastPage.nextCursor,
                getPreviousPageParam: (firstPage, allPages) => firstPage.prevCursor,
            )
            ```

            -   `pageParam` : useInfiniteQuery가 현재 어떤 페이지에 있는지를 확인할 수 있는 파라미터 값 (기본 값: undefined)
            -   `getNextPageParam` : 다음 페이지에 있는 데이터를 조회해올 때 사용 (return 값: 호출될 다음 페이지 값)

        -   **[주요 반환 값]**

            -   `data` : 현재까지 가져온 모든 페이지의 데이터를 포함하는 객체
            -   `fetchNextPage`: 다음 페이지의 데이터를 가져오는 함수
            -   `isFetching`: 현재 페이지의 데이터를 가져오는 중인지에 대한 여부 (boolean)
            -   `isFetchingNextPage`: 다음 페이지의 데이터를 가져오는 중인지에 대한 여부 (boolean)
            -   `hasNextPage`: 다음 페이지 존재 여부 (boolean)

                ```
                const {
                    data: {
                      pages,          // 페이지별 데이터 배열
                      pageParams,     // 페이지별 매개변수 배열
                    },
                    isFetching
                    ...
                } = useInfiniteQuery(/* ... */)
                ```
