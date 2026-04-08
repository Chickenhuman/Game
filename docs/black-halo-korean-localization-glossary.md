# Black Halo Korean Localization Glossary

## 목적

이 문서는 `Black Halo` 관련 MD 문서에서 사용한 영어 고유명사와 내부 ID에 대응하는 한국어 UI 표기를 모아 둔 중앙 용어집이다.

- 한국어 언어 설정에서는 이 문서의 `한국어 UI명`을 우선 사용한다.
- 기존 `web/game.js`에 이미 존재하는 한국어 표기는 그대로 채택한다.
- 아직 코드에 없는 신규 항목은 문서용 제안 번역으로 표시한다.
- 본문에서 영문 이름이 남아 있더라도 실제 노출명은 이 표를 기준으로 통일한다.

## 표기 원칙

- `내부 ID`는 데이터, 저장, 스크립트 참조용으로 유지한다.
- `영문 UI명`은 원문 기획, 레퍼런스, 영어 로컬라이징 기준값이다.
- `한국어 UI명`은 실제 한국어 게임 설정에서 보일 이름이다.
- `상태`가 `기존`이면 현재 웹 빌드 번역과 맞춘 값이고, `제안`이면 문서 설계 단계에서 새로 정한 값이다.

## 타이틀 및 핵심 용어

| 내부 ID | 영문 UI명 | 한국어 UI명 | 상태 | 비고 |
| --- | --- | --- | --- | --- |
| `black_halo` | Black Halo | 블랙 헤일로 | 기존 | 서사 본문에서는 필요 시 `검은 후광` 병용 가능 |
| `gloom` | Gloom | 글룸 | 기존 | 전투 자원 |
| `ash` | Imprint | 각인 | 변경 | 성장/강화 재화 |
| `ash_cache` | Imprint Cache | 각인 보관함 | 변경 | 사이드룸 보상 태그 |
| `memory_shard` | Memory Shard | 기억 파편 | 제안 | 서사 보상 태그 |
| `black_halo_succession_protocol` | Black Halo Succession Protocol | 블랙 헤일로 계승 의정서 | 기존 | 고문서/문서명 |
| `black_halo_inventory_fragment` | Black Halo Inventory Fragment | 블랙 헤일로 분류표 단편 | 기존 | 고문서/문서명 |

## 인물 및 보스

| 내부 ID | 영문 UI명 | 한국어 UI명 | 상태 | 비고 |
| --- | --- | --- | --- | --- |
| `cael_ashborne` | Cael Ashborne | 케일 애시본 | 기존 | 플레이어 캐릭터 |
| `brother_niv` | Brother Niv | 니브 형제 | 기존 | 허브 NPC |
| `mara_bellwright` | Mara Bellwright | 마라 벨라이트 | 기존 | 허브 NPC |
| `sir_joren` | Sir Joren | 조렌 경 | 기존 | 허브 NPC |
| `sir_aurex` | Sir Aurex | 오렉스 경 | 기존 | 중간 보스 |
| `seraph_vale` | Seraph Vale | 세라프 베일 | 기존 | 최종 보스 |

## 지역 및 방 이름

| 내부 ID | 영문 UI명 | 한국어 UI명 | 상태 | 비고 |
| --- | --- | --- | --- | --- |
| `ashfall` | Ashfall | 애시폴 | 기존 | 구역명 |
| `ashfall_bastion` | Ashfall Bastion | 애시폴 성채 | 기존 | 대구역/환경 세트 |
| `reliquary` | Reliquary | 성유물 성역 | 기존 | 구역명 |
| `reliquary_shaft` | Reliquary Shaft | 성유물 승강구 | 제안 | 대구역/환경 세트 |
| `mirror` | Mirror | 거울 성역 | 기존 | 구역명 |
| `mirror_chapel` | Mirror Chapel | 거울 성소 | 제안 | 대구역/환경 세트 |
| `hub_sanctuary` | Wake Ward | 각성실 | 변경 | 허브 |
| `ashfall_gate` | Ashfall Gate | 애시폴 관문 | 기존 | 메인 경로 |
| `ashfall_rampart` | Torn Rampart | 찢긴 성벽길 | 기존 | 메인 경로 |
| `ashfall_crypt` | Crypt Threshold | 지하묘지 초입 | 기존 | 메인 경로 |
| `reliquary_lift` | Reliquary Lift | 성유물 승강로 | 기존 | 메인 경로 |
| `aurex_arena` | Hall of Mercy | 자비의 전당 | 기존 | 중간 보스 방 |
| `reliquary_archive` | Reliquary Archive | 성유물 기록고 | 기존 | 메인 경로 |
| `mirror_bridge` | Mirror Bridge | 거울 다리 | 기존 | 메인 경로 |
| `mirror_choir` | Choir of Glass | 유리의 합창당 | 기존 | 메인 경로 |
| `seraph_sanctum` | Sanctum of the Second Dawn | 두 번째 새벽의 성소 | 기존 | 최종 보스 방 |
| `seraph_sanctum_story` | Seraph Sanctum | 세라프 성소 | 제안 | 스토리 문서에서 쓰는 축약 명칭 |
| `fallen_armory` | Fallen Armory | 몰락한 병기고 | 기존 | 사이드룸 |
| `banner_ossuary` | Banner Ossuary | 깃발 납골당 | 기존 | 사이드룸 |
| `prayer_cistern` | Prayer Cistern | 기도의 저수조 | 기존 | 사이드룸 |
| `thorns_vault` | Thorns Vault | 가시 금고 | 기존 | 사이드룸 |
| `sunken_cells` | Sunken Cells | 가라앉은 감방 | 기존 | 사이드룸 |
| `bell_tower` | Bell Tower | 종탑 | 기존 | 사이드룸 |
| `scriptorium` | Lost Scriptorium | 잊힌 필사실 | 기존 | 사이드룸 |
| `sealed_roof` | Sealed Roof | 봉인된 옥상 | 기존 | 사이드룸 |

## 능력, 무기, 무기 기술

| 내부 ID | 영문 UI명 | 한국어 UI명 | 상태 | 비고 |
| --- | --- | --- | --- | --- |
| `chain_grapple` | Chain Grapple | 체인 그래플 | 기존 | 진행 능력 |
| `black_wing` | Black Wing | 블랙 윙 | 기존 | 진행 능력 |
| `cinder_dive` | Cinder Dive | 잿불 강하 | 제안 | 추가 능력 |
| `veil_step` | Veil Step | 장막 걸음 | 제안 | 추가 능력 |
| `chain_grapple_plus` | Chain Grapple+ | 체인 그래플+ | 제안 | 능력 강화안 |
| `black_wing_echo` | Black Wing Echo | 블랙 윙 잔향 | 제안 | 능력 강화안 |
| `fallen_greatblade` | Fallen Greatblade | 타락한 대검 | 기존 | 무기 |
| `chain_glaive` | Chain Glaive | 사슬 글레이브 | 기존 | 무기 |
| `glass_rapier` | Glass Rapier | 유리 세검 | 제안 | 신규 무기안 |
| `penitence_maul` | Penitence Maul | 참회 철퇴 | 제안 | 신규 무기안 |
| `ash_breaker` | Halo Breaker | 후광 파쇄 | 변경 | 무기 기술 |
| `grief_spiral` | Grief Spiral | 비탄의 나선 | 기존 | 무기 기술 |
| `mirror_cant` | Mirror Cant | 거울 성가 | 제안 | 무기 기술 |
| `pillar_of_ash` | Pillar of Penance | 참회의 기둥 | 변경 | 무기 기술 |

## 서약

| 내부 ID | 영문 UI명 | 한국어 UI명 | 상태 | 비고 |
| --- | --- | --- | --- | --- |
| `execution` | Execution | 처형 | 기존 | 공격형 서약 |
| `pursuit` | Pursuit | 추적 | 기존 | 기동형 서약 |
| `silence` | Silence | 침묵 | 기존 | 패링형 서약 |

## 적, 엘리트, 보스 페이즈

| 내부 ID | 영문 UI명 | 한국어 UI명 | 상태 | 비고 |
| --- | --- | --- | --- | --- |
| `shield_paladin` | Shield Paladin | 방패 성기사 | 기존 | 일반 적 |
| `lancer` | Lancer | 창기병 | 기존 | 일반 적 |
| `choir_adept` | Choir Adept | 성가 수행사제 | 기존 | 일반 적 |
| `inquisitor` | Inquisitor | 심문관 | 기존 | 일반 적 |
| `blessed_hound` | Blessed Hound | 축복받은 사냥개 | 기존 | 일반 적 |
| `banner_penitent` | Banner Penitent | 깃발 참회자 | 제안 | 신규 일반 적 |
| `chain_deacon` | Chain Deacon | 사슬 부제 | 제안 | 신규 일반 적 |
| `glass_martyr` | Glass Martyr | 유리 순교자 | 제안 | 신규 엘리트 |
| `banner_penitent_elder` | Banner Penitent Elder | 장로 깃발 참회자 | 제안 | 엘리트 변형 |
| `thorn_reliquarist` | Thorn Reliquarist | 가시 성유물지기 | 제안 | 엘리트 변형 |
| `glass_martyr_ascended` | Ascended Glass Martyr | 승천한 유리 순교자 | 제안 | 엘리트 변형 |
| `aurex_phase_1` | Mercy Bound | 자비의 속박 | 제안 | 오렉스 1페이즈 |
| `aurex_phase_2` | Mercy Broken | 깨진 자비 | 제안 | 오렉스 2페이즈 |
| `seraph_phase_1` | Second Dawn | 두 번째 새벽 | 제안 | 세라프 1페이즈 |
| `seraph_phase_2` | Holy Pursuit | 성스러운 추격 | 제안 | 세라프 2페이즈 |
| `seraph_phase_3` | Radiant Collapse | 찬란한 붕괴 | 제안 | 세라프 3페이즈 |

## 유물 및 강화 재화

| 내부 ID | 영문 UI명 | 한국어 UI명 | 상태 | 비고 |
| --- | --- | --- | --- | --- |
| `ember_bead` | Ember Bead | 불씨 구슬 | 기존 | 유물 |
| `oath_nail` | Oath Nail | 서약 못 | 기존 | 유물 |
| `veil_ribbon` | Veil Ribbon | 장막 리본 | 기존 | 유물 |
| `crypt_salt` | Crypt Salt | 지하묘지 소금 | 기존 | 유물 |
| `choir_censer` | Choir Censer | 합창단 향로 | 기존 | 유물 |
| `ash_lantern` | Trace Lantern | 흔적 등불 | 변경 | 신규 유물 |
| `martyr_spur` | Martyr Spur | 순교자 박차 | 제안 | 신규 유물 |
| `silver_lung` | Silver Lung | 은빛 허파 | 제안 | 신규 유물 |
| `pilgrim_chain` | Pilgrim Chain | 순례자 사슬 | 제안 | 신규 유물 |
| `broken_psalter` | Broken Psalter | 깨진 시편집 | 제안 | 신규 유물 |
| `ivory_knot` | Ivory Knot | 상아 매듭 | 제안 | 신규 유물 |
| `second_dawn_shard` | Second Dawn Shard | 두 번째 새벽 파편 | 제안 | 신규 유물 |
| `ash_fragment` | Imprint Fragment | 각인 파편 | 변경 | 강화 재화 |
| `reliquary_brass` | Reliquary Brass | 성유물 황동 | 제안 | 강화 재화 |
| `mirror_glass` | Mirror Glass | 거울 유리 | 제안 | 강화 재화 |
| `saints_husk` | Saint's Husk | 성자의 허물 | 제안 | 강화 재화 |
| `bleeding_halo` | Bleeding Halo | 피흘리는 후광 | 제안 | 고난도 규칙명 |

## 문서 사용 메모

- 스토리 문서에서는 서사적 울림을 위해 영어명과 한국어 의미 번역을 병용할 수 있다.
- 시스템 문서, UI 문구, 아이템 표기, HUD 표기에서는 이 용어집의 `한국어 UI명`을 우선한다.
- 신규 문서를 추가할 때는 먼저 이 용어집에 항목을 추가한 뒤 본문을 작성하는 흐름을 권장한다.
