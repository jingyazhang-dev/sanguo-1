/**
 * Ms. Gan hint system — returns vague hints about the next patrol event.
 *
 * V2: looks up the event in the v2 event pool to get the hintCategory.
 */

import { PATROL_EVENTS_V2 } from '../events/patrolEventsV2';

/* ── Hint table ───────────────────────────────────────────── */

const HINT_MAP: Record<string, string> = {
  匪患:   '甘夫人轻蹙蛾眉，低声道："夫君，妾身听街坊婆婆们说，近来往东边去的路上似有些不太平……出城巡访时，还望多带些人手，小心为上。"',
  难民:   '甘夫人放下手中的针线，面露忧色："夫君，妾身听闻……似乎有不少背井离乡的人正朝小沛赶来。也不知是遭了什么难……"',
  商旅:   '甘夫人眉眼含笑，忽而道："对了，妾身今日在井边打水时，听邻家嫂子说起，近来似有外地商队往小沛这边来了，兴许能带来些稀罕物事呢。"',
  天灾:   '甘夫人叹了口气，眉间浮起淡淡愁云："夫君，近日坊间有些风言风语，说是周边乡里的庄稼长势不好，百姓们似乎在为口粮犯愁……"',
  野兽:   '甘夫人犹豫了一下，方才道："夫君，妾身听说近来有猛兽出没乡野，已有农人受伤……巡访时还请多加小心。"',
  士族:   '甘夫人忽而浅笑道："夫君，妾身今日听人闲话，说附近有一户人家最近颇为活跃，似乎在打听咱们小沛的事情呢。"',
  纷争:   '甘夫人犹豫了一下，方才道："夫君，这几日妾身去集市时，总觉得乡里的气氛有些不对，邻里之间似乎起了些口角嫌隙，人心浮动得很。"',
  疫病:   '甘夫人压低了声音，面露忧色："夫君，妾身有件事不知当不当讲……近日坊间隐约有人提及染病之事，虽不知真假，但还是留心些为好。"',
  贤才:   '甘夫人忽而浅笑道："夫君，妾身今日听人闲话，说附近村子里似乎住着一位颇有学问的先生，乡民们都敬重得很呢。"',
  庆典:   '甘夫人笑意盈盈道："夫君，妾身听闻乡间近日正在筹备一场祭祀庆典，村民们忙前忙后的，甚是热闹，颇有些太平年景的味道。"',
  // Legacy categories from old event IDs (keep for compatibility)
  bandit:   '甘夫人轻蹙蛾眉，低声道："夫君，妾身听街坊婆婆们说，近来往东边去的路上似有些不太平……出城巡访时，还望多带些人手，小心为上。"',
  famine:   '甘夫人叹了口气，眉间浮起淡淡愁云："夫君，近日坊间有些风言风语，说是周边乡里的庄稼长势不好，百姓们似乎在为口粮犯愁……"',
  trade:    '甘夫人眉眼含笑，忽而道："对了，妾身今日在井边打水时，听邻家嫂子说起，近来似有外地商队往小沛这边来了，兴许能带来些稀罕物事呢。"',
  refugee:  '甘夫人放下手中的针线，面露忧色："夫君，妾身听闻……似乎有不少背井离乡的人正朝小沛赶来。也不知是遭了什么难……"',
  dispute:  '甘夫人犹豫了一下，方才道："夫君，这几日妾身去集市时，总觉得乡里的气氛有些不对，邻里之间似乎起了些口角嫌隙，人心浮动得很。"',
  plague:   '甘夫人压低了声音，面露忧色："夫君，妾身有件事不知当不当讲……近日坊间隐约有人提及染病之事，虽不知真假，但还是留心些为好。"',
  talent:   '甘夫人忽而浅笑道："夫君，妾身今日听人闲话，说附近村子里似乎住着一位颇有学问的先生，乡民们都敬重得很呢。"',
  ceremony: '甘夫人笑意盈盈道："夫君，妾身听闻乡间近日正在筹备一场祭祀庆典，村民们忙前忙后的，甚是热闹，颇有些太平年景的味道。"',
};

const DEFAULT_HINT =
  '甘夫人想了想，摇头浅笑道："夫君问起外头的事么？近日倒不曾听闻什么特别的，邻里之间一切如常，也算是难得的安稳日子。"';

/* ── Public API ───────────────────────────────────────────── */

/**
 * Returns a vague hint about the upcoming patrol event category.
 *
 * @param eventId  The pre-seeded patrol event ID, or `null` if none seeded yet.
 */
export function getHint(eventId: string | null): string {
  if (!eventId) return DEFAULT_HINT;

  // V2: look up hintCategory from the event pool
  const v2Event = PATROL_EVENTS_V2.find((e) => e.id === eventId);
  if (v2Event?.hintCategory) {
    return HINT_MAP[v2Event.hintCategory] ?? DEFAULT_HINT;
  }

  // Fallback: try parsing old-style ID (patrol-{category}-{n})
  const match = eventId.match(/^patrol-(\w+)-/);
  if (match) {
    return HINT_MAP[match[1]] ?? DEFAULT_HINT;
  }

  return DEFAULT_HINT;
}
