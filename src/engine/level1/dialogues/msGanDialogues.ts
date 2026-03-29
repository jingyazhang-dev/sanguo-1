import type {
  ChatTopic,
  GameStats,
  LevelConditions,
} from '../../../types/level1Types';

/**
 * Ms Gan (甘夫人) chat topics — 2× volume of standard followers.
 * She is Liu Bei's wife, gentle, perceptive, and wise.
 * She observes the household and troops from a domestic angle.
 *
 * - scripted: consumed permanently, with D20/choices
 * - narrative: consumed permanently, atmospheric backstory
 * - situational: reset per round, triggered by conditions
 */
export const MS_GAN_CHAT_TOPICS: ChatTopic[] = [
  // ── Scripted (6, consumed permanently) ──
  {
    id: 'msgan-t1-dream',
    kind: 'scripted',
    label: '白鹤入梦',
    narrative: [
      '甘夫人起身相迎，面有忧色，轻声道：\'夫君，妾身昨夜梦见一件奇事，一时拿不定是吉是凶——梦中见一白鹤自北方飞来，落于营中，鸣叫三声，随后扶摇直上，往南而去。妾身不知此梦何意，心中有些惦念，想请夫君一说。\'烛火轻摇，她的眼神里有几分真实的不安。',
    ],
    choices: [
      {
        id: 'msgan-dream-auspicious',
        label: '此乃吉兆，白鹤南去，前路开阔',
        responseLines: ['甘夫人听罢，眉眼渐渐舒展，低声道：\'夫君如此说，妾身便放心了。\'她停顿一瞬，又轻声补充：\'夫君说话时，那股子安定的气势，才是妾身最踏实的倚仗——比什么梦兆都管用。\'烛光里，她的眼神明亮而平静，像水面映出的星。'],
        statsDelta: { reputation: 3 },
      },
      {
        id: 'msgan-dream-cautious',
        label: '梦兆难测，当谨慎行事，以防不虞',
        responseLines: ['甘夫人轻轻点头，道：\'夫君谨慎，是极好的。\'她随手将一块绣绷搁在膝上，神色平静，\'妾身也这般觉得——这乱世里，多备一分，少一分担忧。夫君好好准备，妾身在家中做好妾身该做的事。\'言语虽简，却如水般沁人心脾，让人不由得觉得脚下踏实了几分。'],
        statsDelta: { training: 2, equipment: 1 },
      },
    ],
  },
  {
    id: 'msgan-t1-needlework',
    kind: 'scripted',
    label: '针线闲话',
    narrative: [
      '甘夫人正低头绣一块锦帕，抬眼见你进来，便搁下针线，微笑道：\'夫君来了，快坐——妾身这儿正绣着，想着一件事，不知当不当说……\'她略顿，指着绣了一半的花样，\'这朵花，妾身已经起了三遍针线，总是绣歪了一点——后来妾身想明白了，不是手拙，而是心里太在意，反而乱了。夫君……是不是有时也这样？\'',
    ],
    choices: [
      {
        id: 'msgan-needlework-agree',
        label: '有道理，有时放开反而更顺',
        responseLines: ['甘夫人眸中透出一抹喜色，道：\'夫君懂的。\'她重新拈起针线，这一针刺下去，端端正正，她轻声笑道：\'你看——\'那一朵花，悄悄绣正了半分。室内安静，只有针线轻轻划过绢帛的声音，叫人心下一松。'],
        statsDelta: {},
        attrsDelta: { charisma: 1 },
      },
      {
        id: 'msgan-needlework-disagree',
        label: '治军不同于针线，须得时时用心',
        responseLines: ['甘夫人抿嘴一笑，道：\'夫君说得也是。妾身只是随口一说，夫君莫见笑。\'她低下头继续绣花，过了一会儿才轻声道：\'只是……偶尔也要给自己留一口气，才走得长远。这话，妾身留着，等夫君哪日真的累了，再来说。\''],
        statsDelta: { reputation: 3 },
      },
    ],
  },
  {
    id: 'msgan-t1-candlelight',
    kind: 'scripted',
    label: '灯下心语',
    narrative: [
      '夜深人静，甘夫人将灯剪去一截烛芯，让火焰更稳一些，低声问道：\'夫君，妾身有个问题，想了许久了——夫君奔走这么多年，经历了那么多风雨，可曾有过动摇之时？妾身并非要夫君回答什么，只是……想听夫君说说心里话。\'她的目光温柔，没有审视，只有等候。',
    ],
    choices: [
      {
        id: 'msgan-candlelight-honest',
        label: '坦然承认，确曾疑惑，然终究坚定',
        responseLines: ['甘夫人听完，沉默片刻，轻声道：\'夫君肯说这些，妾身很高兴。\'她执起灯台，光亮柔和地映在两人的脸上，\'能承认过动摇，才是真的坚定——那些从未动摇过的人，妾身倒不怎么信他们。\'她将灯放回原处，神情里是真心的笃定。'],
        statsDelta: { reputation: 5 },
        attrsDelta: { charisma: 1 },
      },
      {
        id: 'msgan-candlelight-resolute',
        label: '从未动摇，此志始终如一',
        responseLines: ['甘夫人轻轻笑了，眼中带了几分意味深长，道：\'夫君……\'她顿了顿，没有把话说完，只是侧过脸，望着灯火，\'妾身信夫君。\'停了停，她将一件外衫叠好搁在一旁，\'夜深了，夫君早些歇息吧——明日的事，明日再说。\'那轻轻的笑意，藏着几分只有她自己懂的温柔。'],
        statsDelta: { reputation: 2 },
      },
    ],
  },
  {
    id: 'msgan-scripted-chess',
    kind: 'scripted',
    label: '夫妇对弈',
    narrative: [
      '甘夫人摆好一副棋局，轻声道：‘夫君，妾身向夫君讨一局棋——倒不是争输赢，是妾身想看看，夫君落子时的模样。’她执白子，望着你，‘妾身觉得，一个人下棋的样子，跟做事的样子是一样的。夫君先走？’',
    ],
    choices: [
      {
        id: 'msgan-chess-aggressive',
        label: '先攻中路，抢占先机',
        responseLines: ['甘夫人看着棋盘，轻轻点头道：‘夫君好魄力——先发制人，不给人喘息之机。’她从容应对，几手之后微笑道：‘不过妾身发现，夫君进攻时有时顾不上后方——这倒也不全是坏事，只要身边有人替你守着。’她落下一子，‘比如妾身。’'],
        statsDelta: { reputation: 2 },
      },
      {
        id: 'msgan-chess-steady',
        label: '四角稳固，步步为营',
        responseLines: ['甘夫人端详棋盘片刻，轻声道：‘夫君果然稳健——四角先定，中路再图。妾身见过不少人下棋，急着在中间大杀大砍，结果四角空虚，一塌便倒。’她搁下棋子，‘夫君这样的棋风，妾身安心。’'],
        statsDelta: { support: 3, reputation: 3 },
      },
    ],
  },
  {
    id: 'msgan-scripted-dependents',
    kind: 'scripted',
    label: '营中妇孺',
    narrative: [
      '甘夫人面有忧色，低声道：‘夫君，妾身想说一件事——营中随军的妇人们，这些日子有些不安，几个年长的来找妾身倒苦水。她们的丈夫在军中操练，自己在营后做饭缝衣，吃穿虽有，却不知明日如何。夫君……是否能抽出些许心思，安抚一下她们？’',
    ],
    choices: [
      {
        id: 'msgan-dependents-help',
        label: '派人安排，改善妇孺口粮与住处',
        responseLines: ['甘夫人展颜道：‘妾身替她们谢过夫君。’她起身，将一份名册递来，‘妾身已将营中妇孺人数清点了一遍——夫君若要安排，按此名册行事便是，妾身也会帮着照料。’她的眼神里透着一丝欣慰，‘兵安其家，方能安其心——妾身总觉得，这些看不见的事，才是最重要的。’'],
        statsDelta: { support: 3, rations: -100 },
      },
      {
        id: 'msgan-dependents-defer',
        label: '暂且维持现状，待军资宽裕再议',
        responseLines: ['甘夫人沉默片刻，轻轻点头道：‘妾身明白——夫君也有夫君的难处。’她将名册收好，‘妾身先去安抚她们，告诉她们夫君心里记挂着——有些话，就算不能马上做到，说了也比不说强。’她转过身，那背影里有几分落寞，但步伐依然沉稳。'],
        statsDelta: {},
      },
    ],
  },
  {
    id: 'msgan-scripted-mending',
    kind: 'scripted',
    label: '旧衫新补',
    narrative: [
      '甘夫人拈着针线，就着灯光缝补一件旧衫——那是你常穿的外袍，袖口已磨出了白线。她抬头见你进来，微笑道：‘夫君，这件衫妾身补了第三回了——妾身不是舍不得换新的，是觉得……这衫陪夫君走了这么远，有些东西旧了反而踏实。’她顿了顿，语气轻柔却认真：‘夫君觉得，人心也是这样么？’',
      '甘夫人目光温柔而专注，似在等一个不同寻常的答案。灯火照在她手中的旧衫上，那些缝过的针脚细密如心事。',
    ],
    d20Check: {
      difficulty: 10,
      situation: 'normal',
      attrKey: 'intelligence',
      modifiers: [],
      successNarrative: '你沉吟片刻，道出一番关于新旧之辨的话。甘夫人听罢，放下针线，目光明亮道：‘夫君所言甚妙——旧物可补，人心可磨，只要那根线还在，便散不了。’她低头续了一针，嘴角含笑，那笑容里是真心的佩服。',
      failureNarrative: '你支吾半晌，未能说出什么妙语。甘夫人轻轻一笑，并不在意，低头道：‘没关系，妾身自己也说不清楚——只是一种感觉。’她继续缝补，指尖沉稳如常，‘夫君只管忙正事，这些小念头，妾身自己想想便好。’',
      successStatsDelta: { reputation: 3 },
    },
  },
  // ── Narrative (10, consumed permanently) ──
  {
    id: 'msgan-t2-pei-memories',
    kind: 'narrative',
    label: '沛县往事',
    narrative: [
      '甘夫人望向窗外，轻声道：\'夫君，妾身幼时在沛县长大，记得那时街上有一家卖汤饼的老翁，每日清早支起炉子，香气传出很远——妾身总爱缠着母亲绕过去……\'',
      '\'后来乱世起了，那一条街不知何时便散了，老翁也不知所终。妾身有时想，若是没有这些年的兵荒马乱，沛县还是原来那个样子，或许是极好的。\'',
      '\'但妾身也想，若无这些年的颠沛——妾身便遇不到夫君了。\'她回过头来，眸中有光，\'所以妾身从不说后悔这两个字，一个都不说。\'',
    ],
  },
  {
    id: 'msgan-t2-women-in-war',
    kind: 'narrative',
    label: '乱世女儿',
    narrative: [
      '甘夫人将一件衣物折叠整齐，平静地说：\'夫君，妾身有时候听军中的消息，想到那些跟随大军的女眷——她们走在最后头，扶老携幼，没有人讲她们的名字，却比谁都不容易。\'',
      '\'战事一起，男人们上阵厮杀，是她们的事；战事结束，男人们论功封赏，也轮不到她们。\'她语气平静，既不悲切，也不激愤，只是陈述，\'然她们大多不曾叫苦——只要家中人平安，便已足矣。\'',
      '\'妾身不是要说什么大道理，只是……夫君每次出行，妾身看着那些跟随的伴当家眷，心里总有几分感念。他们都把身家性命，托付给夫君了。\'',
    ],
  },
  {
    id: 'msgan-t2-customs',
    kind: 'narrative',
    label: '旧日风俗',
    narrative: [
      '甘夫人拿着一截红绳，比划着什么，对你道：\'夫君，你可知道，这一带有个旧俗——每年仲秋前三日，家家户户要将讨来的红绳绑在门环上，据说可以辟邪迎福。妾身小时候最爱干这个，缠得密密麻麻的。\'',
      '\'今年军中事务繁忙，妾身也没敢张扬，悄悄在夫君帐门上缠了一小段——\'她笑道，\'夫君没注意到吧？\'她眼中带着些小小的得意，\'妾身想着，礼数虽小，心意是真的。\'',
      '\'这些旧俗，看着不起眼，却是百姓的心安处。夫君若能在城中顺势而为，让百姓觉得主君也懂他们的心思，民心便又近了几分——妾身总觉得，大道理不如这种小事管用。\'',
    ],
  },
  {
    id: 'msgan-t2-autumn',
    kind: 'narrative',
    label: '秋日感怀',
    narrative: [
      '甘夫人坐在窗边，秋风将薄薄的帘幕吹起，她望着院中几株已开始泛黄的树叶，轻轻说：\'夫君，你看这叶子，绿了一整夏，到了秋天，反而好看了——黄的红的，像是用了一整年的力气，就为了最后这一下。\'',
      '\'妾身每逢秋日，总要想一些有的没的。今年与去年不同，去年夫君还在北方——今年在这里，明年……妾身说不准了。\'她顿了顿，并不显得愁苦，反而轻轻吐了口气，\'走一步看一步，当下把当下过好，便是了。\'',
      '\'夫君，妾身有时羡慕那些树叶——它们不用想明年的事，落下去，化成泥，来年又是新绿。倒是洒脱。\'她侧过头来，微微一笑，\'夫君别学它们，妾身还要夫君在的。\'',
    ],
  },
  {
    id: 'msgan-narrative-moonlight',
    kind: 'narrative',
    label: '月下思亲',
    narrative: [
      '甘夫人站在院中，仰头望月，良久才轻声道：‘夫君，妾身有时会想起爹娘——他们若还在，看到妾身如今的模样，不知会说什么。’',
      '‘妾身小时候，爹总说：嫁人要嫁个踏实的。’她笑了笑，‘也不知跟着夫君走南闯北，算不算踏实——不过妾身觉得，心里踏实，便是真的踏实了。’',
      '‘月亮还是那个月亮，照过沛县的屋顶，也照着今夜的军营。妾身有时对着月亮说几句话——也不知他们听不听得到。’',
    ],
  },
  {
    id: 'msgan-narrative-soup',
    kind: 'narrative',
    label: '一碗热汤',
    narrative: [
      '甘夫人端着一碗热汤走进来，搁在案上，道：‘夫君，趁热喝——妾身特意让厨下多熬了一会儿，味道该比昨日好些。’',
      '‘妾身不懂打仗的事，但有一件事妾身知道：一个人若是连一碗热汤都喝不上，什么雄心壮志都是空的。’她坐在一旁，看着你，‘所以妾身能做的，就是让夫君每天至少喝上这一碗。’',
      '‘别嫌妾身啰嗦——这碗汤里，有妾身的心思在。’',
    ],
  },
  {
    id: 'msgan-narrative-duty',
    kind: 'narrative',
    label: '夫人之责',
    narrative: [
      '甘夫人将一叠布帛整理齐整，沉声道：‘夫君，妾身近日想了想，妾身在这营中，到底该做些什么——不能只是缝缝补补，等夫君回来。’',
      '‘妾身觉得，军中的人心，不全在校场上——那些妇孺的安顿、柴米油盐的周转、伤兵的照料……这些琐事没人管，日子就过得粗糙了，人心也就散了。’',
      '‘妾身不要夫君操心这些，妾身来。夫君管大事，妾身管小事——大事小事拢在一处，才是个家。’',
    ],
  },
  {
    id: 'msgan-narrative-song',
    kind: 'narrative',
    label: '儿时歌谣',
    narrative: [
      '甘夫人轻声哼着一段旋律，见你走近，有些不好意思地停下来，道：‘夫君听见了？这是妾身小时候，沛县的孩子们都会唱的——歌词妾身记不全了，只记得调子。’',
      '‘那时候，一到傍晚，巷子里的孩子们就跑出来玩，一边跑一边唱。妾身跑得不快，总落在最后头——但最后一个到的，反而能看见前头所有人的背影，妾身觉得那样也挺好的。’',
      '‘现在想想，那些日子一去不回了——但这调子还在，妾身时不时哼一哼，就觉得那些好时光没有真的消失。’',
    ],
  },
  {
    id: 'msgan-narrative-embroidery',
    kind: 'narrative',
    label: '绣中天地',
    narrative: [
      '甘夫人摊开一块绣了一半的锦缎，指给你看上面的图样：山水之间，一只小舟，舟上二人并肩而坐。她轻声道：‘夫君，你看——妾身绣的是你我。’',
      '‘妾身不擅丹青，只会用针线——但针线的好处是慢，一针一线，想得清清楚楚才下手。妾身有时觉得，这也像过日子，急不得，一步一步来，到最后回头一看，才发现已经走了好远。’',
      '‘这块锦缎，妾身想等天下太平时绣完——也不知那一天什么时候来，不过不着急，妾身针线够长。’',
    ],
  },
  {
    id: 'msgan-narrative-crickets',
    kind: 'narrative',
    label: '夜听蛩鸣',
    narrative: [
      '甘夫人侧耳听了听窗外，轻声道：‘夫君，你听——蛩虫在叫了。妾身小时候，一听到这声音就知道秋天要来了。’',
      '‘妾身觉得这些小虫也不容易，叫了一整夜，也不知有没有同伴听见。’她顿了顿，有些感慨，‘不过它们还是叫——大概叫这件事本身，就是它们活着的意思。’',
      '‘夫君有时忙得连虫鸣都听不见，妾身便替夫君听着——等夫君闲下来，妾身再说给你。这也算妾身的一点用处吧。’',
    ],
  },
  // ── Situational (6, reset per round) ──
  {
    id: 'msgan-t3-support-low',
    kind: 'situational',
    label: '坊间有些话',
    narrative: [
      '甘夫人将茶杯轻轻放下，道：\'夫君，妾身今日遣人去买布，回来的人说，市集上有人在说闲话——妾身不想在夫君面前嚼舌根，但若妾身不说，夫君便不知道。\'',
      '\'大意是，百姓里有人觉得，这里换了个主人，未必比之前更好过——妾身以为，夫君或许需要做些什么，让大家知道：这一次的主人，是真的在乎他们的。妾身说不出什么大法子，只是想让夫君知道这件事。\'',
    ],
    situationalCondition: (stats: GameStats, _cond: LevelConditions) => stats.territory.support < 35,
  },
  {
    id: 'msgan-t3-rations-low',
    kind: 'situational',
    label: '家里口粮也少了',
    narrative: [
      '甘夫人轻轻道：\'夫君，妾身不想多说这些，只是……厨下今日跟妾身说，粮食快不够用了，让妾身拿个主意——妾身便想，这事还是要告诉夫君的。\'',
      '\'妾身已让厨下先紧一紧，少做些费粮的菜式，先省着——但这是治标。夫君那边，还是得尽早想法子才好。妾身在这儿能做的，只有这一点了；其余的，只有靠夫君了。\'',
    ],
    situationalCondition: (stats: GameStats, _cond: LevelConditions) => stats.territory.rations < 3000,
  },
  {
    id: 'msgan-situational-training-low',
    kind: 'situational',
    label: '操练之声',
    narrative: [
      '甘夫人蹙眉道：‘夫君，妾身这几日在营中走动，总觉得哪里不对——后来想明白了，是校场上的声音少了。以前每日清早，操练的号子声隔老远就听得到，这两日却静悄悄的。’',
      '‘妾身不懂练兵，但声音这东西骗不了人——有劲头的军队和没劲头的军队，光听声就不一样。夫君是不是该去校场看看？’',
    ],
    situationalCondition: (stats: GameStats, _cond: LevelConditions) => stats.territory.training < 30,
  },
  {
    id: 'msgan-situational-gold-low',
    kind: 'situational',
    label: '铜钱见底',
    narrative: [
      '甘夫人将几枚铜钱在桌上排了排，轻声道：‘夫君，妾身不想拿这些琐事烦你——但今日管事来说，采买的钱不够了，让妾身拿主意。妾身能拿什么主意？省来省去也就这些了。’',
      '‘妾身知道夫君也难，但该说的还得说：这钱的事，再拖下去就不是省不省的问题了，是要出大乱子的。夫君务必早些筹谋。’',
    ],
    situationalCondition: (stats: GameStats, _cond: LevelConditions) => stats.territory.gold < 200,
  },
  {
    id: 'msgan-situational-reputation-low',
    kind: 'situational',
    label: '闲话德行',
    narrative: [
      '甘夫人迟疑了一下，低声道：‘夫君，妾身不知该不该提——今日出门，听见有人在说夫君的闲话，不是好话。妾身当时没吭声，怕跟人争执反而传得更广。’',
      '‘具体说什么，妾身不想重复了——总之就是有人觉得，夫君近来的做法，跟从前的仁义之名有些……不一样。夫君心中有数便好。妾身以为，堵不如疏，做一两件让人看得见的好事，比说一百句话管用。’',
    ],
    situationalCondition: (stats: GameStats, _cond: LevelConditions) => stats.reputation < 40,
  },
];

/**
 * Default text shown in the 传言 (rumor) slot when no patrol event is seeded.
 * This is a fixed menu entry — not a ChatTopic.
 */
export const MS_GAN_RUMOR_NO_EVENT: string =
  '甘夫人摇了摇头，轻声道：\u2018最近倒没什么特别的传闻。夫君不必担心——若有什么风声，妾身一定第一时间告知。\u2019';
