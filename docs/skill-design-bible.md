# Black Halo Skill Design Bible

## 목적

이 문서는 `Black Halo`의 이동 능력, 액티브 스킬, 무기 전용 기술, 서약 연계를 하나의 성장 체계로 정리한다. 기준은 명확하다. 스킬은 멋있기만 하면 안 되고, 맵 구조와 적 배치와 장비 선택을 동시에 바꿔야 한다.

## 한국어 표기 기준

- 한국어 UI 표기는 [black-halo-korean-localization-glossary.md](./black-halo-korean-localization-glossary.md)를 기준으로 한다.
- 능력, 무기, 무기 기술, 서약은 본문에서 영어명을 유지하더라도 한국어 설정에서는 용어집의 `한국어 UI명`을 사용한다.

## 현재 시스템 기준점

현재 코드에서 이미 확인되는 스킬 관련 구조는 아래와 같다.

- `AbilityData`
  - `ability_id`
  - `display_name`
  - `description`
  - `gate_tag`
  - `unlock_room_id`
  - `cooldown`
  - `is_mobility`
- 플레이어 액션
  - 점프
  - 대시
  - 패링
  - 라이트/헤비 공격
  - `skill` 입력
- 리소스
  - `Gloom` 30 소모 스킬 공격
- 해금된 핵심 능력
  - `chain_grapple`
  - `black_wing`

즉, 지금 필요한 것은 시스템을 갈아엎는 일이 아니라 "스킬 층위를 분리해 읽기 좋게 만드는 일"이다.

## 스킬 분류 체계

`Black Halo`의 스킬은 네 층으로 나누는 것이 가장 견고하다.

### 1. 진행 능력

맵 게이트를 여는 능력이다.

- 메인 루트와 사이드룸을 구분한다.
- 전투에서 새 위치 선택지를 연다.
- 비밀 방, 지형 파괴, 수직 진입 같은 필드 변화를 만든다.

### 2. 무기 전용 기술

무기 정체성을 극단적으로 보여주는 기술이다.

- `WeaponData.skill_name`과 직접 연결 가능
- 동일한 입력이라도 무기에 따라 전혀 다른 해결책이 되도록 설계

### 3. 반응형 기술

플레이어 숙련도에 따라 가치가 커지는 기술이다.

- 패링
- 패링 후 추격
- 즉발 회피 강화

### 4. 서약 기반 증폭

서약은 별도 액티브 버튼보다 스킬 운용의 철학을 바꾸는 편이 좋다.

- `execution`: 고위험 고화력
- `pursuit`: 기동과 추격
- `silence`: 패링, 안정성, 정교한 운영

## 핵심 설계 원칙

### 능력 하나는 최소 세 가지 문제를 풀어야 한다

예를 들어 `black_wing`은 아래를 동시에 만족해야 한다.

- 수직 지형 재탐색
- 공중 회피
- 공중 적 추격

이 셋 중 하나만 만족하면 좋은 메트로베니아 스킬이 아니다.

### 스킬은 기본 공격을 대체하지 말고 전환해야 한다

- 기본 공격은 항상 쓸 수 있어야 한다.
- 스킬은 리듬을 바꾸는 순간이어야 한다.
- 스킬을 눌렀을 때 위치, 우선순위, 자원 상태가 바뀌어야 한다.

### 후반 스킬은 복잡함보다 조합성을 늘려야 한다

후반에 버튼을 더 늘리는 대신 기존 버튼의 의미를 강화하는 쪽이 좋다.

- 더블점프 후 강공
- 그래플 후 추락베기
- 패링 후 무기 스킬 캔슬

## 진행 능력 설계

### 1. `chain_grapple`

- 해금 위치: `aurex_arena`
- 역할:
- 수직 축 이동
- 공중 위치 보정
- 그래플 포인트 기반 숨겨진 길 진입
- 전투 가치:
- `choir_adept`나 `chain_deacon` 같은 후열 적을 빠르게 압박
- 보스의 직선 압박을 넘기는 용도
- 레벨디자인 원칙:
- 그래플 포인트는 "정답 1개"보다 "위험/보상 각도 2개"를 주는 편이 좋다.
- 업그레이드 제안:
- `chain_grapple_plus`
- 쿨다운 0.8 -> 0.55
- 착지 후 0.25초 피해 경감

### 2. `black_wing`

- 해금 위치: `mirror_choir`
- 역할:
- 공중 재점프
- 공중 연계 연장
- 후반 수직 비밀 루트 진입
- 전투 가치:
- `inquisitor`, `glass_martyr` 상대로 가장 체감이 크다.
- 지상 압박을 공중으로 무효화하는 기술
- 레벨디자인 원칙:
- `black_wing` 이후에는 상단 회피 루트가 보이는 방을 의도적으로 늘린다.
- 업그레이드 제안:
- `black_wing_echo`
- 재점프 후 짧은 공격력 버프
- 공중 스킬의 `Gloom` 비용 10% 감소

### 3. `cinder_dive`

- 분류: 소프트 게이트 겸 전투 기술
- 추천 해금 위치: `prayer_cistern` 또는 `sunken_cells`
- 역할:
- 약한 바닥 파괴
- 하강 공격
- 짧은 무적이 있는 낙하 시작점 제공
- 전투 가치:
- 방패 적의 상단 약점 공략
- 고정형 장판 적 제거
- 구현 메모:
- 1차에서는 별도 버튼 추가보다 공중 헤비 공격 강화형으로 시작하는 편이 좋다.

### 4. `veil_step`

- 분류: 후반부 선택형 능력
- 추천 해금 위치: `sealed_roof`
- 역할:
- 짧은 거리 위상 대시
- 투사체 통과
- 특정 성역 장벽 통과
- 전투 가치:
- 최종 지역 원거리 압박에 대한 고급 해법
- 패링 실패를 회피로 대체하는 숙련자 선택지
- 구현 메모:
- 메인 진행 필수로 쓰기보다, 숙련 루트와 챌린지 방 전용이 안전하다.

## 무기 전용 기술 설계

현재 구조상 무기 기술은 `WeaponData.skill_name`과 스킬 입력을 통해 가장 쉽게 확장할 수 있다.

### `fallen_greatblade` / `Halo Breaker`

- 판타지: 느리지만 공간을 단번에 정리하는 처형기
- 기본 효과:
- 전방 넓은 고중량 내려베기
- 적 강인도와 방패 자세에 큰 압박
- 추천 비용:
- `Gloom` 30
- 추천 보상:
- 적중 시 소량의 `Gloom` 환급
- 업그레이드 방향:
- 충격파 범위 증가
- 패링 직후 사용 시 발동 속도 증가

### `chain_glaive` / `Grief Spiral`

- 판타지: 넓은 범위와 기동성을 결합한 추격기
- 기본 효과:
- 전진하면서 다단 히트 회전 베기
- 끝부분에서 소폭 전진 보정
- 추천 비용:
- `Gloom` 28
- 추천 보상:
- 공중 사용 시 이동거리 증가
- 업그레이드 방향:
- 마지막 타격에 끌어당김 부여
- 그래플 직후 사용 시 피해량 상승

### `glass_rapier` / `Mirror Cant`

- 분류: 신규 무기군 제안
- 판타지: 짧은 사거리 대신 정밀 패링 후 즉시 반격
- 기본 효과:
- 전방 관통 돌진 찌르기
- 패링 후 사용 시 치명타 판정
- 추천 비용:
- `Gloom` 24
- 업그레이드 방향:
- 적 처치 시 쿨다운 일부 환급
- 공중 적 명중 시 재점프 보조

### `penitence_maul` / `Pillar of Penance`

- 분류: 스트레치 목표 무기군 제안
- 판타지: 느리지만 화면 장악력이 강한 망치형
- 기본 효과:
- 제자리 강타 후 짧은 충격파
- 취약 지형 파괴에 강함
- 추천 비용:
- `Gloom` 35
- 업그레이드 방향:
- 낙하 사용 시 `cinder_dive`와 연동
- 보스 다운 상태에서 추가 피해

## 반응형 기술 설계

### 패링

패링은 "잘하면 좋은 옵션"이 아니라 `Black Halo`의 고급 전투 핵심 축으로 남겨야 한다.

- 큰 적의 금빛 공격은 패링 가능
- 패링 성공 시:
- 피해 무효화
- `Gloom` 획득
- 짧은 경직 유발
- 일부 보스 패턴 단축

### 추격 카운터

패링 성공 직후 무기 스킬 입력 시 전용 보너스를 주면 좋다.

- `greatblade`: 추가 강인도 붕괴
- `chain_glaive`: 전진거리 증가
- `glass_rapier`: 치명 반격

### 공중 응징

`black_wing` 이후에는 공중 적이나 상단 약점 적이 늘어나므로, 공중 헤비 공격도 사실상 하나의 반응형 기술로 본다.

## 진행 루트 제안

### 메인 루트

1. `hub_sanctuary`
2. `ashfall_gate`
3. `ashfall_rampart`
4. `ashfall_crypt`
5. `reliquary_lift`
6. `aurex_arena`
7. `chain_grapple` 해금
8. `reliquary_archive`
9. `mirror_bridge`
10. `mirror_choir`
11. `black_wing` 해금
12. `seraph_sanctum`

### 소프트 성장 루트

- `prayer_cistern`: `cinder_dive` 단서 또는 업그레이드 재료
- `sunken_cells`: 서포트 적 대응용 스킬 강화
- `bell_tower`: 패링 확장형 유물
- `sealed_roof`: `veil_step` 또는 후반 챌린지 기술

## 수치 가드레일

- 이동 능력은 과도한 피해 기능을 가져서는 안 된다.
- 무기 스킬은 기본 콤보 총합의 1.5배를 넘기지 않는 편이 안전하다.
- `Gloom` 비용 20 미만은 남발되기 쉽고, 40 초과는 사용 빈도가 급감한다.
- 필수 진행 능력은 무조건 수동 획득으로 두고, RNG 드롭에 묶지 않는다.

## 구현 우선순위

### 1차

- `chain_grapple`, `black_wing`의 필드/전투 연계 강화
- 현재 무기 스킬 두 개의 정체성 선명화
- 패링 후 보상 구조 명확화

### 2차

- `cinder_dive` 추가
- 신규 무기군 `glass_rapier`
- 무기별 패링 후속기 구현

### 3차

- `veil_step`
- 스트레치 무기군 `penitence_maul`
- 고난도 챌린지 룸과 숙련 루트 확장

## 데이터 확장 메모

현재 구조로도 기본 설계는 가능하지만, 확장 시 아래가 있으면 편하다.

- `AbilityUpgradeData`
- `WeaponArtData`
- 적에게 "공중 취약", "장판 취약", "패링 취약" 같은 태그
- 방 오브젝트에 `break_tag`, `phase_tag`, `grapple_tag`

단, 초기 구현은 꼭 새 리소스 클래스를 늘리지 않아도 된다. 먼저 기존 `AbilityData`, `WeaponData`, `RelicData` 조합으로 체감을 만든 뒤, 필요할 때만 데이터 클래스를 쪼개는 편이 안전하다.

## 다른 문서와의 연결

- `monster-design-bible.md`: 어떤 적이 어떤 능력을 강제하는지 정의
- `equipment-design-bible.md`: 스킬 비용, 효율, 쿨다운을 장비와 어떻게 엮는지 정의

## 참고 링크

- Hollow Knight Wiki, `Spells and Abilities`: https://hollowknight.wiki/w/Spells_and_Abilities_(Hollow_Knight)
- Hollow Knight Wiki, `Charms`: https://hollowknight.wiki/w/Charms
- Ubisoft, `Prince of Persia: The Lost Crown Will Put Your Combat, Platforming, and Puzzle-Solving Skills to the Test`: https://news.ubisoft.com/en-au/article/e1SD5gR3TWqk5GPAjWHSz/prince-of-persia-the-lost-crown-will-put-your-combat-platforming-and-puzzlesolving-skills-to-the-test
- Ubisoft, `KILL A BOSS`: https://www.ubisoft.com/en-au/game/prince-of-persia/the-lost-crown/news-updates/5nm7fDnEK34mDofT67LhLf/kill-a-boss
- Guacamelee! Wiki, `Dimension Swap`: https://guacamelee.fandom.com/wiki/Dimension_Swap
