import type { PatrolEventV2 } from '../../../types/level1Types';

/**
 * V2 patrol events — multi-option encounters during 查访民情.
 * 29 events across 11 categories (匪患, 野兽, 疫病, 贤才, 庆典, 商旅, 士族, 纷争, 天灾, 难民/粮草, 军队/金).
 * 10 rare events (with D20 options), 19 common.
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
      '城西官道旁，一行二十余人的蓬头垢面汉子席地而坐，衣甲破旧却自有一股历经沙场的肃杀之气。领头的独眼大汉赵猛上前拱手，道是曾在兖州与曹操鏖战、主公兵败后四散流离的老卒，如今愿投效明主。看他们持刀立步的姿势，手上的茧和眼底的死寂，绝非泛泛之辈。',
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
            '考验严格，去伪存真，收得一批真正的百战老卒，其中竟有数名曾任伍长、什长者，众人皆服使君识人之明，赵猛当场折服拜倒。',
          failureNarrative:
            '考验方式不当，几名真正的精锐心生不满，愤而拂袖离去，只余一批庸碌之辈。赵猛叹了口气，沉默离开，刘备心中颇感懊悔。',
          successStatsDelta: { military: 280, training: 3 },
          failureStatsDelta: { military: 80 },
        },
      },
      {
        id: 'veterans-turn-away',
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
    id: 'patrol-reputation-soldier-theft',
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

  /* ══════════════════════════════════════════════════════════
     BANDIT events (匪患)
     ══════════════════════════════════════════════════════════ */

  {
    id: 'patrol-bandit-village',
    rare: false,
    hintCategory: '匪患',
    narrative: [
      '东乡亭长满头大汗跑来禀报：一伙约莫三四十人的山贼连日劫掠临近村落，昨夜烧毁了张家村的粮仓，今晨又在官道上拦截往来行旅，搜刮财物。村民不敢出门，地里的庄稼无人收割，眼看要烂在田间。周边乡里人心惶惶，都等着刘备拿个主意。',
    ],
    options: [
      {
        id: 'send-troops',
        label: '即刻发兵清剿，将山贼悉数驱散',
        statsDelta: { support: 8, reputation: 5, rations: -1000 },
      },
      {
        id: 'negotiate-surrender',
        label: '先派人传话，许以自首者不追究',
        statsDelta: { support: 5, reputation: 3, gold: -40 },
      },
      {
        id: 'ignore-bandits',
        label: '军务繁重，令乡勇自行组织抵御',
        statsDelta: { support: -8, reputation: -5 },
      },
    ],
  },

  {
    id: 'patrol-bandit-leader',
    rare: true,
    hintCategory: '匪患',
    narrative: [
      '沛县西山密林边缘，斥候带回一名被捕的独眼大汉，自称唤作严峰，本是徐州豫州界上的游侠，黄巾乱时聚了百余条好汉占山为王。他面对刘备毫无惧色，朗声道："某听闻刘使君仁义，若能编入麾下、按军法约束，愿带弟兄归降。若要问斩，也无话可说。"其手下残部约八十人尚藏于山中，皆有一定战力。',
    ],
    options: [
      {
        id: 'recruit-with-test',
        label: '亲自与严峰深谈，判其诚意后决定是否收编',
        statsDelta: {},
        d20Check: {
          difficulty: 12,
          attrKey: 'charisma',
          situation: 'normal',
          modifiers: [],
          successNarrative: '刘备识人有道，三言两语便摸清严峰的底——此人是乱世中逼上梁山的义士，绝非惯犯。一番恳谈后严峰当场拜伏，率众下山，其部众编入军中后秋毫无犯，皆以刘备为主，日后成为可用之兵。',
          failureNarrative: '言谈不投机，严峰面色渐冷，最终冷笑道"使君言过其实"，断然拒绝归降，连夜率部转移，踪迹全无。机会就此错过，将士们也颇觉惋惜。',
          successStatsDelta: { military: 80, training: 3, support: 3 },
          failureStatsDelta: { reputation: -2 },
        },
        companionBonusAttr: 'strength',
      },
      {
        id: 'accept-outright',
        label: '不加细审，直接收编，给粮给械',
        statsDelta: { military: 80, rations: -2000, gold: -60, training: -3 },
      },
      {
        id: 'execute-as-example',
        label: '斩首示众，以儆效尤',
        statsDelta: { reputation: 3, support: -5 },
      },
    ],
  },

  {
    id: 'patrol-bandit-crossroads',
    rare: false,
    hintCategory: '匪患',
    narrative: [
      '城南十里的要道叉口，商旅与百姓聚集成堆，进退两难——一伙二十余人的道匪扼守路口已有三日，过往行人无不被搜刮一空。一名往来于徐兖两州的布商苦着脸道："三日了，货物滞在路上，再拖下去丝绸就臭了。"几名农夫手持锄头试图硬闯，已被打得鼻青脸肿。',
    ],
    options: [
      {
        id: 'charge-clear',
        label: '命骑兵绕道包抄，一举清除',
        statsDelta: { support: 6, reputation: 4, rations: -500 },
      },
      {
        id: 'pay-off',
        label: '出钱买通道匪，令其让路离去',
        statsDelta: { support: 2, gold: -80, reputation: -2 },
      },
      {
        id: 'set-ambush',
        label: '化装成商贩，设伏引匪现身再一网打尽',
        statsDelta: {},
        d20Check: {
          difficulty: 10,
          attrKey: 'intelligence',
          situation: 'normal',
          modifiers: [],
          successNarrative: '伏兵神不知鬼不觉，道匪头目一出面便被擒获，余众作鸟兽散。商旅拍手相庆，刘备此番运筹之妙在周遭广为传颂，声望大涨。',
          failureNarrative: '伏兵暴露，道匪提前逃窜，追而未及，官道虽已畅通，却让这伙人跑了，将来难免再生事端。',
          successStatsDelta: { support: 8, reputation: 6, gold: 60 },
          failureStatsDelta: { support: 3, reputation: 1 },
        },
      },
    ],
  },

  /* ══════════════════════════════════════════════════════════
     BEAST events (野兽)
     ══════════════════════════════════════════════════════════ */

  {
    id: 'patrol-beast-tiger',
    rare: true,
    hintCategory: '野兽',
    narrative: [
      '南郊山脚三个村子的猎户联袂来报：近半月内，一头独行大虎连伤四名农人，其中两人伤重不治，几乎每晚都能听到虎啸，百姓不敢入山打柴，柴火已告急缺。猎户们自发组织了两次围猎皆无功而返，所持弓箭根本伤不到那猛兽半分。老猎户说此虎体型异于寻常，恐非凡物。',
    ],
    options: [
      {
        id: 'hunt-personally',
        label: '亲率精锐猎手入山，以武力猎杀',
        statsDelta: {},
        d20Check: {
          difficulty: 13,
          attrKey: 'strength',
          situation: 'normal',
          modifiers: [],
          successNarrative: '刘备身先士卒深入密林，虎啸声中万籁俱寂。激斗半日，猛虎终被制伏。将士们将虎皮敬献，四乡百姓奔走相告，皆道使君勇猛，民心大振，士气亦随之高涨。',
          failureNarrative: '山中地形不熟，虎性狡猾，数度反扑令队伍大乱，最终猛虎遁入深林。虽未有将士毙命，却也无功而返，百姓不免有所失望。',
          successStatsDelta: { support: 10, reputation: 8, training: 3 },
          failureStatsDelta: { support: -3, rations: -800 },
        },
        companionBonusAttr: 'strength',
      },
      {
        id: 'hire-hunters',
        label: '重金雇请远近闻名的专业猎虎人',
        statsDelta: { support: 5, gold: -100 },
      },
      {
        id: 'build-fence',
        label: '拨木料人手，为三村修建围栏加固防护',
        statsDelta: { support: 4, gold: -60, rations: -500 },
      },
    ],
  },

  {
    id: 'patrol-beast-wolves',
    rare: false,
    hintCategory: '野兽',
    narrative: [
      '北乡牧区，连续数夜有狼群袭击羊圈，已咬死数十头耕牛与羊只，其中有两户人家全部牲口被杀，损失惨重。牧民们眼圈红肿地站在血迹斑斑的羊圈前，那几头牛是他们全部的家当，没了耕牛，来年春耕便无从指望。',
    ],
    options: [
      {
        id: 'night-patrol',
        label: '派士卒分组夜巡牧区，驱赶狼群',
        statsDelta: { support: 6, rations: -600 },
      },
      {
        id: 'compensate-farmers',
        label: '从公库赔偿受损农户，购置新牲口',
        statsDelta: { support: 8, gold: -120 },
      },
      {
        id: 'ignore-wolves',
        label: '此乃自然之事，不宜动用军力',
        statsDelta: { support: -5 },
      },
    ],
  },

  /* ══════════════════════════════════════════════════════════
     PLAGUE events (疫病)
     ══════════════════════════════════════════════════════════ */

  {
    id: 'patrol-plague-fever',
    rare: false,
    hintCategory: '疫病',
    narrative: [
      '军医来报：营中西侧已有十余名士卒接连出现高热、身软无力之症，起初以为是暑热所致，未曾在意——然而三日内病情蔓延至三十余人，其中数人已神志不清，军医面色凝重，低声说这不像是普通中暑。城中坊间也传来消息，百姓里亦有类似病症出现，人心惶惶，有人悄悄迁离。',
    ],
    options: [
      {
        id: 'quarantine-treat',
        label: '立即隔离病患，四处征召医者，发药施治',
        statsDelta: { military: -60, support: 5, gold: -150, rations: -1000 },
      },
      {
        id: 'minimal-response',
        label: '隔离病患，减少接触，等候自愈',
        statsDelta: { military: -150, support: -3 },
      },
      {
        id: 'suppress-news',
        label: '严令封锁消息，避免引发恐慌',
        statsDelta: { military: -200, support: -8, reputation: -5 },
      },
    ],
  },

  {
    id: 'patrol-plague-well',
    rare: true,
    hintCategory: '疫病',
    narrative: [
      '东市附近的老井旁，一名年迈的郎中正向聚拢的百姓解释：近日腹泻呕吐之症在附近数条街巷集中爆发，他追查病源已有三日，判断是一口公用水井遭到污染所致——然而此井乃城中百姓赖以为生的主要水源，若封闭引发恐慌，局面难以收拾；若不封则疫情将持续扩散。郎中望向刘备，等待决断。',
    ],
    options: [
      {
        id: 'close-well-persuade',
        label: '封闭水井，亲自晓谕百姓，承诺另开水源',
        statsDelta: {},
        d20Check: {
          difficulty: 11,
          attrKey: 'charisma',
          situation: 'normal',
          modifiers: [],
          successNarrative: '刘备亲临现场，言辞恳切，将厉害逐一说明，百姓虽心有疑虑，终于信服。水井封闭，疫情很快得到控制。承诺的新水源在三日内疏通，百姓感恩，皆道使君诚信。',
          failureNarrative: '解释不得要领，人群中爆发出怒声——"封了我们吃什么水？"——骚乱几近失控，最终强行封井，留下满城怨言，疫情虽止，民心却伤了。',
          successStatsDelta: { support: 10, reputation: 6, gold: -80 },
          failureStatsDelta: { support: -6, reputation: -4, gold: -80 },
        },
        companionBonusAttr: 'charisma',
      },
      {
        id: 'close-silently',
        label: '悄然封井，不作解释，另行安排替代水源',
        statsDelta: { support: -4, gold: -60 },
      },
      {
        id: 'ignore-well',
        label: '郎中之说尚无定论，暂不封井，继续观察',
        statsDelta: { military: -100, support: -6, reputation: -4 },
      },
    ],
  },

  /* ══════════════════════════════════════════════════════════
     TALENT events (贤才)
     ══════════════════════════════════════════════════════════ */

  {
    id: 'patrol-talent-hermit',
    rare: true,
    hintCategory: '贤才',
    narrative: [
      '东郊桑树林深处，牧童指路说林中住着一位白发老先生，曾在洛阳太学讲学，后来天下大乱便隐居于此。刘备踏入茅舍，见满室竹简，老者正伏案批注，抬起头来目光炯炯，打量刘备良久，缓缓道："老朽于世无用，将军寻访，所为何事？"其神态不卑不亢，一看便知绝非泛泛之辈。',
    ],
    options: [
      {
        id: 'humbly-recruit',
        label: '恳切拜请，诚心说明自己的志向',
        statsDelta: {},
        d20Check: {
          difficulty: 14,
          attrKey: 'charisma',
          situation: 'normal',
          modifiers: [],
          successNarrative: '刘备言辞真诚，毫不矫饰，将自己匡扶汉室的志向娓娓道来。老者沉吟良久，起身整冠，深深一揖："老朽愿以残年，略尽绵力。"其学识深厚，入幕后民政文书大为改善，颇有实效。',
          failureNarrative: '刘备言辞虽诚，却不知如何打动此类隐士之心。老者客气地摇头："老朽老矣，久离庙堂，恐误将军大事。"婉拒之辞温和，却是真心之言，刘备只得悻悻而回。',
          successStatsDelta: { reputation: 8, support: 5 },
          failureStatsDelta: {},
        },
        companionBonusAttr: 'intelligence',
      },
      {
        id: 'gift-and-invite',
        label: '留下厚礼，邀其择日前来，不强求',
        statsDelta: { gold: -80 },
      },
      {
        id: 'pass-by',
        label: '老人年迈，军中奔波恐难适应，就此离去',
        statsDelta: {},
      },
    ],
  },

  {
    id: 'patrol-talent-young-scholar',
    rare: false,
    hintCategory: '贤才',
    narrative: [
      '城中一家小书肆外，几名士子正围着一张张贴的告示指指点点，其中一名不过二十出头的年轻人侃侃而谈，将小沛防务的几处疏漏说得头头是道，旁听的人或点头或皱眉，无一人能反驳。书肆掌柜悄声对刘备说，这年轻人出身贫寒，却博览兵书史籍，曾多次私自测绘城郊地形，是个奇才，可惜一直无人赏识。',
    ],
    options: [
      {
        id: 'invite-to-serve',
        label: '上前攀谈，邀其入幕，先从文吏做起',
        statsDelta: { reputation: 4, support: 3 },
      },
      {
        id: 'test-with-question',
        label: '当场出题，若对答如流再作安排',
        statsDelta: {},
        d20Check: {
          difficulty: 9,
          attrKey: 'intelligence',
          situation: 'normal',
          modifiers: [],
          successNarrative: '刘备随口一问，年轻人应对流利，当场指出城南水门防御之漏洞，并提出补救之策，令刘备刮目相看，当即邀其入幕，众士子无不称羡。',
          failureNarrative: '刘备出的题过于艰深，年轻人答错了一处，气氛略显尴尬。年轻人虽仍受邀入幕，但第一印象打了折扣，此后磨合颇费周折。',
          successStatsDelta: { reputation: 6, training: 2 },
          failureStatsDelta: { reputation: 2 },
        },
      },
      {
        id: 'give-coin-dismiss',
        label: '赏几枚铜钱，鼓励其继续苦读，暂无空缺',
        statsDelta: {},
      },
    ],
  },

  /* ══════════════════════════════════════════════════════════
     CEREMONY events (庆典)
     ══════════════════════════════════════════════════════════ */

  {
    id: 'patrol-ceremony-harvest',
    rare: false,
    hintCategory: '庆典',
    narrative: [
      '出城巡视，但见官道两侧各村张灯结彩，人声鼎沸——原来是一年一度的秋收祭祀庆典，乡民扛着新收的粮食列队前往城外社稷坛，老老少少皆换上新衣。村老见刘备至，满脸喜色，恳请使君亲临主祭，"若能得使君主祭，今年的祭礼定能上达天听，百姓也能安心。"',
    ],
    options: [
      {
        id: 'preside-ceremony',
        label: '慨然应允，亲临主持祭礼，与民同庆',
        statsDelta: { support: 10, reputation: 6 },
      },
      {
        id: 'send-representative',
        label: '派遣将佐代为主祭，另赠祭品',
        statsDelta: { support: 5, gold: -40 },
      },
      {
        id: 'decline-ceremony',
        label: '军务在身，婉言谢绝，祝百姓庆典顺利',
        statsDelta: { support: -2 },
      },
    ],
  },

  /* ══════════════════════════════════════════════════════════
     TRADE events (商旅)
     ══════════════════════════════════════════════════════════ */

  {
    id: 'patrol-trade-silk',
    rare: false,
    hintCategory: '商旅',
    narrative: [
      '城北市集，一支来自扬州的商队满载丝绢、茶叶和铁锅，领头的吴商朱福恭请刘备入座，开门见山：他每季往来徐豫两州，愿意在小沛设立固定交易点，以较低价格向军中供应布匹物资，条件是刘备提供沿途护送以及免税令牌。朱福谈吐精明，但言辞中也透出真诚。',
    ],
    options: [
      {
        id: 'accept-trade-deal',
        label: '签下合约，派兵护送，开设贸易点',
        statsDelta: { gold: 180, support: 5, rations: -500 },
      },
      {
        id: 'negotiate-better',
        label: '还价——要求更优惠的价格再签约',
        statsDelta: {},
        d20Check: {
          difficulty: 10,
          attrKey: 'intelligence',
          situation: 'normal',
          modifiers: [],
          successNarrative: '一番讨价还价，刘备逻辑严密、以货量为筹码，朱福额头微微冒汗，最终额外让出一成折扣，拍手成交。此后这条商路为军中带来稳定收益。',
          failureNarrative: '谈判中刘备态度过于强硬，朱福面子上挂不住，当场翻脸，收拾货物扬言另找门路。虽然最终勉强成交，折扣分毫未让，双方心存芥蒂。',
          successStatsDelta: { gold: 280, support: 5, rations: -500 },
          failureStatsDelta: { gold: 100, support: 2, rations: -500 },
        },
      },
      {
        id: 'reject-trade',
        label: '婉拒，军中秩序不宜引入外商干扰',
        statsDelta: {},
      },
    ],
  },

  {
    id: 'patrol-trade-contraband',
    rare: true,
    hintCategory: '商旅',
    narrative: [
      '夜巡城门时，守门士卒悄声来报：一辆深夜入城的骡车遭盘问时车夫支支吾吾、神色慌乱，被扣押查验，车中藏有百余把未上记录的精铁环首刀，刀刃崭新，毫无使用痕迹——这批兵器足以武装一支小股私兵。车夫见事情败露，低头说出一个本地豪绅的名字，称一切都是奉命行事。',
    ],
    options: [
      {
        id: 'investigate-gentry',
        label: '彻查背后的豪绅，追问兵器来源和用途',
        statsDelta: {},
        d20Check: {
          difficulty: 12,
          attrKey: 'intelligence',
          situation: 'normal',
          modifiers: [],
          successNarrative: '刘备布下眼线，一查到底——幕后之人意图屯兵自保，并无谋反之实。刘备将兵器没收充军，对那豪绅以私藏兵器问罪罚款，此番雷厉风行令本地士族皆心存敬畏。',
          failureNarrative: '调查草率，那豪绅早有准备，证据烟消云散，刘备仅能没收兵器，对方以"货品运输之误"轻描淡写地搪塞过去，暗中对刘备心生怨恨。',
          successStatsDelta: { equipment: 8, reputation: 6, gold: 120 },
          failureStatsDelta: { equipment: 8, support: -4 },
        },
      },
      {
        id: 'confiscate-only',
        label: '没收兵器充军，不深究幕后，放人离去',
        statsDelta: { equipment: 8 },
      },
      {
        id: 'release-all',
        label: '无凭无据，不宜生事，放人放货',
        statsDelta: { support: -3, reputation: -3 },
      },
    ],
  },

  /* ══════════════════════════════════════════════════════════
     ARISTOCRAT events (士族)
     ══════════════════════════════════════════════════════════ */

  {
    id: 'patrol-aristocrat-invitation',
    rare: false,
    hintCategory: '士族',
    narrative: [
      '城中望族陈氏家主陈伯雍遣管家送来精致请柬，邀刘备三日后赴家宴，席间另有数位本地士绅出席。管家神情恭谨地补充说，陈家在小沛置有大量田庄，在本地颇有影响，是乡里的人心所向；此次宴请，既有结交之意，也有借机观察使君风度的意思在内。',
    ],
    options: [
      {
        id: 'attend-feast',
        label: '欣然赴宴，以礼待之，广结士绅人心',
        statsDelta: { support: 6, reputation: 5, gold: -60 },
      },
      {
        id: 'decline-politely',
        label: '以军务繁忙为由婉拒，另日专程登门拜访',
        statsDelta: { reputation: 2 },
      },
      {
        id: 'invite-back',
        label: '回请陈氏来营中，展示军容以示实力',
        statsDelta: { support: 4, reputation: 4, rations: -800 },
      },
    ],
  },

  {
    id: 'patrol-aristocrat-rivalry',
    rare: true,
    hintCategory: '士族',
    narrative: [
      '城东两大豪族——韩氏与徐氏——因一片祖坟旁的百亩林地归属问题，已积怨半年。今日双方各带十余名家丁聚于林边，手持农具刀棒，眼看便要大打出手，地方官吏无力阻拦，慌忙来报。林地纠纷的背后，是两族各自拉拢小沛官员的长期博弈，处置不当将影响整个城中士族的向背。',
    ],
    options: [
      {
        id: 'mediate-families',
        label: '亲自出面调停，以法理情义化解纠纷',
        statsDelta: {},
        d20Check: {
          difficulty: 12,
          attrKey: 'charisma',
          situation: 'normal',
          modifiers: [],
          successNarrative: '刘备临场发挥，援引旧例、动以情理，令双方均觉各得其所。韩、徐两家家主当场握手言和，此后对刘备甚为信服，遇事皆来请教，士族关系因此大为改善。',
          failureNarrative: '调解言辞欠妥，双方皆觉吃了亏，虽没动手，却都拂袖而去，私下抱怨刘备偏袒对方。两家不满之情在士族间悄悄流传，给日后埋下隐患。',
          successStatsDelta: { support: 10, reputation: 8 },
          failureStatsDelta: { support: -5, reputation: -4 },
        },
        companionBonusAttr: 'charisma',
      },
      {
        id: 'rule-by-law',
        label: '依地契原文判决归属，不偏不倚',
        statsDelta: { reputation: 5, support: -2 },
      },
      {
        id: 'split-land',
        label: '强令两家各得一半，不容申辩',
        statsDelta: { support: -4, reputation: -2 },
      },
    ],
  },

  /* ══════════════════════════════════════════════════════════
     DISPUTE events (纷争)
     ══════════════════════════════════════════════════════════ */

  {
    id: 'patrol-dispute-water',
    rare: false,
    hintCategory: '纷争',
    narrative: [
      '睢水支流上游的丰收村与下游的石桥村为争夺灌渠水权，吵了整整一个月，如今矛盾激化——丰收村村民将灌渠主闸锁死，石桥村的稻田已旱得龟裂，村民扛着扁担上门讨要说法，两村长老在刘备面前各执一词、声嘶力竭，四周聚集的百姓越来越多，气氛剑拔弩张。',
    ],
    options: [
      {
        id: 'schedule-rotation',
        label: '制定轮流放水章程，以书面契约为凭',
        statsDelta: { support: 8, reputation: 5 },
      },
      {
        id: 'build-second-channel',
        label: '拨钱拨人另开一条支渠，彻底解决水源之争',
        statsDelta: { support: 12, reputation: 6, gold: -150, rations: -1000 },
      },
      {
        id: 'favor-upstream',
        label: '上游先来后到，下游自行想法',
        statsDelta: { support: -8, reputation: -5 },
      },
    ],
  },

  {
    id: 'patrol-dispute-clan',
    rare: true,
    hintCategory: '纷争',
    narrative: [
      '西乡一处大院外，两支宗族的族人各占一侧，院中停着一口棺材——死者是两族联姻的年轻人，死因不明，双方各执一词：女方家族声称是男方家人蓄意毒杀，男方家族则坚持是旧疾发作。双方族中年轻人已各自磨刀，若刘备不能给出令人信服的裁决，今夜便要大打出手，伤亡难以预料。',
    ],
    options: [
      {
        id: 'investigate-death',
        label: '传唤郎中当场验尸，以证据说话',
        statsDelta: {},
        d20Check: {
          difficulty: 13,
          attrKey: 'intelligence',
          situation: 'normal',
          modifiers: [],
          successNarrative: '刘备主导验尸，郎中指出死者腹部有特定病灶，系旧疾发作——无辜之证据确凿。女方家族悲痛但终于接受真相，刘备公正之名再度得到印证，两族之争就此化解，无一人伤亡。',
          failureNarrative: '验尸结论模糊，双方皆不满意。刘备虽以强硬手段压住了当场冲突，却未能化解积怨，不久后两族仍爆发了小规模械斗，伤了数人，刘备不得不再次介入。',
          successStatsDelta: { support: 10, reputation: 8 },
          failureStatsDelta: { support: -4, reputation: -3 },
        },
      },
      {
        id: 'impose-peace',
        label: '不作深究，令双方各退三十步，以军队强行维持秩序',
        statsDelta: { support: -3, reputation: -2, rations: -500 },
      },
      {
        id: 'compensate-and-close',
        label: '出钱补偿女方家族，换取息事宁人',
        statsDelta: { support: 2, gold: -100 },
      },
    ],
  },

  /* ══════════════════════════════════════════════════════════
     NATURAL DISASTER event (天灾)
     ══════════════════════════════════════════════════════════ */

  {
    id: 'patrol-disaster-flood',
    rare: false,
    hintCategory: '天灾',
    narrative: [
      '连续五日大雨，睢水水位陡涨，沿岸三个村子的田地已被淹去大半，低洼处的农舍进水及膝，老弱被邻里背着转移至高地，牲口拴在树上哀嚎。村老满面愁苦："今年的秋粮多半是保不住了，若使君再不出手，冬日怎么过……"远处还能看见有人在泡水中抢救剩余的粮食。',
    ],
    options: [
      {
        id: 'full-relief',
        label: '全力救灾：出兵筑堤、发放粮草、安置流离百姓',
        statsDelta: { support: 12, reputation: 8, rations: -4000, gold: -120 },
      },
      {
        id: 'flood-partial-aid',
        label: '发放部分粮食，协助转移老弱',
        statsDelta: { support: 6, reputation: 4, rations: -2000 },
      },
      {
        id: 'no-action',
        label: '军中粮草本已紧张，无力大规模救灾',
        statsDelta: { support: -10, reputation: -8 },
      },
    ],
  },
];
