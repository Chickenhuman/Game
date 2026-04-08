# Black Halo Title Screen Production Plan

## Goal
- 웹 빌드 시작 시 곧바로 플레이로 들어가지 않고, 완성형 게임처럼 보이는 타이틀 화면으로 진입한다.
- 타이틀 화면은 단순 메뉴가 아니라 `Black Halo`의 세계관, 장비 생태계, 보스 서사, 지역 구조를 압축적으로 드러내는 프롤로그여야 한다.
- 한국어/영어 전환을 즉시 반영한다.

## Source Material To Reflect
- `black-halo-story.md`
- `black-halo-korean-localization-glossary.md`
- `equipment-design-bible.md`
- `monster-design-bible.md`
- `skill-design-bible.md`
- `metroidvania-systems-benchmark.md`

## Art Direction
- 중심 모티프:
  - 부서진 검은 후광
  - 각성실과 회수소의 이중성
  - 케일 애시본과 세라프 베일의 거울상 구도
  - 애시폴의 재, 성유물 성역의 황동, 거울 성역의 유리광
- 장면 구조:
  - 후경: 성채 첨탑, 사슬, 스테인드 글라스, 종교적 아치
  - 중경: 부서진 후광과 계승 장치 형상
  - 전경: 케일 실루엣, 세라프의 유령 같은 반사상
  - 공간 연출: 재 입자, 청색 성광, 붉은 균열, 천천히 도는 후광 파편
- 색 축:
  - 잿빛 자주/검은 갈색
  - 바랜 금속 금색
  - 냉한 청록 성광
  - 핏빛 심홍
- 로고 방향:
  - 고딕 세리프
  - 원형 후광 파편이 타이틀을 감싸는 구성
  - 한국어/영어 둘 다 자연스럽게 얹히는 자산 필요

## Screen Structure
- 메인 캔버스 내부에 타이틀 전용 상태를 만든다.
- 타이틀 전용 요소:
  - 메인 로고/타이틀 이미지
  - 로그라인
  - 메뉴
  - 세계관 패널
  - 장비/서약/적/지역 하이라이트 패널
  - 언어 변경 반영
- 메뉴 항목:
  - `Continue`
  - `New Run`
  - `Chronicle`
  - `Armory`
- 패널 내용:
  - `Chronicle`: 서사 로그라인, 핵심 인물, 두 번째 새벽의 의미
  - `Armory`: 무기군, 서약, 주요 유물 조합, 이동 능력

## Asset Deliverables
- `assets/title/black-halo-title-logo-en.svg`
- `assets/title/black-halo-title-logo-ko.svg`
- `assets/title/black-halo-title-hero.svg`
- 필요 시 CSS 보조 장식은 `web/styles.css`에 추가

## Implementation Plan
- `web/index.html`
  - 타이틀 상태에 어울리는 패널 헤더 문구와 레이아웃 여지 확보
- `web/styles.css`
  - 타이틀 상태 전용 패널 톤, 강조 텍스트, 스테이지 연출 보조 스타일
- `web/game.js`
  - title assets preload
  - title screen state machine
  - title menu input
  - language-aware copy tables
  - premium title render path
  - start/continue transition into gameplay

## Lore Requirements
- 아래 내용이 화면 어딘가에 직접 또는 간접적으로 반영되어야 한다.
  - `Cael Ashborne`는 몰락한 용사이자 계승 체계의 원형 데이터다.
  - `Seraph Vale`는 두 번째 새벽이자 케일의 거울상이다.
  - `Black Halo`는 영웅을 기념하는 후광이 아니라 후계자를 생산하는 계승 장치다.
  - 세계는 `Ashfall`, `Reliquary`, `Mirror` 3구역 축으로 읽혀야 한다.
  - 장비 철학은 무기/유물/서약/강화 재화의 4층 구조를 반영해야 한다.
  - 이동 능력 `Chain Grapple`, `Black Wing`은 프리미엄 성장 축처럼 보여야 한다.
  - `Sir Aurex`와 `Seraph Vale`는 메인 적대 축으로 보여야 한다.

## Acceptance Criteria
- 첫 진입 시 플레이보다 먼저 타이틀 화면이 뜬다.
- 메뉴로 이어서 하기/새 게임 시작이 가능하다.
- 한국어/영어 전환 시 타이틀 문구, 패널, 메뉴가 즉시 바뀐다.
- 타이틀 자산 파일이 실제로 존재하고 화면에 렌더된다.
- 장비, 서사, 지역, 보스 정체성이 메뉴 화면에서 드러난다.
- 실제 게임 진입 후 기존 플레이 루프를 깨지 않는다.

## Validation
- `node --check web/game.js`
- `npm run check:web`
- 수동 검증 목표:
  - 첫 프레임 타이틀 진입
  - 메뉴 이동과 선택
  - 언어 전환
  - 이어하기/새 게임 시작
  - 타이틀 상태에서 게임 상태로 부드럽게 전환
