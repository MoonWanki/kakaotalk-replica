# KakaoTalk Replica

This app is for **2019 Kakaopay recruitment test**.

## Prerequistes

- [Node.js v8^](https://nodejs.org)
- [yarn](https://yarnpkg.com/en/docs/install)

## Installation

#### 1. Clone the project

```bash
$ git clone https://github.com/MoonWanki/kakaotalk-replica.git
```

#### 2. Install packages from npm (both in backend & Frontend)

```bash
$ cd kakaotalk-replica-backend
$ yarn
$ cd ../kakaotalk-replica-frontend
$ yarn
```

#### 3. Check .env files

Both sides consist environment variables that are required for the connection.  
`PORT_NUMBER` should be set to match both sides. Default is `4000`.

- Backend
```
PORT={PORT_NUMBER}
```
- Frontend
```
NODE_PATH=src/
REACT_APP_BACKEND_URL=http://localhost:{PORT_NUMBER}
```

## Start Backend Development Server

```bash
$ cd kakaotalk-replica-backend
$ yarn start
```

## Start Frontend Development Server


```bash
$ cd kakaotalk-replica-frontend
$ yarn start
```  

## Description

준비 중입니다.  