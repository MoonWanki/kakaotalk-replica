# KakaoTalk Replica

[![React](https://img.shields.io/badge/React-v16.8.4-00A8E0.svg?style=flat-square&logo=React)](https://reactjs.org/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-v2.2.0-yellowgreen.svg?style=flat-square)](https://socket.io/)  
  
This app is for **2019 Kakaopay recruitment test**.

## Prerequistes

- [Node.js v8^](https://nodejs.org)
- [yarn](https://yarnpkg.com/en/docs/install)

## Installation

### 1. Clone the project

```bash
$ git clone https://github.com/MoonWanki/kakaotalk-replica.git
```

### 2. Install packages from npm (both in backend & Frontend)

```bash
$ cd kakaotalk-replica-backend
$ yarn
$ cd ../kakaotalk-replica-frontend
$ yarn
```

### 3. Check .env files

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

### 4. Start Backend Development Server

```bash
$ cd kakaotalk-replica-backend
$ yarn start
```

### 5. Start Frontend Development Server


```bash
$ cd kakaotalk-replica-frontend
$ yarn start
```  

## Description

본 앱은 **2019 카카오페이 웹개발 경력 채용** 사전과제물로서, (주)카카오 사 채팅 어플리케이션인 '카카오톡'을 웹 기반으로 본따 제작했습니다.

출제된 사전과제의 내용은 다음과 같습니다.

>#### 개요
>- 채팅 어플리케이션 만들기
>
>#### 기능  
>- 사용자는 첫 진입 시, ID를 입력하여 접속할 수 있다.
>- 채팅방 리스트에서 채팅방을 선택하여 들어갈 수 있다.
>- 채팅방에 다른 사용자를 초대할 수 있다.
>- 사용자는 채팅방에서 텍스트를 입력할 수 있다.
>- 사용자는 채팅방에서 이미지를 입력할 수 있다.
>
>#### 요구사항
>- Client side rendering 으로 개발
>- 언어에 대한 제한은 없음
>- 서버 구현 방법에 대한 제한 없음 (REST API, Long Polling, Socket, etc.)
>- 프론트엔드 구현 방법은 제한 없음 (Angular, React, Preact, Vue, jQuery, etc.)
>- UI 구현에 대한 제약은 없음
>- 단위 테스트 필수, UI 테스트(Storybook, Selenium)와 통합 테스트는 선택
>- README<span>.</span>md 파일에 문제해결 전략 및 프로젝트 빌드, 실행 방법 명시
>- 위 언급되지 않은 내용에 대해서는 자유롭게 작성할 수 있다.

### 앱 설명

기본적인 UX는 카카오톡과 상동하며, 다음 사항들만 참고하시면 됩니다.

- **가입한 모든 유저가 친구로 취급됩니다.** 따라서 '친구' 대신 '유저'라는 용어를 사용합니다.  
- 그룹채팅방(단톡방)만 이용 가능합니다. 1:1 채팅 시스템이 지원되지 않습니다.
- ID는 유저 식별자이며, 실제로 채팅에 사용할 이름을 별도로 지정해야 합니다.
- 별도의 회원가입 버튼이 없으며, 등록되지 않은 ID로 로그인 시도 시 해당 ID로의 회원가입 절차가 안내됩니다.
- 가입 시 지정한 이름 및 프로필 이미지를 변경할 수 없습니다.
- 서버 메모리를 데이터베이스로 이용하므로, **서버가 꺼질 경우 모든 데이터가 삭제됩니다**.
- 푸시 알림 기능이 제공되지 않습니다.  

### 백엔드 설계

Real-time 통신 개발에 강한 Node.js 기반 **Socket<span>.</span>IO**가 사용되었습니다.  
채팅 앱을 통해 업로드 된 이미지 파일을 static 파일로 제공하기 위해 **Express** 웹서버가 적용되었습니다.  

#### 클래스 구성

OOP 관점에서 다음 5개 도메인으로 구성되었습니다.  

- **kakaotalk** | `kakaotalk/index.js`  
가장 상위 클래스이며, 소켓 클라이언트와의 커넥션 레벨을 담당합니다. 1개의 `Lobby` 인스턴스를 가집니다.

- **Lobby** | `kakaotalk/Lobby.js`  
모든 카카오톡 회원이 각 `User` 인스턴스로 저장돼 있으며, `User`가 카카오톡 접속 중에 통신되는 소켓 이벤트 핸들링을 담당하는 Controller에 해당합니다.

- **User** | `kakaotalk/User.js`  
유저에 대응하며, 유저 정보와 자신이 속한 `Room`들의 참조를 가집니다.

- **Room** | `kakaotalk/Room.js`  
채팅방에 대응하며, 참여 중인 `User`들과 채팅방에 공유된 `Message`들을 가집니다.

- **Message** | `kakaotalk/Message.js`  
채팅메시지에 대응하며, 메시지 내용과 정보를 가집니다.  

### 프론트엔드 설계

**React v16.8**로 제작되었으며, 앱 규모가 크지 않은 것을 고려하여 별도의 상태관리 라이브러리가 사용되지 않았습니다.  

#### 컴포넌트 설계

컨테이너 컴포넌트의 전체적인 구성은 다음과 같으며, `/src/Layout`에 위치합니다.

|       |            |          |         |
|-------|------------|----------|---------|
|       | App        |          |         |
| ┌──── | ┴───── | ┐        |         |
| Login |            | Main     |         |
|       | ┌─────| ┼─────| ┐       |
|       | FriendList | RoomList | Room    |
|       |            |          | │1..*   |
|       |            |          | Message |

`/src/Components`에는 UI 컴포넌트(버튼, 다이얼로그 등)들이 위치합니다.

#### 작동 로직

사용자 뷰의 변화가 필요한 시점에는 무조건 서버로부터 갱신된 데이터가 들어옵니다.  
**사용자가 취한 모든 액션은  서버로의 데이터 전달만 취하며, 뷰는 오로지 서버로부터 오는 갱신된 데이터에만 의존합니다.**  
Flux 아키텍처를 서버-클라이언트 구조에 포괄하여 접목한 형태로 생각하시면 됩니다.

`App`은 로그인 여하에 따라 `Login` 또는 `Main`을 보여줍니다.  
`Login`은 로그인 페이지를 담당합니다.  

`Main`은 채팅을 위한 **컨테이터 컴포넌트**에 해당합니다. 서버로부터 오는 유저목록, 채팅방 데이터는 이곳에 각각 `users`와 `rooms`로 state에 저장됩니다.  
`FriendList`, `RoomList`, `Room` 등의 하위 컴포넌트들은 이를 props로 받아 보여주는 **프리젠테이셔널 컴포넌트**입니다.

#### 유닛테스트

CRA에 기본으로 내장된 Jest와 Airbnb의 Enzyme을 통한 유닛테스트 환경을 두고 진행되었습니다.  
다음 커맨드를 통해 유닛테스트가 가능합니다.
```bash
$ yarn test
```

통합 및 E2E 테스트는 수행하지 않았습니다.

## Dependencies  

- **React** | https://reactjs.org  
Top 1 Front-End framework  

- **Socket<span>.</span>IO** | https://socket.io  
Provide real-time communication between server and clients  

- **Socket.IO-stream** | https://github.com/nkzawa/socket.io-stream | by Naoyuki Kanezawa  
Enable file streaming via socket<span>.</span>io  

- **Express** | https://expressjs.com  
For serving static files  

- **Immer** | https://github.com/mweststrate/immer  
Create immutable state by mutating the current one  

- **uuid** | https://github.com/kelektiv/node-uuid  
Generate RFC-compliant UUIDs

- **Jest** | https://jestjs.io  
Unit testing framework  

- **Enzyme** | https://airbnb.io/enzyme    
Unit testing tools for React  