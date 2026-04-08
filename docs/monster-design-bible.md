# Black Halo Monster Design Bible

## 목적

이 문서는 `Black Halo`의 몬스터 설계를 지역, 역할, 전투 문법, 데이터 스펙까지 한 번에 정의한다. 현재 코드의 `EnemyArchetypeData`와 `BossPhaseData`로 바로 옮길 수 있게 작성하며, 모든 적은 "읽을 수 있고", "조합될 수 있고", "재방문 시 체감이 달라지는" 방향으로 설계한다.

## 한국어 표기 기준

- 한국어 UI 표기는 [black-halo-korean-localization-glossary.md](./black-halo-korean-localization-glossary.md)를 기준으로 한다.
- 적 이름과 방 이름은 현재 웹 빌드의 번역을 우선 채택하고, 신규 적 이름은 용어집의 제안 번역을 따른다.

## 데이터 구조 매핑

현재 적 데이터는 아래 필드를 가진다.

- `enemy_id`
- `display_name`
- `role`
- `max_health`
- `move_speed`
- `contact_damage`
- `weapon_reach`
- `aggression`
- `palette_key`
- `rig_id`

이 구조로 충분히 기본 전투를 구성할 수 있으므로, 문서에서는 각 적마다 아래 5가지를 반드시 고정한다.

- 방 안에서 맡는 역할
- 첫 조우 시 읽히는 시각 신호
- 플레이어가 대응해야 할 카운터 플레이
- 어떤 적과 같이 배치해야 위협이 살아나는지
- 1차 밸런스 숫자

## 전투 문법

### 역할군 정의

- `anchor`: 전선을 고정하고 플레이어의 접근 각도를 제한한다.
- `pressure`: 직선 돌입이나 긴 리치로 발을 묶는다.
- `support`: 투사체, 버프, 공간 오염으로 다른 적을 살린다.
- `hunter`: 플레이어 위치를 집요하게 추적한다.
- `beast`: 빠른 이동과 낮은 체력으로 템포를 흔든다.
- `elite`: 일반 규칙을 비틀어 현재까지의 학습을 검사한다.

### 텔레그래프 규칙

- 담금질된 금빛 섬광: 패링 가능한 주요 공격
- 심홍빛 후광: 회피만 가능한 붕괴 공격
- 청색 원형 장판: 지연 폭발 또는 성역형 광역 공격
- 재 가루 잔상: 돌진 계열 이동 후딜 존재

### 방 조합 규칙

- 초반 방은 `anchor + beast` 또는 `anchor + pressure`만 사용한다.
- 중반 방부터 `support`를 섞어 위치 압박을 만든다.
- 후반 방은 `hunter + support`로 이동 능력을 강제 사용하게 만든다.
- 엘리트는 단독 위협이 아니라 기존 조합의 문법을 뒤틀 때만 넣는다.

## 지역별 전투 정체성

### Ashfall Bastion

- 테마: 전선 고정, 정면 충돌, 하단 추락 압박
- 플레이어 학습: 기본 공격 거리, 패링, 짧은 대시 회피
- 주 적군: `anchor`, `beast`

### Reliquary Shaft

- 테마: 긴 리치, 수직 이동, 지연형 공격
- 플레이어 학습: `chain_grapple`, 점프 타이밍, 공중 방향 전환
- 주 적군: `pressure`, `support`, `hunter`

### Mirror Chapel

- 테마: 투사체, 순간 이동성 압박, 이중 각도 공격
- 플레이어 학습: `black_wing`, 공중 재배치, 빠른 우선순위 판단
- 주 적군: `support`, `hunter`, `elite`

## 코어 몬스터 로스터

아래 8종은 런칭 기준으로 권장하는 핵심 로스터다. 현재 코드에 이미 있는 5종은 유지하고, 3종을 추가하면 지역 전투 문법이 훨씬 선명해진다.

### 1. `shield_paladin` / 방패 성기사

- 역할: `anchor`
- 배치 지역: `ashfall_gate`, `ashfall_crypt`, `sunken_cells`
- 시각 신호: 큰 방패와 낮은 자세, 공격 전에 왼발을 고정
- 행동:
- 짧은 전진 후 방패 밀치기
- 플레이어가 정면에 오래 머물면 근거리 연타 유도
- 카운터 플레이:
- 패링 성공 시 가장 큰 보상
- 후방 점프나 공중 강공으로 방패축 이탈 가능
- 조합 궁합:
- `blessed_hound`와 같이 쓰면 회피 각을 줄인다.
- `choir_adept`와 같이 쓰면 전면 압박과 원거리 압박이 동시에 성립한다.
- 1차 스펙:
- 체력 55
- 이동 속도 90
- 접촉 피해 12
- 리치 90
- 공격성 1.0

### 2. `lancer` / 창기병

- 역할: `pressure`
- 배치 지역: `ashfall_rampart`, `reliquary_lift`, `bell_tower`
- 시각 신호: 창을 뒤로 빼고 상체를 길게 늘린다.
- 행동:
- 긴 직선 찌르기
- 중거리 유지 후 다시 간격을 벌림
- 카운터 플레이:
- 찌르기 끝에 생기는 빈틈을 노린다.
- 점프 후 후면 착지로 쉽게 궤적을 비틀 수 있다.
- 조합 궁합:
- `shield_paladin` 뒤에 세우면 정면 돌파를 어렵게 만든다.
- `inquisitor`와 함께 쓰면 좌우 압박이 동시 발생한다.
- 1차 스펙:
- 체력 42
- 이동 속도 135
- 접촉 피해 10
- 리치 118
- 공격성 1.2

### 3. `choir_adept` / 성가 수행사제

- 역할: `support`
- 배치 지역: `ashfall_crypt`, `reliquary_archive`, `mirror_choir`
- 시각 신호: 성가를 읊는 듯한 정지 자세, 발밑 청색 문양
- 행동:
- 짧은 템포의 저속 투사체 발사
- 주기적으로 버프 성가를 외워 근처 적의 공격 빈도 증가
- 카운터 플레이:
- 우선 처치 대상
- 대시나 그래플로 빠르게 파고들어야 안전하다.
- 조합 궁합:
- 모든 근접 적과 잘 맞지만 2기 이상 중첩은 금지
- `shield_paladin` 또는 `inquisitor`와 조합 시 가장 위협적
- 1차 스펙:
- 체력 34
- 이동 속도 80
- 접촉 피해 9
- 리치 150
- 공격성 0.9

### 4. `inquisitor` / 심문관

- 역할: `hunter`
- 배치 지역: `reliquary_lift`, `reliquary_archive`, `scriptorium`, `mirror_choir`
- 시각 신호: 옆걸음 추적, 손목을 비틀며 채찍 예고
- 행동:
- 플레이어 축을 따라가다 대각선 전진 베기
- 거리 확보 시 중거리 채찍 확장 공격
- 카운터 플레이:
- 예측 회피보다 패링 또는 수직 회피가 더 안정적
- `black_wing` 해금 이후에는 상단 축을 잡아 역으로 제압 가능
- 조합 궁합:
- `choir_adept`와 함께 나오면 우선순위 판단을 강요한다.
- `lancer`와 같이 쓰면 뒷걸음이 봉쇄된다.
- 1차 스펙:
- 체력 48
- 이동 속도 150
- 접촉 피해 11
- 리치 108
- 공격성 1.3

### 5. `blessed_hound` / 축복받은 사냥개

- 역할: `beast`
- 배치 지역: `ashfall_rampart`, `mirror_bridge`, `sealed_roof`
- 시각 신호: 앞발을 두 번 긁고 낮게 웅크림
- 행동:
- 낮은 포물선 돌진
- 착지 후 짧은 후딜
- 카운터 플레이:
- 과잉 회피보다 짧은 점프나 짧은 대시가 유리
- 후딜이 명확하므로 큰 무기에게 좋은 연습 상대
- 조합 궁합:
- `anchor` 옆에서 측면 붕괴를 담당
- 단독으로는 위협이 낮으므로 2기까지 허용
- 1차 스펙:
- 체력 36
- 이동 속도 180
- 접촉 피해 8
- 리치 86
- 공격성 1.5

### 6. `banner_penitent` / 깃발 참회자

- 역할: `anchor`
- 배치 지역: `ashfall_gate`, `banner_ossuary`
- 시각 신호: 불탄 군기를 앞세워 상반신을 완전히 가린다.
- 행동:
- 정면 투사체를 막는 배너 가드
- 짧은 돌진 후 넓은 휘둘러치기
- 카운터 플레이:
- 상단 공격이나 후면 진입이 유효
- 배너 파괴 후 일정 시간 방어력 약화
- 조합 궁합:
- `blessed_hound`와의 조합으로 초반 정면 전선 강화
- 1차 스펙:
- 체력 62
- 이동 속도 82
- 접촉 피해 11
- 리치 102
- 공격성 0.95

### 7. `chain_deacon` / 사슬 부제

- 역할: `support`
- 배치 지역: `thorns_vault`, `reliquary_lift`, `sunken_cells`
- 시각 신호: 바닥에 사슬 원형 문양을 남긴다.
- 행동:
- 짧은 시간 후 터지는 속박 고리 생성
- 플레이어 점프 궤적을 읽고 천장 근처로 투척
- 카운터 플레이:
- 발밑 문양을 읽고 미리 축을 비워야 한다.
- 접근해서 끊으면 가장 쉽게 처리 가능
- 조합 궁합:
- `lancer`, `inquisitor`와 함께 배치 시 이동 자유를 크게 줄임
- 1차 스펙:
- 체력 38
- 이동 속도 88
- 접촉 피해 8
- 리치 165
- 공격성 0.85

### 8. `glass_martyr` / 유리 순교자

- 역할: `elite`
- 배치 지역: `mirror_bridge`, `mirror_choir`, `seraph_sanctum`
- 시각 신호: 피격 시 몸체에 금이 가고 후광이 청색에서 심홍으로 바뀜
- 행동:
- 순간 짧은 이동 후 십자 베기
- 체력 절반 이하에서 파편 투사체 추가
- 카운터 플레이:
- 공격 욕심을 내면 파편 역습을 맞기 쉽다.
- 공중 체공 후 하단 진입이 가장 안전
- 조합 궁합:
- 단독 엘리트 또는 `choir_adept` 1기와만 조합
- 1차 스펙:
- 체력 74
- 이동 속도 160
- 접촉 피해 14
- 리치 122
- 공격성 1.25

## 엘리트 규칙

엘리트는 체력만 높은 적이 아니다. 기존 적 문법을 비트는 존재여야 한다.

- `banner_penitent_elder`
  - 배너 가드 중 투사체 반사
- `thorn_reliquarist`
  - 속박 고리가 2단 폭발
- `glass_martyr_ascended`
  - 피격 후 짧은 무적 대시 추가

엘리트 배치는 한 방에 1기만 허용한다.

## 보스 설계

### `sir_aurex`

- 전투 역할: 중반부 문지기
- 플레이어가 검증받는 요소:
- 패링 정확도
- 리치가 긴 적 대응
- 제한된 이동 수단으로 정면 돌파하는 능력
- 페이즈 구조:
- 1페이즈 `Mercy Bound`: 방패 압박과 기본 전선 학습
- 2페이즈 `Mercy Broken`: 돌진 빈도 증가, `chain_grapple`의 필요성을 암시
- 보상:
- `chain_grapple`
- 이후 수직 구조와 옆길 확장

### `seraph_vale`

- 전투 역할: 최종 숙련도 시험
- 플레이어가 검증받는 요소:
- 공중 재배치
- 패링과 회피 구분
- `Gloom` 운용
- 장비 세팅 최적화
- 페이즈 구조:
- 1페이즈 `Second Dawn`: 정직한 근접 패턴
- 2페이즈 `Holy Pursuit`: 대시 추격과 화면 절단 패턴
- 3페이즈 `Radiant Collapse`: 광역 붕괴와 공중 대응 강제
- 보상:
- 서사 결말
- 고난도 재도전 모드 해금 트리거

## 방 조합 예시

### 초반 예시

- `ashfall_gate`
- `shield_paladin` 1
- `banner_penitent` 1

- `ashfall_rampart`
- `lancer` 1
- `blessed_hound` 2

### 중반 예시

- `reliquary_lift`
- `lancer` 1
- `inquisitor` 1
- `chain_deacon` 1

- `reliquary_archive`
- `choir_adept` 1
- `inquisitor` 1

### 후반 예시

- `mirror_bridge`
- `glass_martyr` 1
- `blessed_hound` 1

- `mirror_choir`
- `choir_adept` 1
- `inquisitor` 1
- `glass_martyr` 1

## 밸런스 가드레일

- 초반 적 평균 처치 시간은 기본 무기 기준 3~5초
- 중반 적 평균 처치 시간은 스킬 미사용 기준 4~7초
- 후반 정예 적은 스킬 사용을 강하게 유도하되, 무기만으로도 처치 가능해야 함
- 패링 가능한 큰 공격은 명확한 보상을 줘야 함
- 회피 불가 상황은 절대 허용하지 않음

## 구현 우선순위

1. 기존 5종의 패턴과 텔레그래프를 먼저 선명하게 다듬는다.
2. `banner_penitent`, `chain_deacon`, `glass_martyr`를 추가해 지역 정체성을 보강한다.
3. 엘리트 변형은 별도 AI보다 기존 패턴 조합으로 우선 구현한다.
4. 보스는 새 규칙을 만들기보다 기존 적 규칙을 심화한다.

## 다른 문서와의 연결

- `skill-design-bible.md`: 이동 능력과 적 배치의 상호작용 정의
- `equipment-design-bible.md`: 적 저항, 유물 메타, 무기별 카운터 전략 정의

## 참고 링크

- Hollow Knight Wiki, `Spells and Abilities`: https://hollowknight.wiki/w/Spells_and_Abilities_(Hollow_Knight)
- Ubisoft, `KILL A BOSS`: https://www.ubisoft.com/en-au/game/prince-of-persia/the-lost-crown/news-updates/5nm7fDnEK34mDofT67LhLf/kill-a-boss
- Ubisoft, `Prince of Persia: The Lost Crown Will Put Your Combat, Platforming, and Puzzle-Solving Skills to the Test`: https://news.ubisoft.com/en-au/article/e1SD5gR3TWqk5GPAjWHSz/prince-of-persia-the-lost-crown-will-put-your-combat-platforming-and-puzzlesolving-skills-to-the-test
- Guacamelee! Wiki, `Olmec's Headbutt`: https://guacamelee.fandom.com/wiki/Olmec%27s_Headbutt
