import type { PatrolEventV2 } from '../../../types/level1Types';

/**
 * V2 patrol events — multi-option encounters during 查访民情.
 * 10 events: 2 rations, 2 military, 2 support, 2 gold, 2 morality/mixed.
 * 4 rare (with D20 options), 6 common.
 */
export const PATROL_EVENTS_V2: PatrolEventV2[] = [
  /* ══════════════════════════════════════════════════════════
     RATIONS events
     ══════════════════════════════════════════════════════════ */

  {
    id: 'patrol-rations-refugees',
    rare: false,
    hintCategory: 'rations',
    narrative: [
      '巡至小沛南门外，只见官道两侧聚集着数百衣衫褴褛的流民，老弱妇孺皆有，面色蜡黄，形如枯槁。领头的白发老翁匍匐在地，哽咽道：\u201c曹兵北撤时烧尽了我等村庄，六日不曾进食，恳请将军发善心，赐些余粮。\u201d消息传开，更多流民从四面八方涌来，将官道堵了个水泄不通。',
    ],
    options: [
      {
        id: 'open-granary',
        label: '开仓放粮，赈济所有流民',
        statsDelta: { support: 10, reputation: 5, rations: -6000 },
      },
      {
        id: 'partial-aid',
        label: '仅赈老幼，青壮者劝其自谋出路',
        statsDelta: { support: 3, reputation: 2, rations: -2000 },
      },
      {
        id: 'turn-away',
        label: '令士兵驱散流民，军粮不可轻动',
        statsDelta: { support: -8, reputation: -8 },
      },
    ],
  },

  {
    id: 'patrol-rations-watermill',
    rare: false,
    hintCategory: 'rations',
    narrative: [
      '沿睢水巡视，见河边一座水磨坊已停转月余——曹军北撤时特意凿断了磨轴，毁坏了水轮。附近十余村的百姓苦不堪言，粮食无法碾磨，只能生啃粗粒，老人与孩童尤为受苦。老磨坊主跪在泥中，眼中满是期盼：\u201c将军若肯拨几十人手修缮，周边百姓感恩戴德，来年收成也可补贴军需。\u201d',
    ],
    options: [
      {
        id: 'repair-with-troops',
        label: '拨兵修缮水磨，并调拨木料铁件',
        statsDelta: { support: 10, rations: -1000 },
      },
      {
        id: 'provide-materials',
        label: '拨给工具材料，由村民自行修缮',
        statsDelta: { support: 5, gold: -60 },
      },
      {
        id: 'ignore-mill',
        label: '军务繁重，无暇顾及此等民间琐事',
        statsDelta: { support: -2 },
      },
    ],
  },

  {
    id: 'patrol-rations-hidden-cache',
    rare: true,
    hintCategory: 'rations',
    narrative: [
      '东郊废弃庄园内，一名士兵踩空地面，揭出一个以厚木板封存的巨大地窖——内藏数百石粮食，显是某巨贾仓皇出逃时来不及带走的储粮，陈虽隔年，大部尚可食用。消息刚一传开，便有一名自称庄主之子的年轻人赶到，带着两名见证人，声称此乃祖产，誓要讨个说法。',
    ],
    options: [
      {
        id: 'negotiate',
        label: '晓以乱世大义，与庄主之子协商分粮',
        statsDelta: {},
        d20Check: {
          difficulty: 12,
          attrKey: 'intelligence',
          situation: 'normal',
          modifiers: [],
          successNarrative:
            '言辞恳切，动之以情，晓以乱世存亡之理——庄主之子终被说服，慷慨捐出七成粮食以资军需，留三成自用，握手言和。周遭百姓无不拍手称善，皆道使君处事公允。',
          failureNarrative:
            '谈判陷入僵局，对方据理力争，争执声传遍乡里。最终以薄薄四千石草草了结，庄主之子负气而去，众人皆无满意之色，刘备亦觉颜面有损。',
          successStatsDelta: { rations: 18000, support: 5 },
          failureStatsDelta: { rations: 4000, support: -4 },
        },
      },
      {
        id: 'seize',
        label: '以军事权力全数征用，付以薄酬了事',
        statsDelta: { rations: 24000, support: -10, reputation: -5, gold: -100 },
      },
      {
        id: 'split-evenly',
        label: '不作争论，与庄主之子对半平分',
        statsDelta: { rations: 10000, support: 3 },
      },
    ],
  },

  /* ══════════════════════════════════════════════════════════
     MILITARY events
     ══════════════════════════════════════════════════════════ */

  {
    id: 'patrol-military-deserters',
    rare: false,
    hintCategory: 'military',
    narrative: [
      '三更时分，巡夜队正押来五名被抓获的逃兵——三人是沛县本地人，两人是陶谦拨来的丹阳兵。其中最年轻的不过十七八岁，满脸泪痕，颤抖着说家中老母病危、弟妹嗷嗷待哺，实在放不下心。几名老卒低垂着头，沉默不言；营中数十双眼睛在暗处注视着刘备如何裁断。',
    ],
    options: [
      {
        id: 'show-compassion',
        label: '亲自问话，允诺日后士卒可轮番短期省亲',
        statsDelta: { support: 3 },
      },
      {
        id: 'punish-publicly',
        label: '依军法鞭打示众，以儆效尤',
        statsDelta: { training: 3, support: -3 },
      },
      {
        id: 'release-quietly',
        label: '悄悄放走，以免激化矛盾',
        statsDelta: { military: -150 },
      },
    ],
  },

  {
    id: 'patrol-military-veterans',
    rare: false,
    hintCategory: 'military',
    narrative: [
      '城西官道旁，一行二十余人的蓬头垢面汉子席地而坐，衣甲破旧却自有一股历经沙场的肃杀之气。领头的独眼大汉徐达上前拱手，道是曾在兖州与曹操鏖战、主公兵败后四散流离的老卒，如今愿投效明主。看他们持刀立步的姿势，手上的茧和眼底的死寂，绝非泛泛之辈。',
    ],
    options: [
      {
        id: 'recruit-immediately',
        label: '立即收编，发放军粮军械',
        statsDelta: { military: 200, rations: -2000, gold: -80 },
      },
      {
        id: 'test-first',
        label: '先作甄别考验，再择优收编',
        statsDelta: {},
        d20Check: {
          difficulty: 10,
          attrKey: 'intelligence',
          situation: 'normal',
          modifiers: [],
          successNarrative:
            '考验严格，去伪存真，收得一批真正的百战老卒，其中竟有数名曾任伍长、什长者，众人皆服使君识人之明，徐达当场折服拜倒。',
          failureNarrative:
            '考验方式不当，几名真正的精锐心生不满，愤而拂袖离去，只余一批庸碌之辈。徐达叹了口气，沉默离开，刘备心中颇感懊悔。',
          successStatsDelta: { military: 280, training: 3 },
          failureStatsDelta: { military: 80 },
        },
      },
      {
        id: 'turn-away',
        label: '婉拒——来路不明之人不可轻易收纳',
        statsDelta: { support: -2 },
      },
    ],
  },

  {
    id: 'patrol-military-marsh-weapons',
    rare: true,
    hintCategory: 'military',
    narrative: [
      '南郊芦苇荡中，向导带来惊人消息：黄巾余党溃败时在这片沼泽深处藏匿了大批兵器盔甲，如今已无人把守。然而沼泽险恶，泥淖深不见底，去年陶谦麾下一个百人队便险些困死其中，此事在附近村落至今令人色变。简雍低声提醒：军中器械匮乏，此乃天赐良机，生死之间，取舍全凭使君一念。',
    ],
    options: [
      {
        id: 'force-through',
        label: '亲率精兵强闯沼泽，取回武器',
        statsDelta: {},
        d20Check: {
          difficulty: 11,
          attrKey: 'strength',
          situation: 'normal',
          modifiers: [],
          successNarrative:
            '刘备身先士卒，深一脚浅一脚地率众涉入芦苇深处。将士奋力，历经艰险，终将兵器甲胄悉数搬运出来，士气因此大振，皆言使君勇毅，不让武将之先。',
          failureNarrative:
            '沼泽远比想象中险恶，多名士卒深陷泥淖，折腾半日损兵折将，仅取回少量残破器械。众人垂头丧气而返，营中连日士气低迷。',
          successStatsDelta: { equipment: 12, training: 5 },
          failureStatsDelta: { equipment: 3, military: -80 },
        },
        companionBonusAttr: 'strength',
      },
      {
        id: 'hire-guides',
        label: '高价雇用熟悉地形的当地渔户引路',
        statsDelta: { equipment: 8, gold: -120 },
      },
      {
        id: 'leave-cache',
        label: '沼泽险地，兵器再好也不值折损将士',
        statsDelta: {},
      },
    ],
  },

  /* ══════════════════════════════════════════════════════════
     SUPPORT events
     ══════════════════════════════════════════════════════════ */

  {
    id: 'patrol-support-widow',
    rare: false,
    hintCategory: 'support',
    narrative: [
      '营门外，一名年轻寡妇抱着尚在哺乳的婴儿跪在尘土中，身旁两个稍大的孩子紧拽她的衣角，俱是面黄肌瘦、眼神空洞。她轻声说，丈夫是陶谦麾下的伍长，在第二次抵御曹军时战死沙场——刘备认出了她丈夫那件残破军服上的徽记。几名老兵在旁围观，悄悄别过了头，无人作声。',
    ],
    options: [
      {
        id: 'take-in',
        label: '收其家入营区庇护，拨粮供养，为故人尽责',
        statsDelta: { support: 8, reputation: 5, rations: -800 },
      },
      {
        id: 'give-gold',
        label: '从私库取出钱财，解其一时之困',
        statsDelta: { support: 5, reputation: 3, gold: -60 },
      },
      {
        id: 'refer-away',
        label: '告知其可向县署申领阵亡抚恤，军中无余力照管',
        statsDelta: { support: -3, reputation: -3 },
      },
    ],
  },

  {
    id: 'patrol-support-landlord',
    rare: false,
    hintCategory: 'support',
    narrative: [
      '北乡村口，一群持农具的佃农将豪绅高巍的管家团团围住，嘈声四起。高巍趁战乱之机伪造地契，吞并了十余户逃难百姓留下的田亩，如今更要向留守的佃农追缴\u201c积年欠租\u201d。一名佃农将状纸颤抖着塞入刘备手中，字迹上满是泥水，却字字泣血。',
    ],
    options: [
      {
        id: 'confront-landlord',
        label: '传召高巍，当众宣判其地契无效，归还土地',
        statsDelta: { support: 12, reputation: 5, gold: -100 },
      },
      {
        id: 'compromise',
        label: '从中斡旋，令高巍减租三成，佃农补缴部分',
        statsDelta: { support: 5, gold: -40 },
      },
      {
        id: 'side-with-landlord',
        label: '高巍是本地豪绅，财力雄厚，此时得罪不起',
        statsDelta: { support: -10, reputation: -8, gold: 200 },
      },
    ],
  },

  /* ══════════════════════════════════════════════════════════
     GOLD events
     ══════════════════════════════════════════════════════════ */

  {
    id: 'patrol-gold-merchant-escort',
    rare: false,
    hintCategory: 'gold',
    narrative: [
      '城南官道叉路口，一支来自彭城的商队缓缓停下，领头的缎布商段员外下马施礼，说欲将丝绢漆器运往广陵，愿出资请军队护送以防劫道。然而段员外言谈间眼神闪烁，车队中几辆遮盖严实的大车轮毂压得异常沉重——装的未必只是布匹。',
    ],
    options: [
      {
        id: 'accept-escort',
        label: '按其开价接受护卫合同，如约行事',
        statsDelta: { gold: 150, rations: -500 },
      },
      {
        id: 'inspect-and-renegotiate',
        label: '仔细审视货物，以实情为筹码重新谈判',
        statsDelta: {},
        d20Check: {
          difficulty: 11,
          attrKey: 'intelligence',
          situation: 'normal',
          modifiers: [],
          successNarrative:
            '刘备一眼看出车轮沉重有异，当众掀开一角布帘，现出藏于丝绢中的金珠。段员外哑口无言，只得就高价成交，临行时苦笑摇头，心服口服。',
          failureNarrative:
            '盘问之下，段员外勃然大怒，斥以刁难，扬言另寻他人护送，将士在旁颇觉难堪；最终以最低价草草成交，临行还留下一句难听的话。',
          successStatsDelta: { gold: 380, rations: -500 },
          failureStatsDelta: { gold: 80, rations: -500 },
        },
      },
      {
        id: 'levy-tax',
        label: '收取\u201c过境税\u201d，不派护卫',
        statsDelta: { gold: 200, support: -5, reputation: -3 },
      },
    ],
  },

  {
    id: 'patrol-gold-corrupt-official',
    rare: false,
    hintCategory: 'gold',
    narrative: [
      '小沛市集，嘈杂的叫卖声中突然爆发出哭喊——一名皂衣官吏率十余名皂役，以\u201c欠税\u201d为名将摊贩货物悉数装车，连一名哺乳母亲的布摊也未放过。摊贩叫冤\u201c上月刚交过了！\u201d官吏不为所动，皮鞭劈头盖脸打下来；四周百姓敢怒不敢言，百双眼睛全望着刘备。',
    ],
    options: [
      {
        id: 'arrest-and-investigate',
        label: '即刻扣押官吏，彻查账目，追缴贪墨之财',
        statsDelta: { support: 10, reputation: 8, gold: 120 },
      },
      {
        id: 'rebuke-and-release',
        label: '当众喝斥，令其归还今日所收，放其离去',
        statsDelta: { support: 5, reputation: 4 },
      },
      {
        id: 'turn-blind-eye',
        label: '此乃朝廷税务，不宜干涉',
        statsDelta: { support: -6, reputation: -5 },
      },
    ],
  },

  /* ══════════════════════════════════════════════════════════
     MORALITY / MIXED events (rare, with D20)
     ══════════════════════════════════════════════════════════ */

  {
    id: 'patrol-morality-soldier-theft',
    rare: false,
    hintCategory: 'support',
    narrative: [
      '军中把总来报：士卒魏冲昨夜潜入东乡农户家中，窃取米粮并殴伤主人，苦主当面指认、证据确凿，魏冲垂头跪在泥中，一言不发。营中将士都知道，魏冲两月前曾在一场遭遇战中以一敌三、救下三名同袍——然而四周百姓正注视着使君如何裁断。',
    ],
    options: [
      {
        id: 'execute',
        label: '斩首示众，军纪不可徇私枉法',
        statsDelta: { reputation: 10, training: 3, support: 5 },
      },
      {
        id: 'flog-and-repay',
        label: '杖四十，令其以月俸赔偿苦主，戴罪立功',
        statsDelta: { reputation: 5, training: 2, support: 3 },
      },
      {
        id: 'judge-character',
        label: '亲自审问，判断此人是否真心悔改',
        statsDelta: {},
        d20Check: {
          difficulty: 10,
          attrKey: 'intelligence',
          situation: 'normal',
          modifiers: [],
          successNarrative:
            '刘备看人极准，察出魏冲是饥寒交迫下的一时失足，并非惯犯。一番严词训诫后，魏冲羞愧至极，此后效死力战、秋毫无犯，终成军中悍将，常以此事自警。',
          failureNarrative:
            '宽容反被纵容——魏冲本性难移，一月后再度滋事，此番丑闻在周遭村落广为流传，令刘备颜面尽失，苦苦经营的仁义之名为之蒙尘。',
          successStatsDelta: { reputation: 3, training: 5 },
          failureStatsDelta: { reputation: -6, support: -5 },
        },
      },
    ],
  },

  {
    id: 'patrol-gold-luoyang-cache',
    rare: true,
    hintCategory: 'gold',
    narrative: [
      '一名白发苍苍的老儒生跪于营门外，自称昔日洛阳太常府属吏。董卓焚京前夕，他与同僚将数十件汉室礼器、先帝赏赐的金饼玉璧秘密埋入城西一处废弃祠堂之下；同僚皆已殁于战乱，唯他辗转逃至徐州。老人颤声道：\u201c礼器当归复汉室，然金饼若能助将军护一方安宁，老朽死而无憾。\u201d',
    ],
    options: [
      {
        id: 'accept-mission',
        label: '答应老儒条件，秘密派遣心腹前往取回',
        statsDelta: {},
        d20Check: {
          difficulty: 13,
          attrKey: 'intelligence',
          situation: 'normal',
          modifiers: [],
          successNarrative:
            '行事周密，心腹悄然取回礼器与金饼，分毫不差。此举传入士林，天下仁人志士皆道刘使君忠于汉室、言而有信，远近慕名来投者络绎不绝，老儒生含泪拜谢而去。',
          failureNarrative:
            '消息不胫而走，当地豪强抢先一步掘开了祠堂，大半宝藏化为乌有。使君劳师动众、所得寥寥，老儒生坐地痛哭，随行将士皆面露愤懑之色。',
          successStatsDelta: { gold: 500, reputation: 7, support: 5 },
          failureStatsDelta: { gold: 80, rations: -2000 },
        },
      },
      {
        id: 'keep-everything',
        label: '表面应允，实则据礼器与金饼一并充入军资',
        statsDelta: { gold: 400, reputation: -15, support: -5 },
      },
      {
        id: 'decline',
        label: '婉拒——路途遥远，时机未到，非当务之急',
        statsDelta: {},
      },
    ],
  },
];
