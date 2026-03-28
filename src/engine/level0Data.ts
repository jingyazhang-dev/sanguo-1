import type { PlayerAttrs } from '../types/player';

export interface QuestionOption {
  /** Used as Choice.id in the ChoiceNode — must match when looking up delta. */
  id: string;
  label: string;
  delta: Partial<PlayerAttrs>;
}

export interface Question {
  id: string;
  narrative: string;
  options: QuestionOption[];
}

export interface Level0Data {
  introParagraphs: string[];
  questions: Question[];   // exactly 5
  outroParagraphs: string[];
}

export const level0Data: Level0Data = {
  introParagraphs: [
    '月黑风高，草木森森。你不知自己身在何处，只觉得双腿在拼命地奔跑——仿佛已经跑了很久，很久。',
    '身后，马蹄声如雷，一骑追来，气势骇人。你不敢回头，只从余光中瞥见一杆方天画戟的寒芒。那骑士浑身杀气，黑夜之中犹如鬼神降世。',
    '你不知他是谁，也不知他为何追你。腰间那柄佩剑随奔跑不住晃动，却丝毫给不了你半分安心——<em>若被追上，必死无疑。</em>',
  ],
  questions: [
    {
      id: 'q0',
      narrative:
        '前方忽现火光，几户茅屋散落路旁。十余名村民正惶恐地收拾行装，妇孺哭声一片。马蹄声越来越近，他们也听到了，恐惧的目光投向你。',
      options: [
        { id: 'q0-a', label: '振臂高呼："四散而逃！他只有一人一骑！"', delta: { charisma: +2, intelligence: -1 } },
        { id: 'q0-b', label: '混入人群，借乱象掩护悄然脱身', delta: { intelligence: +2, charisma: -1 } },
        { id: 'q0-c', label: '不假思索，引领众人沿小路避入山林', delta: { strength: +1, charisma: +1, intelligence: -1 } },
      ],
    },
    {
      id: 'q1',
      narrative:
        '你奔至一条湍急的河流前。一座破旧的木桥横跨两岸，桥板已朽，摇摇欲坠。身后的马蹄声略远了些——方才的周旋似乎争取了一点时间。但你知道，那骑士不会放弃。',
      options: [
        { id: 'q1-a', label: '就地取材，用绳索与断木在桥头设下绊马索', delta: { intelligence: +2, strength: -1 } },
        { id: 'q1-b', label: '拔剑在手，立于桥头迎敌，以一夫当关之势阻敌', delta: { strength: +2, charisma: -1 } },
        { id: 'q1-c', label: '高声向对岸呼喊求援，不顾暴露行踪', delta: { strength: +1, charisma: +1, intelligence: -1 } },
      ],
    },
    {
      id: 'q2',
      narrative:
        '渡河之后，你踉跄闯入一片幽深的竹林。月光透过竹叶洒下碎银般的光斑。四周静得诡异——然后你听到了，那骑士已经过河，正在竹林外缓缓巡弋。竹林深处隐约可见一座废弃的哨塔。',
      options: [
        { id: 'q2-a', label: '攀上哨塔，搬起碎石枯木，据守高处', delta: { strength: +2, charisma: -1 } },
        { id: 'q2-b', label: '冒险点燃塔顶烽火，向远处求援', delta: { strength: +1, charisma: +1, intelligence: -1 } },
        { id: 'q2-c', label: '屏息观察骑士的巡弋路线，寻找空隙突围', delta: { intelligence: +2, charisma: -1 } },
      ],
    },
    {
      id: 'q3',
      narrative:
        '穿过竹林，你几乎撞上一个倒在路边的人影。借着惨淡月光，你看清那是一名受了重伤的士卒，铠甲破碎，面色苍白。他一把抓住你的衣袖：<em>"将军……救我……"</em>',
      options: [
        { id: 'q3-a', label: '二话不说，将他背起便走', delta: { charisma: +2, intelligence: -1 } },
        { id: 'q3-b', label: '为他草草包扎，指引藏身处，自己引开追兵', delta: { charisma: +1, intelligence: +1, strength: -1 } },
        { id: 'q3-c', label: '记下他的位置，低声允诺折返，旋即继续前行', delta: { intelligence: +1, strength: +1, charisma: -1 } },
      ],
    },
    {
      id: 'q4',
      narrative:
        '前方再无退路。你被逼至一处断崖之上，脚下是深不见底的峡谷，身后是步步逼近的蹄声。' +
        '<speed slow>月光之中，那骑士的身影终于清晰——</speed>' +
        '赤兔般的骏马，方天画戟横于鞍侧，一双冷眼如视蝼蚁。<em>他，到底是什么人？</em>',
      options: [
        { id: 'q4-a', label: '挺身直面，高声道："我乃涿郡刘玄德，何方壮士，报上名来！"', delta: { charisma: +1, intelligence: +1, strength: -1 } },
        { id: 'q4-b', label: '环顾崖壁，搜寻藤蔓与缝隙，寻路攀下', delta: { strength: +1, intelligence: +1, charisma: -1 } },
        { id: 'q4-c', label: '握紧佩剑，大喝一声，向骑士径直冲去', delta: { strength: +2, intelligence: -1, charisma: -1 } },
      ],
    },
  ],
  outroParagraphs: [
    '那杆寒芒闪烁的画戟裹挟着千钧之力劈下——<speed slow>你下意识举臂格挡，</speed>然后——<em>一切消散了。</em>黑暗、追逐、恐惧，如碎裂的镜面般纷纷坠落。',
    '你猛然睁开双眼，满头冷汗。帐外是小沛营中熟悉的虫鸣，六月的夜风温热地拂过面庞。<speed slow>是梦。</speed>只是一场梦。',
    '然而那骑士的冷眸仍在眼前徘徊，那无可匹敌的杀意仍令你的手指微微发颤。你缓缓坐起身，望向帐外夜色——心知这绝非寻常之梦。',
  ],
};

// Runtime guards — catches content editing mistakes early
if (level0Data.questions.length !== 5) {
  throw new Error(
    `level0Data must have exactly 5 questions, got ${level0Data.questions.length}`,
  );
}
for (const q of level0Data.questions) {
  if (q.options.length !== 3) {
    throw new Error(
      `Question ${q.id} must have exactly 3 options, got ${q.options.length}`,
    );
  }
}
