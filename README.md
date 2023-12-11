# CSR 렌더링 및 로딩 성능 개선 예제

### Environment

-   [nodejs] - v.18.18.2
-   [reactjs] - v.18.2.37
-   [vite] - v.5.0.7

### Main Plugins

-   [react-router-dom] - v.6.20.1

### Development

will be run at local-environment

```bash
yarn dev
```

### Note

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
