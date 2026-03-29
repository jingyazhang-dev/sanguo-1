/**
 * 10-level Chinese idiom scales for each game stat.
 *
 * Each array has exactly 10 entries, ordered from worst (index 0 = level 1)
 * to best (index 9 = level 10). All idioms are exactly 4 Chinese characters —
 * either well-known 成语 or literary four-character phrases (四字短语)
 * appropriate to the Three Kingdoms era and a classical ink-on-paper aesthetic.
 *
 * Stats covered (display labels in game):
 *   声望 (reputation)
 *   领地: 兵力, 操练, 装备, 粮草, 金, 民心
 */

/* ── Type definition ──────────────────────────────────────── */

export type StatIdiomKey =
  | 'reputation'
  | 'training'
  | 'equipment'
  | 'support'
  | 'military'
  | 'rations'
  | 'gold';

/* ── Idiom data ───────────────────────────────────────────── */

export const STAT_IDIOMS: Record<
  StatIdiomKey,
  readonly [string, string, string, string, string, string, string, string, string, string]
> = {

  /* ── 声望 (Reputation / Public Opinion, 0–100) ── combined virtue + ability in public eyes ── */
  reputation: [
    '声名狼藉', // 1  — reputation utterly ruined
    '为世所鄙', // 2  — despised by the world
    '时誉寥寥', // 3  — contemporary esteem thin and sparse
    '毁誉参半', // 4  — half praise, half blame
    '乡里知名', // 5  — known within the county and village (adequate)
    '声望渐著', // 6  — prestige gradually making its mark
    '颇负盛名', // 7  — bearing considerable fame
    '名重一时', // 8  — fame weighing heavy in the present age
    '名动一方', // 9  — fame that moves a region
    '天下仰望', // 10 — all under heaven look up with reverence
  ],

  /* ── 操练 (Training, 0–100) ── how well-drilled the troops are ── */
  training: [
    '未经操练', // 1  — completely untrained
    '训练无方', // 2  — training without direction or method
    '号令不明', // 3  — commands unclear, cannot execute orders
    '行伍不整', // 4  — ranks are not in order
    '粗通阵法', // 5  — troops roughly know battle formations (adequate)
    '纪律渐严', // 6  — discipline is gradually tightening
    '阵法严明', // 7  — formations strict and well-drilled
    '令行禁止', // 8  — orders obeyed instantly, prohibitions observed
    '精兵劲旅', // 9  — elite soldiers, formidable force
    '百战精兵', // 10 — veterans hardened by a hundred battles
  ],

  /* ── 装备 (Equipment, 0–100) ── quality of arms and armor ── */
  equipment: [
    '草木为兵', // 1  — using sticks and branches as weapons
    '兵甲破败', // 2  — weapons and armor broken and useless
    '器械粗陋', // 3  — equipment crude and rough
    '缺甲少刃', // 4  — lacking armor and blades
    '兵器尚全', // 5  — weapons still complete (adequate)
    '兵甲齐备', // 6  — weapons and armor in good supply
    '铁甲精刃', // 7  — iron armor and fine blades
    '精兵强将', // 8  — elite soldiers, strong generals
    '兵利甲坚', // 9  — sharp weapons and solid armor
    '甲坚兵利', // 10 — armor impenetrable, weapons razor-sharp
  ],

  /* ── 民心 (Popular Support, 0–100) ── how much the people support Liu Bei ── */
  support: [
    '民怨沸腾', // 1  — the people's grievances boil over
    '怨声载道', // 2  — bitter complaints fill every road
    '人心离散', // 3  — the hearts of the people are drifting apart
    '民心未附', // 4  — the people's loyalty has not yet attached
    '百姓观望', // 5  — commoners watch and wait, uncommitted (adequate)
    '民心渐附', // 6  — popular support is gradually growing
    '百姓拥戴', // 7  — the common people openly support
    '万民归心', // 8  — ten thousand hearts turn toward you
    '箪食壶浆', // 9  — people offer food and drink in welcome
    '众望所归', // 10 — the hope of all the realm converges upon you
  ],

  /* ── 兵力 (Military Strength, headcount ~200–20000) ── number of soldiers ── */
  military: [
    '寥寥数卒', // 1  — a mere handful of soldiers
    '兵微将寡', // 2  — troops few, officers scarce
    '兵力单薄', // 3  — military strength dangerously thin
    '人马不足', // 4  — men and horses insufficient
    '略有兵员', // 5  — some soldiers on the rolls (adequate)
    '兵马渐聚', // 6  — troops are gradually mustering
    '人马齐整', // 7  — men and horses in good order
    '兵强马壮', // 8  — soldiers strong, horses stout
    '大军云集', // 9  — a great host gathers like storm clouds
    '雄师满营', // 10 — a mighty army fills every camp
  ],

  /* ── 粮草 (Rations, days of supply 0–120) ── how many days the army can eat ── */
  rations: [
    '弹尽粮绝', // 1  — all supplies utterly exhausted
    '朝不保夕', // 2  — cannot guarantee surviving past sundown
    '存粮将尽', // 3  — stored grain is nearly gone
    '粮草不继', // 4  — provisions are not being replenished
    '勉强度日', // 5  — barely scraping by day to day (adequate)
    '粮草尚足', // 6  — rations are still sufficient
    '军粮充裕', // 7  — military grain is plentiful
    '仓廪丰实', // 8  — the granaries are full and solid
    '积粮如山', // 9  — grain piled high as mountains
    '粮秣满仓', // 10 — provisions overflow every storehouse
  ],

  /* ── 金 (Gold/Funds, ~0–100000) ── treasury ── */
  gold: [
    '囊空如洗', // 1  — purse empty as if washed clean
    '捉襟见肘', // 2  — pulling the collar exposes the elbow (barely solvent)
    '入不敷出', // 3  — income cannot cover expenditures
    '用度拮据', // 4  — spending is tight and constrained
    '略有结余', // 5  — a small surplus remains (adequate)
    '用度尚足', // 6  — funding is still adequate
    '府库充盈', // 7  — the government treasury is filling
    '钱粮丰厚', // 8  — money and grain are abundant
    '财帛广积', // 9  — wealth has been broadly accumulated
    '金玉满堂', // 10 — gold and jade fill the hall
  ],
};


