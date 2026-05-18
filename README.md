<p align="center">
  <img src="https://github.com/minyang-tech/IXO-Engine/blob/main/IXO%20Logo.png?raw=true" alt="IXO Engine Logo" width="300">
</p>

<h1 align="center">IXO Engine</h1>

<p align="center">
  <strong>Build Your Vision Without Writing A Single Line of Code.</strong><br>
  노드 기반 시각적 프로그래밍으로 완성하는 차세대 앱 빌더, <b>IXO 엔진</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Platform-Electron-blue?style=flat-square&logo=electron" alt="Platform">
  <img src="https://img.shields.io/badge/Language-JavaScript/Node.js-yellow?style=flat-square&logo=javascript" alt="Language">
  <a href="https://minyangtech.n-e.kr/eula">
    <img src="https://img.shields.io/badge/License-EULA-red?style=flat-square" alt="EULA">
  </a>
</p>

---

## Naver Connect의 [Entry](https://playentry.org/)에서 아이디어 영감을 받았습니다.

---

## What is IXO Engine?

**IXO Engine**은 코딩 지식이 없는 사용자도 언리얼 엔진의 블루프린트처럼 **노드를 연결하는 것만으로** 자신만의 데스크톱 애플리케이션을 제작할 수 있게 돕는 Electron 기반 노드 빌더 엔진입니다.

복잡한 텍스트 기반 코딩의 장벽을 허물고, 논리적인 흐름(Flow)에만 집중하여 아이디어를 현실로 만드세요.

## Features

- **Visual Node Editor**: 드래그 앤 드롭 방식으로 로직을 설계하고 데이터의 흐름을 한눈에 파악하세요.
- **No-Code Logic**: 복잡한 조건문과 루프를 시각적 블록으로 대체하여 직관적인 앱 개발이 가능합니다.
- **Powered by Electron**: 웹 기술의 유연함과 데스크톱 앱의 강력한 성능을 동시에 경험하세요.
- **Modular Component**: 다양한 프리셋 노드를 사용하여 파일 시스템 제어, 네트워크 통신 등을 즉시 구현할 수 있습니다.

## Tech Stack

- **Framework**: [Electron](https://www.electronjs.org/)
- **Frontend**: React / Vue
- **Node Engine**: React Flow
- **Runtime**: Node.js

## Installation

```bash
# 레포지토리 클론
git clone [https://github.com/minyang-tech/IXO-Engine.git](https://github.com/minyang-tech/IXO-Engine.git)

# 프로젝트 폴더 이동
cd IXO-Engine

# 의존성 설치
npm install

# 앱 실행
npm start
```

## Starter Example (Default Canvas)

앱을 처음 실행하면 기본적으로 다음 예제 흐름이 캔버스에 배치됩니다.

- `Start` -> `Input Field` -> `If / Else` -> `String Join` -> `Add Text`
- 입력값(`username`)을 받아 조건 분기 후 메시지를 출력하는 가장 기본적인 로직 예제입니다.

## Node Library Quick Guide

자주 쓰는 노드의 역할을 짧게 정리했습니다.

- `Add Text`: 화면에 텍스트 출력
- `Add Image`: 이미지 경로/URL 렌더링
- `Input Field`: 사용자 입력을 받아 변수로 전달
- `If / Else`: 조건식 결과에 따라 True/False 분기
- `Loop`: 반복 실행 흐름 제어
- `Wait`: 지정 시간(ms) 지연 후 다음 노드 실행
- `Switch`: 여러 케이스 중 일치하는 분기로 이동
- `HTTP Request`: 외부 API 호출
- `String Join`: 문자열 결합/포맷 조합
- `Math Operator`: 수식 계산
- `Script`: 사용자 JS 코드 실행으로 커스텀 로직 작성
- `System Info`: 시스템 정보 표시용 데이터 생성
- `Audio Player`: 오디오 재생 트리거
- `File Watcher`: 파일 변경 감지 트리거

## Template Grammar Guide

Inspector의 `Value` 또는 조건식에서 템플릿 문법을 사용해 변수 참조가 가능합니다.

- 기본 문법: `{{variableName}}`
- 예시:
  - Input Field의 `Ref Key`를 `myInput`으로 설정
  - Add Text의 Value를 `안녕하세요, {{myInput}}님!`으로 입력
  - 실행 시 입력값이 문자열에 실시간으로 치환되어 출력됨

조건식 체인 문법:

- `AND`, `OR` 지원
- 예시: `{{score}} > 10 AND {{role}} == admin OR {{username}} == root`
- 왼쪽부터 `AND` 평가 후 `OR` 체인으로 분기됩니다.

# 기여방침
## 프로젝트 목표

- 가볍고 확장 가능한 노드 기반 앱 제작 툴
- 로컬 중심 구조 지향
- 플러그인 기반 확장 지원 예정

## 필독
본 프로젝트는 오픈소스 프로젝트이며,  
누구나 Pull Request를 통해 기여할 수 있습니다.  

다만 아래 항목은 Merge가 거부될 수 있습니다.  

- 악성 코드
- 난독화 코드
- 프로젝트 방향성과 무관한 기능
- 과도한 의존성 추가
- 라이선스 충돌 가능 코드

# 기여방법
```bash
npm install
npm run dev
```   

1. 저장소 Fork.  
2. 브랜치 생성.  
3. 수정 후 Commit.  
4. Pull Request 생성.  
## 권장 사항
- 큰 기능 추가 전 Issue 생성 권장
- 가능한 기존 코드 스타일 유지
- 불필요한 라이브러리 추가 지양
- 실험적 기능은 설명 포함 권장
## 기여 가능 분야
- 새 노드 추가
- UI/UX 개선
- 버그 수정
- 성능 최적화
- [문서화](https://minyangtech.n-e.kr/docs/ixo/index)에 기여를 원하실 경우, [여기](https://github.com/minyang-tech/minyangtech.github.io) 저장소에 ../Docs/ixo/.. 를 Pull Request를 통해 수정해주세요.
**참고**  
현재 프로젝트는 구조 리팩토링이 진행 중이며, 일부 코드 구조가 정리되지 않았을 수 있습니다.

## Anothers 
Made by 민양테크.  

**Original Dev** : [@Whoasked](https://minyangtech.n-e.kr/@whoasked)

License : MIT LICENSE   
*첫 릴리즈된 베타버전 V1.0.0은 민양테크 표준 최종 사용자 라이선스 계약이 적용받고 그 이후 버전부터 MIT라이선스가 적용받습니다.  
Copyright 2026. MinyangTech. All rights Reserved.  

> [!IMPORTANT]
> **AI 기술 활용 고지**  
> 본 애플리케이션은 「인공지능 산업 육성 및 신뢰 기반 조성 등에 관한 기본법」에 의거하여, 제작 과정에서 인공지능(AI) 기술이 활용되었음을 밝힙니다.
