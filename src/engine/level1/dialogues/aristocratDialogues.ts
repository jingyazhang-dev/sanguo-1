import type {
  DialogueTopic,
  AristocraticContact,
  LevelConditions,
  GameStats,
} from '../../../types/level1Types';
import {
  MIZHU_SUPPORT_THRESHOLD,
  MIZHU_MARRIAGE_THRESHOLD,
  MIZHU_JOIN_THRESHOLD,
  CHENDENG_RATIONS_THRESHOLD,
  CHENDENG_SUPPORT_THRESHOLD,
} from '../constants';

/* ── Public API ───────────────────────────────────────────── */

/**
 * Build the list of dialogue topics available for a given aristocratic
 * contact, filtered by the current game state.
 *
 * Availability logic is fully resolved here — the caller just renders
 * whatever topics are returned.
 */
export function getTopicsForContact(
  contact: AristocraticContact,
  conditions: LevelConditions,
  _stats: GameStats,
  _round: number,
): DialogueTopic[] {
  switch (contact.id) {
    case 'kongrong':
      return buildKongRongTopics(conditions);
    case 'mizhu':
      return buildMiZhuTopics(contact, conditions);
    case 'chendeng':
      return buildChenDengTopics(contact, conditions);
    default:
      return [];
  }
}

/* ── Kong Rong (孔融) ─────────────────────────────────────── */

function buildKongRongTopics(conditions: LevelConditions): DialogueTopic[] {
  const topics: DialogueTopic[] = [];

  /* 寒暄 — always available */
  topics.push({
    id: 'kongrong-greeting',
    label: '寒暄',
    lines: [
      '孔融闻报刘备来访，亲自迎至中堂门前，长揖为礼。二人于堂中分宾主落座，侍者奉茶，孔融含笑道："玄德公远道而来，蓬荜生辉。"言辞间颇多亲切。',
      '孔融命人备下薄酒果品，于厅中设席款待。烛火映照二人面庞，杯盏交错间，孔融纵论天下时局，对刘备之仁德颇多嘉许，语气中隐有相见恨晚之意。',
      '孔融以主人之礼相待，不卑不亢。二人把茶清谈，从经史子集聊到天下兴亡，气氛甚是融洽，窗外蝉鸣不觉已入黄昏。',
    ],
    // relationship +5 applied by component (greeting convention)
  });

  /* 品评 — always available; sets publicOpinionSet and boosts morality/talent */
  topics.push({
    id: 'kongrong-eval',
    label: '品评',
    lines: [
      '孔融放下茶盏，细细端详刘备良久，忽以品评之法论道："吾观玄德公，仁厚之中不失刚毅，沉稳之下暗藏锋芒——假以时日，必成大器。"',
      '孔融于众宾客前朗声道："刘玄德，汉室宗亲，仁德布于四海，才略足以安邦。融虽不才，愿以此评遍告徐州士林。"言毕举盏相敬。',
      '孔融捻须含笑，郑重作评："玄德公忠义仁厚，有古圣贤之风。以融之见，堪为一方牧守，安定黎庶。"此语一出，座中诸客无不侧目。',
      '孔融品评之名重于九鼎，经其金口一开，刘备仁德之名将随书信口碑传遍徐州士林，于声望一道，可谓一步登天。',
    ],
    statsDelta: { morality: 10, talent: 10 },
    conditionChanges: { publicOpinionSet: true },
  });

  /* 荐糜竺 — after public opinion is set, before Mi Zhu is unlocked */
  if (conditions.publicOpinionSet && !conditions.miZhuUnlocked) {
    topics.push({
      id: 'kongrong-intro-mizhu',
      label: '荐糜竺',
      lines: [
        '孔融饮罢一盏，忽而放下杯来，意味深长道："玄德公，融有一人要荐与你——徐州富商糜竺糜子仲。此人家资巨万，却非守财之辈，素怀匡世之志，为人慷慨仗义。"',
        '孔融唤来笔墨，当场修书一封，墨迹未干便递与刘备："融为你荐一人——糜子仲。此人虽是商贾出身，胸中却有丘壑。你持此书前往，以诚相待，必有所获。"',
        '孔融抚须笑道："玄德公若要在徐州站稳脚跟，有一人不可不见——糜竺。其家族富甲一方，门生故吏遍布郡县。若得他鼎力相助，大事可期。"',
      ],
      conditionChanges: { miZhuUnlocked: true },
      // also updateContactStatus('mizhu', 'known') — applied by component
    });
  }

  /* 荐陈登 — after public opinion is set, before Chen Deng is unlocked */
  if (conditions.publicOpinionSet && !conditions.chenDengUnlocked) {
    topics.push({
      id: 'kongrong-intro-chendeng',
      label: '荐陈登',
      lines: [
        '孔融沉吟片刻，又道："还有一人，融也要向玄德公举荐——广陵陈登陈元龙。此人才干卓著，深谙治政之道，在徐州望族中颇有号召之力。"',
        '孔融亲取素帛写下引荐信，仔细封好递来："玄德公，持此信去寻陈元龙。他为人虽冷淡些，却目光如炬。若能得其辅佐，治理徐州将事半功倍。"',
        '孔融端起茶盏轻啜，从容道："陈元龙在徐州士族中威望甚著，朝中亦有故交。若得其助力，玄德公在此间的根基便如磐石一般，牢不可破了。"',
      ],
      conditionChanges: { chenDengUnlocked: true },
      // also updateContactStatus('chendeng', 'known') — applied by component
    });
  }

  return topics;
}

/* ── Mi Zhu (糜竺) ────────────────────────────────────────── */

function buildMiZhuTopics(
  contact: AristocraticContact,
  conditions: LevelConditions,
): DialogueTopic[] {
  const topics: DialogueTopic[] = [];

  /* 寒暄 — always available */
  topics.push({
    id: 'mizhu-greeting',
    label: '寒暄',
    lines: [
      '糜竺亲迎于府门之外，将刘备引入正堂，分宾主落座。侍女奉上龙井好茶，清香袅袅。糜竺拱手笑道："使君大驾光临，寒舍蓬荜生辉。"',
      '糜竺与刘备于厅中闲坐，谈及南来北往的商道见闻与市井趣闻。言辞爽朗间，不经意流露出对刘备的由衷敬意。',
      '糜竺命人于后园设下丰盛酒宴，亲自为刘备斟酒布菜。席间谈笑风生，觥筹交错，二人越聊越投缘，竟不觉日影西斜。',
    ],
    // relationship +5 applied by component (greeting convention)
  });

  /* 支持 — relationship >= 40, not yet promised */
  if (contact.relationship >= MIZHU_SUPPORT_THRESHOLD && !conditions.miZhuPromisedSupport) {
    topics.push({
      id: 'mizhu-support',
      label: '支持',
      lines: [
        '刘备放下酒盏，坦然说起治理小沛所面临的种种困难——兵少粮缺，民心不稳，四邻虎视。言辞恳切间，向糜竺求援之意已不言而喻。',
        '糜竺静静听完，沉吟良久。烛火映照着他的面庞，终于抬起头来，郑重点头："使君之志，竺已尽知。糜家虽是商贾之族，亦知何为大义。竺愿鼎力相助。"',
        '糜竺一拍案几，慨然应诺："使君放心！糜家经营数代，虽不敢称富甲天下，但助使君成就一番大业，竺义不容辞！"',
        '有了糜竺倾力相助，钱粮器物源源而来。刘备在徐州的根基自此有了一层坚实的后盾，行事间底气也足了几分。',
      ],
      conditionChanges: { miZhuPromisedSupport: true },
    });
  }

  /* 联姻 — relationship >= 60, support already promised, not yet proposed */
  if (
    contact.relationship >= MIZHU_MARRIAGE_THRESHOLD &&
    conditions.miZhuPromisedSupport &&
    !conditions.miZhuProposedMarriage
  ) {
    topics.push({
      id: 'mizhu-marriage',
      label: '联姻',
      lines: [
        '糜竺屏退左右，面色郑重道："使君，竺有一事思量已久。舍妹年方二八，知书达礼。竺愿将她许配使君，以结两家之好，共进共退。"',
        '这桩姻缘若成，糜家便与刘备的命运紧紧绑在一处——同舟共济，荣辱与共，再无退路。',
        '刘备思忖再三，终于欣然应允。联姻之事就此议定，糜竺大喜，当即命人备下聘礼，筹办婚仪。',
        '消息传出，糜家上下皆以此结亲为荣。阖族更加坚定了追随使君的决心，连带着家中仆从门客，亦纷纷归心。',
      ],
      conditionChanges: { miZhuProposedMarriage: true },
    });
  }

  /* 效力 — relationship >= 80, marriage proposed, not yet joined */
  if (
    contact.relationship >= MIZHU_JOIN_THRESHOLD &&
    conditions.miZhuProposedMarriage &&
    !conditions.miZhuJoined
  ) {
    topics.push({
      id: 'mizhu-join',
      label: '效力',
      lines: [
        '糜竺整衣正冠，于堂前伏地行大礼，声音微颤却无比坚定："竺愿弃商从戎，以此身毕生追随使君，赴汤蹈火，在所不辞！"',
        '他旋即命人搬出账册，将家中大半资财——金帛、粮秣、甲胄、良马——悉数献出以充军资。一箱箱运入营中的物资，令在场将士无不瞠目。',
        '自此，糜竺不再只是一位慷慨的盟友，而是真正跪拜于刘备帐下的肱股之臣。以商入仕、弃家纾难，此等义举令人动容。',
        '糜竺携全部家资加入后，刘备麾下兵精粮足，声势大振。文有谋臣出谋划策，武有将士枕戈待旦，气象较往日已焕然一新。',
        '徐州上下得知糜竺散尽家财归附刘备，无不为之震动。观望者暗自思忖：连糜子仲都押了全副身家，此人或真乃天命所归。',
      ],
      conditionChanges: { miZhuJoined: true },
      // addFollower + funds bonus applied by component
    });
  }

  return topics;
}

/* ── Chen Deng (陈登) ─────────────────────────────────────── */

function buildChenDengTopics(
  contact: AristocraticContact,
  conditions: LevelConditions,
): DialogueTopic[] {
  const topics: DialogueTopic[] = [];

  /* 寒暄 — always available */
  topics.push({
    id: 'chendeng-greeting',
    label: '寒暄',
    lines: [
      '陈登于堂前以礼相迎，不卑不亢，神态从容。落座之后，他径直与刘备论及徐州当前的政务得失，言辞犀利而条理分明。',
      '陈登面容冷峻，不苟言笑。然而在不动声色的交谈之间，他偶尔微微颔首，目光中竟隐隐流露出对刘备的几分欣赏。',
      '陈登以清茶代酒，于书房中与刘备纵论天下大势、徐州存亡。寥寥数语，鞭辟入里，颇有知己相逢之感。',
    ],
    // relationship +5 applied by component (greeting convention)
  });

  /* 粮草支援 — relationship >= 40, not yet provided */
  if (contact.relationship >= CHENDENG_RATIONS_THRESHOLD && !conditions.chenDengRationsSupport) {
    topics.push({
      id: 'chendeng-rations',
      label: '粮草支援',
      lines: [
        '刘备坦言军中粮草不足的困境——将士食不果腹，难以为继。言辞恳切间，向陈登求援之意溢于言表。',
        '陈登闻言并不立即表态，只端着茶盏沉思片刻，方才微微颔首："此事不难。"遂命家仆从自家粮仓调拨三千石军粮，即刻装车启运。',
        '三千石粮草如久旱甘霖，极大缓解了刘备军中的后勤困窘。将士闻讯，士气为之一振。',
        '陈登淡淡道："区区粮秣，不足挂齿。登只望使君善待徐州百姓——此间山水养育了登，登不愿见其沦为焦土。"',
      ],
      statsDelta: { rations: 3000 },
      conditionChanges: { chenDengRationsSupport: true },
    });
  }

  /* 未来支持 — relationship >= 60, rations already given, not yet promised */
  if (
    contact.relationship >= CHENDENG_SUPPORT_THRESHOLD &&
    conditions.chenDengRationsSupport &&
    !conditions.chenDengPromisedSupport
  ) {
    topics.push({
      id: 'chendeng-support',
      label: '未来支持',
      lines: [
        '陈登忽然压低声音，目光锐利如刀锋，缓缓谈起徐州的未来治理与权力格局——这些话，显然不是对寻常客人说的。',
        '他沉默片刻，终于开口许诺："使君若有朝一日需要登出面斡旋，登愿以在本地的一切人脉与影响力全力相助。此言既出，绝不反悔。"',
        '陈登在徐州士族中根基深厚，号召力犹如一张无形的大网。有了他的支持，刘备在此间施政将少去许多暗中阻碍。',
        '陈登的这番承诺，意味着徐州本地最深根固蒂的一根政治支柱已悄然倒向了刘备。棋局至此，大势渐明。',
      ],
      conditionChanges: { chenDengPromisedSupport: true },
    });
  }

  return topics;
}
