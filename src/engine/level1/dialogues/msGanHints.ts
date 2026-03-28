/**
 * Ms. Gan hint system — returns vague hints about the next patrol event.
 *
 * The event ID follows the pattern `patrol-{category}-{n}`.
 * We extract the category and map it to a flavour line.
 */

/* ── Category extraction ──────────────────────────────────── */

function extractCategory(eventId: string): string | null {
  // IDs look like "patrol-bandit-1", "patrol-famine-2", etc.
  const match = eventId.match(/^patrol-(\w+)-/);
  return match ? match[1] : null;
}

/* ── Hint table ───────────────────────────────────────────── */

const HINT_MAP: Record<string, string> = {
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

  const category = extractCategory(eventId);
  if (!category) return DEFAULT_HINT;

  return HINT_MAP[category] ?? DEFAULT_HINT;
}
