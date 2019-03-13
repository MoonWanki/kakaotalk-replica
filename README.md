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

#### 2. Install packages from npm (both in backend & Frontend)

```bash
$ cd kakaotalk-demo-backend
$ yarn
$ cd ../kakaotalk-demo-frontend
$ yarn
```

#### 3. Check .env files

Both sides consist environment variables that are needed to connection.  
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
$ cd kakaotalk-demo-backend
$ yarn start
```

## Start Frontend Development Server


```bash
$ cd kakaotalk-demo-frontend
$ yarn start
```
