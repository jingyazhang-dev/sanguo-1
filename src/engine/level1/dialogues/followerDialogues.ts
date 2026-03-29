import type {
  DialogueTopic,
  LevelConditions,
  GameStats,
  RandomEventId,
} from '../../../types/level1Types';
import { getHint } from './msGanHints';
import { MS_GAN_ID } from '../constants';

/* ────────────────────────────────────────────────────────────
 * Dialogue pools — one function per character
 * ──────────────────────────────────────────────────────────── */

/* ── Guan Yu 关羽 ─────────────────────────────────────────── */

function guanyuTopics(): DialogueTopic[] {
  return [
    {
      id: 'guanyu-training',
      label: '练兵',
      lines: [
        '关羽立于校场边，捋髯远望操练的士卒，沉声道："兵不在多而在精。平日操练得当，临阵方能从容不迫，不至于阵脚自乱。"',
        '关羽按刀正色道："练兵之要，在于令行禁止。三军若能如臂使指、令出即行，何愁不胜？"',
        '关羽凝视远处挥汗如雨的兵卒，缓缓道："训练之苦，远不及沙场丧命之痛。今日多流一滴汗，明日便少流一滴血——切不可懈怠。"',
        '关羽抚着青龙偃月刀的刀背，微微颔首："某今日亲授了几套刀法于士卒，虽是粗浅招式，假以时日勤加磨砺，必成可用之兵。"',
      ],
      statsDelta: {},
    },
    {
      id: 'guanyu-loyalty',
      label: '忠义',
      lines: [
        '关羽拱手，目光如炬："某与兄长桃园结义，对天盟誓，生死相随。此志纵白首亦不渝。"',
        '关羽抬眸望向远方，神色坚毅如铁："忠义二字，重于泰山。某此生但求不负兄长之托，不负桃园之盟。"',
        '关羽长叹一声，丹凤眼中闪过一抹寒光："世间背信弃义之辈何其多也，某不屑与之为伍。唯愿一身正气，无愧天地。"',
      ],
    },
    {
      id: 'guanyu-war',
      label: '战事',
      lines: [
        '关羽微阖双目，仿佛又回到了那烽烟滚滚的岁月："当年讨伐黄巾，某温酒斩华雄之事……那碗酒端起时尚温，放下时头颅已落。恍如昨日。"',
        '关羽目光一凛，语气沉稳如山："沙场之上，最忌犹豫不决。机会稍纵即逝，当断则断，方为大将之风。"',
        '关羽轻叹，声中似有金戈余响："虎牢关前，某与翼德合力战那吕布，百余合不分胜负……那一战当真是凶险万分。"',
        '关羽沉吟片刻，手指轻叩刀柄："兵者，诡道也。一味逞匹夫之勇，终非善策。须审时度势，方能立于不败之地。"',
      ],
    },
  ];
}

/* ── Zhang Fei 张飞 ───────────────────────────────────────── */

function zhangfeiTopics(): DialogueTopic[] {
  return [
    {
      id: 'zhangfei-drink',
      label: '饮酒',
      lines: [
        '张飞一脚踢开营帐帘子，手里拎着酒坛子，大笑道："大哥！来饮一碗！行军打仗的，不喝口烈酒哪来的劲头！"',
        '张飞使劲拍了拍怀中的酒坛子，发出咚咚闷响："嘿！今日操练甚好，弟兄们都卖了力气——当浮一大白！"',
        '张飞端起粗碗仰头一饮而尽，酒液顺着胡须淌下，浑然不觉："痛快！人生在世不称意，不如饮酒尽余欢！"',
      ],
      statsDelta: {},
    },
    {
      id: 'zhangfei-brotherhood',
      label: '兄弟情',
      lines: [
        '张飞收了嬉笑神色，难得认真道："大哥，俺老张这辈子就认你跟二哥。刀山火海，翼德绝不皱一下眉头！"',
        '张飞挠了挠头，咧嘴憨笑："大哥莫要忧虑那么多嘛！有俺和二哥在，哪个不长眼的敢来欺负咱们？"',
        '张飞猛地一拍胸膛，震得铠甲直响："桃园那一拜，生死与共！大哥但有差遣，翼德纵万死亦不辞！"',
        '张飞忽然收了大嗓门，低声感慨道："这些年跟着大哥东奔西走，吃了不少苦头……可俺心里高兴。兄弟齐心，其利断金！"',
      ],
    },
    {
      id: 'zhangfei-spar',
      label: '练武',
      lines: [
        '张飞抄起丈八蛇矛，矛尖在空中划出一道寒芒，大喝道："大哥！来过两招！俺最近琢磨出几式新招，正没处使呢！"',
        '张飞一矛收势，稳稳立于场中，大口喘着粗气笑道："好！大哥身手又见长进了！多练多练，总归是好的！"',
        '张飞将蛇矛往地上一杵，仰天大笑："痛快！这一场练得俺浑身舒坦！大哥的双股剑法越发精妙，连俺都差点接不住！"',
      ],
      attrsDelta: { strength: 1 },
    },
  ];
}

/* ── Jian Yong 简雍 ───────────────────────────────────────── */

function jianyongTopics(
  conditions: LevelConditions,
): DialogueTopic[] {
  const topics: DialogueTopic[] = [
    {
      id: 'jianyong-current',
      label: '世事',
      lines: conditions.triedVisitFailed
        ? [
            '简雍摇着羽扇，笑意不达眼底："主公，世事难料啊。不过嘛……有些门路，生人是叩不开的，总需旁人引荐才走得通。"',
            '简雍将羽扇一合，轻点掌心道："拜访名士一事，讲究的是一个「引」字。主公不妨先在身边人中打听打听，或许便有门路。"',
            '简雍捋了捋短须，悠然道："主公，直接登门拜访么……有时难免碰壁。不如先寻一位旧识牵线搭桥，此为上策。"',
          ]
        : [
            '简雍摇着羽扇踱进帐来，拱手笑道："主公，天下大乱，各路豪杰皆在寻觅明主。小沛虽是弹丸之地，未必不能做出一番文章来。"',
            '简雍半倚在案旁，展扇轻摇："听闻徐州一带名士颇多，若能结交一二，于主公大业必有裨益。不妨寻机登门拜访。"',
            '简雍收扇轻叹，目光望向帐外："当今之世，想要站稳脚跟，光凭一腔热血和几千人马是不够的。还需广结善缘，以文德服人心。"',
          ],
    },
    {
      id: 'jianyong-strategy',
      label: '谋略',
      lines: [
        '简雍正色敛扇，拱手进言："主公，小沛地狭民少，急切间难以扩张。当务之急是以仁政收拢民心，使百姓归附，再徐图发展。"',
        '简雍以扇尖在案上虚画山川之势："为今之计，当广积粮、缓称王。根基不稳便急于求成，无异于沙上筑塔，风来即倾。"',
        '简雍展颜一笑，扇下生风："主公仁德之名已渐传于四方，此乃无形之利，胜过千军万马。善加利用，可收天下之心。"',
        '简雍左手持扇轻敲右掌，从容道："外交与内政并重，方为上策。结交豪族以壮声势，稳固后方以安民心——二者不可偏废。"',
      ],
    },
    {
      id: 'jianyong-kongrong',
      label: '孔融',
      available: (cond) =>
        cond.triedVisitFailed === true && !cond.kongRongUnlocked,
      lines: [
        '简雍忽地收扇，凑近几步压低声音道："主公，说起名士，雍想起一人——北海孔融孔文举。此人乃孔子二十世孙，在士林中声望极隆。若得其引荐，徐州名士之门便可为主公洞开。雍与他有数面之缘，可代为修书。"',
        '简雍一拍额头，似是恍然想起："对了！主公可还记得北海孔融？其人好贤礼士，名满天下，士人莫不以得其一赞为荣。雍可修书一封为主公引荐——有孔文举一言，胜过登门百次！"',
        '简雍沉吟片刻，眸中精光一闪："主公若想叩开徐州贤达之门，雍倒有一计。北海孔融与雍有旧交，此人在士林中一言九鼎，品评天下无人不服。若得其认可，主公声名必然大振。"',
      ],
      conditionChanges: { kongRongUnlocked: true },
    },
  ];

  return topics;
}

/* ── Sun Qian 孙乾 ────────────────────────────────────────── */

function sunqianTopics(
  _conditions: LevelConditions,
): DialogueTopic[] {
  const topics: DialogueTopic[] = [
    {
      id: 'sunqian-rations',
      label: '粮草',
      lines: [
        '孙乾翻开案上厚厚的账簿，眉间隐有忧色："主公，目前粮草尚可支撑时日，但若不及早筹谋补充，恐入秋后便有断粮之虞。"',
        '孙乾拱手忧然道："古人言兵马未动、粮草先行，诚非虚语。主公当留意征粮之事，万不可等到仓廪见底才急。"',
        '孙乾将账簿合上，条理分明地禀道："乾已逐项清点库存，按目前人马消耗推算，尚需未雨绸缪。征粮、贸易、屯田，都是补给之法，宜早不宜迟。"',
        '孙乾轻声提醒道："主公，军中粮草关乎将士性命与士气。仓中有粮、心中不慌——若能充裕储备，将士自然安心效命。"',
      ],
    },
    {
      id: 'sunqian-diplomacy',
      label: '外交',
      lines: [
        '孙乾拱手道："主公，外交之道在于以诚待人、以信立身。名声越好，四方豪杰来附便越容易。此所谓桃李不言、下自成蹊。"',
        '孙乾沉声建议道："主公可多与当地豪族往来走动，结交可靠盟友。太平时互通有无，危难时互为犄角——此乃立足之本。"',
        '孙乾沉吟良久，方才开口："徐州一带，世家大族盘根错节，势力犬牙交错。主公若能取得其中一二家族的信任与支持，根基便稳固了许多。"',
      ],
    },
    {
      id: 'sunqian-kongrong',
      label: '孔融',
      available: (cond) =>
        cond.triedVisitFailed === true && !cond.kongRongUnlocked,
      lines: [
        '孙乾忽然抬头，似是想起要事："主公，乾想起一事。北海孔融孔文举，乃当世大儒，声望极隆，士人以能得其一见为荣。乾与其有些书信往来，若主公有意，乾可代为引荐。有孔文举背书，拜访名士之路便畅通无阻了。"',
        '孙乾拱手进言，语气恳切："主公欲结交徐州名士，乾有一策。乾识得北海孔融，此人好客重义，尤喜拔擢后进。若得其一封荐书，徐州士人必然对主公刮目相看。"',
        '孙乾眸中一亮，似有所悟："主公，说到引荐之事，乾倒想到一人——北海孔融。此人在士林中德高望重，一言可抵千金。乾愿为主公牵此线搭此桥。"',
      ],
      conditionChanges: { kongRongUnlocked: true },
    },
  ];

  return topics;
}

/* ── Ms. Gan 甘夫人 ───────────────────────────────────────── */

function msganTopics(seededPatrolEvent: RandomEventId | null): DialogueTopic[] {
  const hintLine = getHint(seededPatrolEvent);

  return [
    {
      id: 'msgan-folk',
      label: '民间',
      lines: [hintLine],
    },
    {
      id: 'msgan-comfort',
      label: '安慰',
      lines: [
        '甘夫人挑灯缝补战袍，闻声抬头，柔声道："夫君日夜操劳，妾身甚是心疼。万事且宽心，徐徐图之便好——路虽远，行则将至。"',
        '甘夫人放下手中针线，盈盈浅笑："夫君胸中之志，妾身虽是妇道人家，却也深知一二。前路纵有千难万险，有夫君在，妾心便安。"',
        '甘夫人温言宽慰，声若春风拂柳："夫君不必太过焦虑，一步一步来便是。天道酬勤，苍天必不负有心之人。"',
      ],
      attrsDelta: { charisma: 1 },
    },
    {
      id: 'msgan-gossip',
      label: '闲谈',
      lines: [
        '甘夫人抿嘴一笑，眉眼弯弯："今日集市上新到了一批蜀锦，花色甚是好看，妾身多看了两眼。可惜……如今还是省着些好。"',
        '甘夫人将一碟小菜端上桌来，随口道："隔壁张大娘今日又来串门了，说了好些街坊趣事。小沛虽是小城，人情味儿倒是足得很呢。"',
        '甘夫人一面理着灶台上的菜蔬，一面絮絮道："今日试了一道新菜式，用了些本地的时令菜蔬，味道竟还不错。夫君回头定要尝尝。"',
        '甘夫人手中针线微微一顿，轻轻叹了口气："妾身有时想起涿郡老家，想那故园的老槐树是否还在……不知父老乡亲们可都安好。"',
      ],
    },
  ];
}

/* ────────────────────────────────────────────────────────────
 * Public API
 * ──────────────────────────────────────────────────────────── */

/**
 * Returns the list of dialogue topics available for a given character.
 * Topics with an `available` guard are filtered based on current game state.
 */
export function getTopicsForCharacter(
  characterId: string,
  conditions: LevelConditions,
  stats: GameStats,
  round: number,
  seededPatrolEvent?: RandomEventId | null,
): DialogueTopic[] {
  let topics: DialogueTopic[];

  switch (characterId) {
    case 'guanyu':
      topics = guanyuTopics();
      break;
    case 'zhangfei':
      topics = zhangfeiTopics();
      break;
    case 'jianyong':
      topics = jianyongTopics(conditions);
      break;
    case 'sunqian':
      topics = sunqianTopics(conditions);
      break;
    case MS_GAN_ID:
      topics = msganTopics(seededPatrolEvent ?? null);
      break;
    default:
      return [];
  }

  // Filter out topics whose preconditions are not met
  return topics.filter(
    (t) => !t.available || t.available(conditions, stats, round),
  );
}
