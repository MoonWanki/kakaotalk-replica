# KakaoTalk Demo

This project is for **Kakaopay recruitment test**.

## Prerequistes

- Node.js v8^
- yarn

## Installation

#### 1. Clone the project

```bash
$ git clone https://github.com/MoonWanki/kakaotalk-demo.git
```

#### 2. Install packages from npm (both in frontend & backend)

```
$ cd kakaotalk-demo-server
$ yarn
$ cd ../kakaotalk-demo-client
$ yarn
```

#### 3. Check .env files

Both sides consist environment variables that are needed to connect.  
Port number should be set to match both sides. Default is `4000`.

- Server
```
PORT={SERVER_PORT_NUMBER}
```
- Client
```
NODE_PATH=src/
REACT_APP_SERVER_URL=http://localhost:{SERVER_PORT_NUMBER}
```

## Start Backend Development Server

```bash
$ cd kakaotalk-demo-server
$ yarn start
```

## Start Frontend Development Server

Frontend Development server will use localhost backend API server by default (via webpack-dev-server proxy)

```bash
$ cd kakaotalk-demo-client
$ yarn start
```
