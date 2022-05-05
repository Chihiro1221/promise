# Promise

通过`setTimeout`定时器的宏任务机制实现的一个`Promise`，代码采用`ts`，拥有类型支持，包括以下功能👇🏻

- `resolve/reject`状态变更之后无法修改
- `then`链式操作
- `then`穿透
- 内部错误将为`reject`状态
- 支持延迟更改状态
- 静态方法
  - resolve
  - reject
  - all
  - race

## 安装

```bash
git clone https://github.com/Chihiro1221/promise.git
cd promise
# 安装依赖
yarn
# 运行（开发模式）
yarn dev
```

## 打包发布

```bash
git clone https://github.com/Chihiro1221/promise.git
cd promise
# 安装依赖
yarn
# 打包
yarn build
# 预览
yarn preview
```

