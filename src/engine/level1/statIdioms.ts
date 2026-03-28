/**
 * 10-level Chinese idiom scales for each game stat.
 *
 * Each array has exactly 10 entries, ordered from worst (index 0 = level 1)
 * to best (index 9 = level 10). All idioms are exactly 4 Chinese characters —
 * either well-known 成语 or literary four-character phrases (四字短语)
 * appropriate to the Three Kingdoms era and a classical ink-on-paper aesthetic.
 *
 * Stats covered (display labels in game):
 *   公论: 德行, 才学
 *   领地: 兵力, 战力, 士气, 粮草, 钱粮, 民心
 */

/* ── Type definition ──────────────────────────────────────── */

export type StatIdiomKey =
  | 'morale'
  | 'combatPower'
  | 'support'
  | 'morality'
  | 'talent'
  | 'military'
  | 'rations'
  | 'funds';

/* ── Idiom data ───────────────────────────────────────────── */

export const STAT_IDIOMS: Record<
  StatIdiomKey,
  readonly [string, string, string, string, string, string, string, string, string, string]
> = {

  /* ── 士气 (Morale, 0–100) ── soldier spirit & willingness to fight ── */
  morale: [
    '军心涣散', // 1  — mutiny-level despair; the army's will has disintegrated
    '士无斗志', // 2  — soldiers have lost all will to fight
    '人心惶惶', // 3  — widespread anxiety and fear in the ranks
    '将疲兵怠', // 4  — generals tired, soldiers slack
    '军心尚稳', // 5  — army's spirit is still steady (adequate)
    '士气渐振', // 6  — morale is gradually rising
    '三军用命', // 7  — all three armies obey orders willingly
    '将士效死', // 8  — officers and soldiers ready to lay down their lives
    '气吞万里', // 9  — spirit that swallows ten thousand li
    '士气如虹', // 10 — morale blazes like a rainbow
  ],

  /* ── 战力 (Combat Power, 0–100) ── derived from training + equipment ── */
  combatPower: [
    '乌合之众', // 1  — an undisciplined rabble
    '兵甲破败', // 2  — weapons and armor broken and useless
    '器械粗陋', // 3  — equipment crude and rough
    '行伍不整', // 4  — ranks are not in order
    '粗通阵法', // 5  — troops roughly know battle formations (adequate)
    '兵甲齐备', // 6  — weapons and armor in good supply
    '阵法严明', // 7  — formations strict and well-drilled
    '精兵强将', // 8  — elite soldiers, strong generals
    '百战精锐', // 9  — veterans hardened by a hundred battles
    '虎贲之师', // 10 — an army of tiger warriors
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

  /* ── 德行 (Morality / Virtue, 0–100) ── Liu Bei's public reputation ── */
  morality: [
    '暴虐无道', // 1  — cruel and without moral principle
    '声名狼藉', // 2  — reputation utterly ruined
    '德行有亏', // 3  — virtue found wanting
    '毁誉参半', // 4  — praise and censure in equal measure
    '持身尚正', // 5  — personal conduct still upright (adequate)
    '素有仁名', // 6  — long known for benevolence
    '德高望重', // 7  — virtue high, reputation weighty
    '仁德昭彰', // 8  — benevolence and virtue shining clearly
    '德被苍生', // 9  — virtue that shelters all living beings
    '至德如天', // 10 — supreme virtue vast as heaven
  ],

  /* ── 才学 (Talent / Reputation, 0–100) ── Liu Bei's reputed ability ── */
  talent: [
    '庸碌无能', // 1  — mediocre and utterly incompetent
    '才疏学浅', // 2  — sparse talent, shallow learning
    '见识短浅', // 3  — limited in vision and knowledge
    '略知皮毛', // 4  — knows only surface matters
    '中人之资', // 5  — ability of an ordinary man (adequate)
    '颇有才略', // 6  — possessing considerable resourcefulness
    '才兼文武', // 7  — talent spanning both civil and military arts
    '经天纬地', // 8  — ability to order heaven and earth
    '雄才大略', // 9  — heroic talent and grand strategy
    '旷世奇才', // 10 — a rare genius seen once in a generation
  ],

  /* ── 兵力 (Military Strength, headcount ~200–2000) ── number of soldiers ── */
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

  /* ── 钱粮 (Funds, ~0–10000) ── treasury ── */
  funds: [
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
