# Black Halo Metroidvania Systems Benchmark

## 목적

이 문서는 `Black Halo`의 몬스터, 스킬, 장비 설계를 위한 기준선이다. 단순히 유명작의 표면적 요소를 차용하는 것이 아니라, 메트로베니아 장르에서 검증된 구조를 현재 저장소의 데이터 모델과 세계관에 맞게 재조립하는 데 목적이 있다.

## 한국어 표기 기준

- 한국어 UI 표기는 [black-halo-korean-localization-glossary.md](./black-halo-korean-localization-glossary.md)를 기준으로 한다.
- 본문에 영어 고유명사나 내부 ID가 남아 있어도, 실제 한국어 노출명은 용어집의 `한국어 UI명`을 우선한다.

현재 코드 기준으로 이미 존재하는 골격은 다음과 같다.

- 전투 리소스: `GameState.run.gloom`
- 무기 데이터: `WeaponData`
- 능력 데이터: `AbilityData`
- 유물 데이터: `RelicData`
- 적 데이터: `EnemyArchetypeData`
- 보스 페이즈 데이터: `BossPhaseData`
- 월드 게이팅: `chain_grapple`, `black_wing`, 방 단위 게이트

따라서 이번 설계 문서의 원칙은 "많이 만들기"가 아니라 "실제로 붙일 수 있게 만들기"다.

## 레퍼런스 작품에서 확인한 핵심

| 작품 | 확인한 시스템 | Black Halo에 가져올 포인트 |
| --- | --- | --- |
| Hollow Knight | 이동 능력이 탐험, 전투, 비밀 루트 해제를 동시에 담당한다. Charm은 슬롯 비용을 가진 빌드 시스템이다. | 이동 능력 하나가 최소 3가지 기능을 가져야 한다. 유물은 "숫자 증가"보다 플레이 감각 변화에 집중한다. |
| Ori and the Will of the Wisps | Spirit Shard는 탐험 보상, 상점, 퀘스트를 통해 넓게 공급되고, 일부는 강화된다. | 유물은 드롭만이 아니라 사이드룸, 상점, 챌린지, 업그레이드까지 연결한다. |
| Castlevania: Symphony of the Night | Relic이 탐험 능력과 시스템 확장을 동시에 제공한다. 장비/속성/패시브가 장르의 RPG 감각을 만든다. | Black Halo도 능력 해금과 장비 세팅을 분리해, "길을 여는 능력"과 "전투 해법을 바꾸는 장비"를 서로 다른 층위로 설계한다. |
| Prince of Persia: The Lost Crown | 패링 가능/불가 시그널, 보스의 다단 페이즈, 상황별 아뮬렛 교체가 전투 학습을 선명하게 만든다. | 적 텔레그래프를 색과 음향으로 통일하고, 보스는 전 구간 학습 검증 장치로 설계한다. |
| Guacamelee! | 능력 하나가 색상 게이트, 전투 콤보, 이동 퍼즐을 동시에 담당한다. | 스킬은 필드 오브젝트, 적 방어구, 공중 연계까지 겹쳐 쓰이도록 만든다. |
| Blasphemous | 묵직한 공격 판정, 종교적 상징이 녹은 장비, 방어/참회형 패시브가 세계관과 시스템을 연결한다. | 성물, 묵주, 서약이 Black Halo의 고딕 종교 톤과 직접 이어지도록 장비 명명과 효과를 설계한다. |

## 장르 공통 구조 요약

### 1. 능력은 이동기이면서 문열쇠여야 한다

좋은 메트로베니아 능력은 단순한 편의 기능이 아니다.

- 새로운 경로를 열어야 한다.
- 기존 방을 다른 리듬으로 재통과하게 만들어야 한다.
- 전투에서 위치 선정이나 회피 방식을 바꿔야 한다.
- 환경 오브젝트와 상호작용해야 한다.

`chain_grapple`이 수직 방 이동과 공중 위치 변경을 동시에 제공하는 현재 구조는 올바른 출발점이다. 이후 능력들도 이 원칙을 따라야 한다.

### 2. 적은 개체보다 조합이 중요하다

레퍼런스 작품들은 "적 하나의 복잡함"보다 "둘을 같이 놓았을 때 생기는 압박"에 강하다.

- 앵커형은 전선을 고정한다.
- 헌터형은 플레이어의 빈틈을 쫓는다.
- 서포트형은 공간을 오염시킨다.
- 비스트형은 템포를 흔든다.

현재 `role` 필드가 이미 있으므로, 모든 적은 단독 설계보다 방 조합을 우선 기준으로 잡는다.

### 3. 장비는 정답이 아니라 태도다

강한 메트로베니아 장비 시스템은 "가장 좋은 세팅"보다 "이번 구간에서 어떤 태도를 택할 것인가"를 묻는다.

- 공격 세팅은 위험을 감수하고 전투 시간을 줄인다.
- 방어 세팅은 패링, 회복, 리스크 관리에 보상을 준다.
- 탐험 세팅은 자원 수급, 비밀 탐색, 기동을 강화한다.

따라서 유물은 동일 축의 상위호환이 아니라, 다른 상황에서 빛나는 선택지여야 한다.

### 4. 보스는 새 기술을 가르치지 말고 이미 배운 것을 검증해야 한다

좋은 보스는 플레이어가 직전에 배운 기술을 조합해서 쓰게 만든다.

- 중간 보스는 새 능력 해금 직전에 "왜 이 능력이 필요한지"를 체감시켜야 한다.
- 최종 보스는 지금까지의 이동기, 패링, 장비 선택, 자원 운영을 모두 요구해야 한다.

현재 `sir_aurex -> chain_grapple`, `mirror_choir -> black_wing`, `seraph_vale` 흐름은 이 원칙과 잘 맞는다.

## Black Halo 시스템 원칙

### 전투 원칙

- 기본 공격은 묵직하고 읽기 쉬워야 한다.
- 패링은 선택지여야 하지만, 숙련자에게는 최단 해법이 되어야 한다.
- 스킬 공격은 `Gloom`을 소모해 전투 흐름을 전환하는 버튼이어야 한다.
- 대미지 숫자보다 위치 선정과 템포 이득이 더 중요해야 한다.

### 탐험 원칙

- 메인 루트는 항상 1개로 명확하게 보이되, 옆길은 장비와 유물로 가치가 커져야 한다.
- 사이드룸 보상은 체감 가능한 전투 변화와 연결한다.
- 같은 방을 재방문할 때 "과거의 고생이 사라졌다"는 성장 체감이 있어야 한다.

### 성장 원칙

- 능력은 적게, 강하게 준다.
- 유물은 많이 주되, 슬롯 비용으로 조정한다.
- 무기는 플레이스타일을 갈라놓고, 유물은 그 스타일을 미세 조정한다.
- 서약은 플레이어의 장기적 성향을 규정한다.

## 권장 런칭 스코프

출시 기준으로 가장 견고한 범위는 아래와 같다.

- 메인 이동 능력 4종
- 무기군 3종
- 유물 16~20종
- 일반 적 8~10종
- 엘리트 적 3종
- 보스 3전

현재 저장소 상태를 감안하면 1차 구현 최소치는 다음이 안정적이다.

- 메인 이동 능력 2종 유지: `chain_grapple`, `black_wing`
- 추가 능력 2종은 문서로 선설계 후 2차 구현
- 무기군 2종 유지 후 3번째 무기군 추가
- 일반 적 5종을 기준으로 3~5종 확장
- 보스 2전 유지, 미니보스 1전 추가

## 시스템별 적용 기준

### 몬스터

- 모든 적은 `role`을 가진다.
- 모든 적은 "첫 시각 신호", "실제 위협", "플레이어 해법"이 구분되어야 한다.
- 모든 지역은 자기만의 전투 문법을 가진다.
- 한 방에 같은 역할군을 3개 이상 겹치지 않는다.

### 스킬

- 이동 능력은 필드, 전투, 비밀 해금에 모두 쓰인다.
- 액티브 스킬은 `Gloom` 소모와 짧은 쿨다운을 함께 가진다.
- 무기 스킬은 무기 정체성을 극단적으로 보여줘야 한다.
- 스킬 업그레이드는 대미지보다 판정, 효율, 안전성 개선 위주로 설계한다.

### 장비

- 무기는 조작 감각을 바꾼다.
- 유물은 리스크와 보상을 바꾼다.
- 서약은 플레이 철학을 바꾼다.
- 강화 재화는 경로를 강제하지 말고 선택지를 열어야 한다.

## 피해야 할 함정

- 이동기와 전투기가 완전히 분리되어 있는 설계
- 동일 역할의 유물만 숫자 차이로 늘리는 방식
- 원거리 압박 적을 너무 많이 넣어 화면을 지저분하게 만드는 구성
- 보스가 일반 적들과 공유 문법 없이 별도 미니게임처럼 느껴지는 패턴
- 좁은 방에서 회피 불가능한 공격을 겹쳐 쓰는 배치
- 유물이 필수 장착처럼 작동하여 슬롯 선택이 사실상 사라지는 구조

## 문서 사용 순서

이 기준 문서를 읽은 뒤 아래 순서로 구체화한다.

1. `monster-design-bible.md`
2. `skill-design-bible.md`
3. `equipment-design-bible.md`

## 참고 링크

- Hollow Knight Wiki, `Charms`: https://hollowknight.wiki/w/Charms
- Hollow Knight Wiki, `Spells and Abilities`: https://hollowknight.wiki/w/Spells_and_Abilities_(Hollow_Knight)
- Ori and the Blind Forest Wiki, `Spirit Shards`: https://oriandtheblindforest.fandom.com/wiki/Spirit_Shards
- Ubisoft, `Prince of Persia: The Lost Crown Will Put Your Combat, Platforming, and Puzzle-Solving Skills to the Test`: https://news.ubisoft.com/en-au/article/e1SD5gR3TWqk5GPAjWHSz/prince-of-persia-the-lost-crown-will-put-your-combat-platforming-and-puzzlesolving-skills-to-the-test
- Ubisoft, `KILL A BOSS`: https://www.ubisoft.com/en-au/game/prince-of-persia/the-lost-crown/news-updates/5nm7fDnEK34mDofT67LhLf/kill-a-boss
- Castlevania Wiki, `Relic`: https://castlevania.fandom.com/wiki/Relic
- Castlevania Wiki, `Symphony of the Night Attributes`: https://castlevania.fandom.com/wiki/Symphony_of_the_Night_Attributes
- Guacamelee! Wiki, `Olmec's Headbutt`: https://guacamelee.fandom.com/wiki/Olmec%27s_Headbutt
- Guacamelee! Wiki, `Dimension Swap`: https://guacamelee.fandom.com/wiki/Dimension_Swap
- Blasphemous Wiki, `Silver Grape`: https://blasphemous.fandom.com/wiki/Silver_Grape
