# Black Halo Equipment Design Bible

## 목적

이 문서는 `Black Halo`의 무기, 유물, 서약, 강화 재화를 하나의 장비 생태계로 정리한다. 목표는 단순히 아이템 수를 늘리는 것이 아니라, 플레이어가 "지금 어떤 태도로 이 구간을 돌파할 것인가"를 선택하게 만드는 것이다.

## 한국어 표기 기준

- 한국어 UI 표기는 [black-halo-korean-localization-glossary.md](./black-halo-korean-localization-glossary.md)를 기준으로 한다.
- 기존 무기, 유물, 서약의 한국어명은 현재 웹 빌드 번역을 우선 채택하고, 신규 장비와 재화 이름은 용어집의 제안 번역을 따른다.

## 장비 계층

`Black Halo`의 장비는 네 층으로 나누는 편이 가장 견고하다.

### 1. 무기

플레이 감각을 바꾼다.

- 공격 속도
- 리치
- 강인도 붕괴
- 스킬 성격

### 2. 유물

세팅의 방향성을 미세 조정한다.

- 공격적 빌드
- 패링 빌드
- 생존 빌드
- 탐험/수급 빌드

### 3. 서약

장기적인 전투 철학을 결정한다.

- `execution`
- `pursuit`
- `silence`

### 4. 강화 재화

성장을 지도 위의 보상과 연결한다.

- 메인 루트 보상
- 사이드룸 탐험
- 미니보스/보스 처치

## 장비 설계 원칙

- 무기는 조작감 차이가 분명해야 한다.
- 유물은 단순 상위호환을 만들지 않는다.
- 서약은 초반 선택이어도 끝까지 의미가 남아야 한다.
- 탐험 보상은 전투 변화를 즉시 체감시켜야 한다.
- 희귀 장비는 숫자만 크지 말고 플레이 루프를 바꿔야 한다.

## 무기군 설계

현재 구현 기준으로는 2종이 존재하며, 런칭 완성도를 높이려면 3종이 이상적이다.

### 1. `fallen_greatblade`

- 정체성: 처형, 강한 경직, 묵직한 타격
- 플레이 감각:
- 가장 느리지만 가장 명확한 한 방
- 초심자도 이해하기 쉬운 정직한 무기
- 추천 역할:
- 보스전
- 단단한 앵커형 적 상대
- 기준 수치:
- 기본 피해 18
- 헤비 피해 34
- 사거리 126
- 강인도 붕괴 280
- 공격 쿨다운 0.38
- 전용 스킬:
- `Halo Breaker`
- 추천 강화 축:
- 강인도 붕괴
- 패링 후 발동 속도
- 다운 상태 추가 피해

### 2. `chain_glaive`

- 정체성: 추격, 연속 압박, 넓은 판정
- 플레이 감각:
- 중거리 유지와 공중 진입이 쉬움
- 다수전에서 안정적
- 추천 역할:
- 중형 적 다수
- 후열 사제형 제거
- 기준 수치:
- 기본 피해 14
- 헤비 피해 26
- 사거리 148
- 강인도 붕괴 160
- 공격 쿨다운 0.28
- 전용 스킬:
- `Grief Spiral`
- 추천 강화 축:
- 마지막 타 끌어당김
- 그래플 연계 보너스
- 공중 사용 효율

### 3. `glass_rapier`

- 분류: 런칭 완성형 기준 추가 권장 무기
- 정체성: 정밀, 역습, 고숙련 보상
- 플레이 감각:
- 짧은 리치와 낮은 강인도 대신 빠른 회수
- 패링 성공 후 폭발적 가치
- 추천 역할:
- 단일 적 정밀 처치
- 숙련자용 빠른 보스전
- 제안 수치:
- 기본 피해 13
- 헤비 피해 22
- 사거리 102
- 강인도 붕괴 120
- 공격 쿨다운 0.22
- 전용 스킬:
- `Mirror Cant`

### 4. `penitence_maul`

- 분류: 스트레치 목표
- 정체성: 광역 붕괴, 지형 파괴, 초고위험 한 방
- 플레이 감각:
- 느리지만 장판과 군중을 한 번에 정리
- 숙련도가 없으면 공백이 큼
- 제안 수치:
- 기본 피해 24
- 헤비 피해 38
- 사거리 114
- 강인도 붕괴 340
- 공격 쿨다운 0.46
- 전용 스킬:
- `Pillar of Penance`

## 유물 슬롯 경제

유물은 `Hollow Knight`식 단순 슬롯 비용의 장점을 살리되, `Ori`와 `Prince of Persia`처럼 세팅을 자주 갈아끼울 가치가 있도록 설계한다.

### 추천 슬롯 구조

- 시작 슬롯: 3
- `aurex_arena` 이후: 4
- `reliquary_archive` 이후: 5
- `mirror_choir` 이후: 6
- 엔드게임 최대: 7

### 슬롯 철학

- 1코스트 유물은 범용 편의
- 2코스트 유물은 빌드 핵심
- 3코스트 유물은 스타일을 강하게 왜곡하는 주력

### 오버슬롯 제안

원한다면 고난도용으로 `Bleeding Halo` 규칙을 둘 수 있다.

- 슬롯 초과 장착 허용
- 대신 최대 체력 15% 감소
- 회복 효율 저하

이 규칙은 기본 모드보다 NG+나 보스러시 쪽에 더 어울린다.

## 유물 로스터 제안

현재 존재하는 유물 5종을 유지하고, 7종을 추가하면 장비 생태계가 안정된다.

### 기존 유물

#### `ember_bead`

- 비용: 1
- 역할: `Gloom` 수급 보조
- 추천 보상 위치: 초반 상점 또는 `fallen_armory`

#### `oath_nail`

- 비용: 2
- 역할: 헤비 공격 강인도 강화
- 추천 보상 위치: `prayer_cistern`

#### `veil_ribbon`

- 비용: 2
- 역할: 패링 윈도우 증가
- 추천 보상 위치: `bell_tower`

#### `crypt_salt`

- 비용: 1
- 역할: 방 클리어 후 미세 회복
- 추천 보상 위치: `sunken_cells`

#### `choir_censer`

- 비용: 2
- 역할: 스킬 공격 보정
- 추천 보상 위치: `scriptorium`

### 신규 유물

#### `ash_lantern`

- 비용: 1
- 역할: 파괴 가능한 벽과 약한 바닥 근처에서 은은한 반응
- 가치: 탐험 보조
- 추천 위치: `banner_ossuary`

#### `martyr_spur`

- 비용: 2
- 역할: 연속 타격 시 공격 속도 소폭 증가
- 가치: `chain_glaive`, `glass_rapier`와 궁합
- 추천 위치: `reliquary_archive`

#### `silver_lung`

- 비용: 2
- 역할: 원거리 피해 1회 완화 후 쿨다운
- 가치: 후반 사제형 적 카운터
- 추천 위치: `mirror_bridge`

#### `pilgrim_chain`

- 비용: 1
- 역할: `chain_grapple` 후 첫 타격 대미지 상승
- 가치: 이동 능력과 전투 연결
- 추천 위치: `thorns_vault`

#### `broken_psalter`

- 비용: 3
- 역할: 체력이 낮을수록 `Gloom` 획득량 증가
- 가치: 고위험 빌드 핵심
- 추천 위치: `sealed_roof`

#### `ivory_knot`

- 비용: 2
- 역할: 회복 시 짧은 피해 경감
- 가치: 보스전 안정성
- 추천 위치: `sunken_cells`

#### `second_dawn_shard`

- 비용: 3
- 역할: 패링 후 3초간 스킬 피해 증가
- 가치: 숙련자 보상용 핵심 유물
- 추천 위치: `seraph_vale` 전 보상실 또는 엔드게임 상점

## 서약과 장비의 결합

현재 서약 구조는 매우 좋다. 장비와의 결합만 선명하게 만들면 된다.

### `execution`

- 추천 무기:
- `fallen_greatblade`
- `penitence_maul`
- 추천 유물:
- `oath_nail`
- `second_dawn_shard`
- `broken_psalter`
- 플레이 감각:
- 위험하지만 짧은 교전

### `pursuit`

- 추천 무기:
- `chain_glaive`
- `glass_rapier`
- 추천 유물:
- `pilgrim_chain`
- `martyr_spur`
- `silver_lung`
- 플레이 감각:
- 이동과 추격 중심의 주도권 장악

### `silence`

- 추천 무기:
- `glass_rapier`
- `fallen_greatblade`
- 추천 유물:
- `veil_ribbon`
- `ivory_knot`
- `choir_censer`
- 플레이 감각:
- 정교한 패링, 안정적 리소스 관리

## 강화 재화 구조

강화 재화는 너무 많아지면 관리 피로만 늘어난다. 아래 4종이면 충분하다.

### `Imprint Fragment`

- 용도: 초기 무기 강화
- 공급: 일반 방, 초반 사이드룸

### `Reliquary Brass`

- 용도: 중반 무기/유물 업그레이드
- 공급: `reliquary` 지역, 미니보스

### `Mirror Glass`

- 용도: 후반 무기 개조, 상급 유물 강화
- 공급: `mirror` 지역

### `Saint's Husk`

- 용도: 보스 무기 스킬 개화, 최종 등급 강화
- 공급: 주요 보스 처치

## 장비 획득 구조

- 메인 루트:
- 무기군 해금
- 필수 슬롯 증가
- 기초 유물 공급

- 사이드룸:
- 빌드 핵심 유물
- 강화 재화 덩어리
- 숙련자 보상

- 상점/NPC:
- 범용 유물
- 강화 재화 보충
- 빌드 전환 지원

## 예시 빌드

### 1. 처형자 빌드

- 서약: `execution`
- 무기: `fallen_greatblade`
- 유물:
- `oath_nail`
- `second_dawn_shard`
- `crypt_salt`
- 특징:
- 패링 후 스킬 폭딜
- 보스전 강세

### 2. 추적자 빌드

- 서약: `pursuit`
- 무기: `chain_glaive`
- 유물:
- `pilgrim_chain`
- `martyr_spur`
- `silver_lung`
- 특징:
- 후열 압박, 다수전 안정성

### 3. 침묵의 성가 빌드

- 서약: `silence`
- 무기: `glass_rapier`
- 유물:
- `veil_ribbon`
- `choir_censer`
- `ivory_knot`
- 특징:
- 패링 기반 안정성
- 빠른 반격과 낮은 실수 비용

## 구현 우선순위

### 1차

- 기존 무기 2종과 유물 5종의 역할을 더 선명하게 조정
- 슬롯 증가 지점을 월드 진행과 연동
- 서약 추천 세팅을 HUD나 설명문에서 명확히 전달

### 2차

- `glass_rapier`
- 신규 유물 4종
- 유물 획득처를 사이드룸 보상과 강하게 연결

### 3차

- `penitence_maul`
- 오버슬롯 룰
- 유물 강화 또는 각성 시스템

## 데이터 매핑 메모

현재 구조만으로도 상당 부분 표현 가능하다.

- 무기:
- `WeaponData.base_damage`
- `WeaponData.heavy_damage`
- `WeaponData.range`
- `WeaponData.stagger`
- `WeaponData.gloom_gain`
- `WeaponData.attack_cooldown`
- `WeaponData.skill_name`

- 유물:
- `RelicData.slot_cost`
- `RelicData.effect_tags`
- `RelicData.stat_modifiers`

- 서약:
- `ContentLibrary.get_oath()`

즉, 지금 당장 필요한 것은 코드 증설보다 설계 일관성이다. 아이템 효과를 이 구조 안에서 먼저 정리하면, 이후 확장은 자연스럽게 따라온다.

## 다른 문서와의 연결

- `metroidvania-systems-benchmark.md`: 장비 설계의 기준선
- `monster-design-bible.md`: 어떤 장비가 어떤 적 조합에 유리한지 정의
- `skill-design-bible.md`: 장비가 스킬 비용과 리듬에 미치는 영향 정의

## 참고 링크

- Hollow Knight Wiki, `Charms`: https://hollowknight.wiki/w/Charms
- Ori and the Blind Forest Wiki, `Spirit Shards`: https://oriandtheblindforest.fandom.com/wiki/Spirit_Shards
- Ubisoft, `KILL A BOSS`: https://www.ubisoft.com/en-au/game/prince-of-persia/the-lost-crown/news-updates/5nm7fDnEK34mDofT67LhLf/kill-a-boss
- Castlevania Wiki, `Relic`: https://castlevania.fandom.com/wiki/Relic
- Castlevania Wiki, `Defensive Gear`: https://castlevania.fandom.com/wiki/Defensive_Gear
- Blasphemous Wiki, `Silver Grape`: https://blasphemous.fandom.com/wiki/Silver_Grape
