import { useCallback, useMemo, useState } from 'react';
import { useLevel1Store } from '../../store/level1Store';
import { useGameStore } from '../../store/gameStore';
import { buildFinalD20Modifiers } from '../../engine/level1/loseCheckEngine';
import { FINAL_D20_DIFFICULTY } from '../../engine/level1/constants';
import { EventDisplay } from './EventDisplay';
import { D20Check } from './D20Check';
import type { LoseReason } from '../../types/level1Types';

type Step =
  | { kind: 'taoQianDeath' }
  | { kind: 'finalD20' }
  | { kind: 'win' }
  | { kind: 'lose'; reason: LoseReason };

const LOSE_NARRATIVES: Record<LoseReason, string[]> = {
  mutiny: [
    '军粮断绝的第三日，哗变终于来了。先是伙房被愤怒的士卒砸毁，继而有人冲入军械库夺取兵刃——关羽张飞拼死弹压，奈何饿红了眼的军士已听不进任何号令。小沛营中火光冲天、哭喊震耳，刘备的徐州之梦，在这一片混乱中化为了灰烬。',
  ],
  assassin_local: [
    '夜半三更，秋虫唧唧。一条黑影如鬼魅般翻过营墙，避开了困倦的哨兵，径直摸向中军大帐。寒光一闪，刀锋没入帐幔——刘备猝不及防，血溅当场。民怨积久成疾，今夜终于化作了这致命的一刀。',
  ],
  assassin_chen: [
    '子夜时分，三道黑影如鬼魅般自营外掠入。这不是寻常的刺客——他们身手矫捷、配合默契，显然经过精心训练与周密部署。等关羽闻声赶到时，一切已迟。帐中灯烛倾倒，刘备倒在血泊之中。事后方知，那是陈登暗中豢养的死士——元龙之怒，无声，却致命。',
  ],
  failed_xuzhou: [
    '陶谦溘然长逝，遗命虽言「非刘备不能安此州」，奈何徐州世家各怀心思，并非人人信服。数日密室博弈之后，州府最终另推新主。刘备立于小沛城头，遥望徐州方向，秋风猎猎吹动衣袍——壮志未酬，功亏一篑，这千载难逢的机遇，终究从指缝间滑落了。',
  ],
};

const WIN_NARRATIVE = [
  '陶谦遗命如秋风过野，一日之间传遍徐州六郡。糜竺率州府百官出城相迎，陈登携世家联名上表——众望所归之下，刘备于徐州府衙正堂接印受册，领徐州牧。',
  '从小沛一隅之地、五百疲卒、不足月余之粮，到坐拥一州、号令万军——短短数月之间，刘皇叔的命运，在这一刻发生了翻天覆地的转折。府衙前百姓夹道欢呼，旌旗猎猎，恍如隔世。',
  '然而，这只是开始。北方曹操虎视眈眈，淮南袁术蠢蠢欲动，更有那温侯吕布如困兽犹斗、四处流窜——群狼环伺之下，徐州之龙的故事，才刚刚拉开序幕……',
];

const TAO_QIAN_DEATH = [
  '兴平元年十月下旬。黄昏时分，一骑快马自徐州方向疾驰而来，马蹄踏碎了满地枯叶。斥候翻身下马时险些跌倒，面色惨白——徐州牧陶谦陶恭祖，薨了。',
  '据传陶谦临终之际，强撑病体坐起，遣退左右侍从，独召糜竺、陈登至榻前。他以枯槁之手紧握二人衣袖，气若游丝却一字一顿：「非刘备不能安此州也。」言罢，含笑而逝。',
  '消息传至小沛，营中霎时一片死寂。将士们不约而同地放下了手中事务，百姓搁下了肩上担子——所有人的目光，都穿过层层营帐，齐齐望向中军大帐的方向。望向刘备。',
  '天际最后一抹残阳沉入地平线，夜色如墨般四合涌来。命运的转轮已然启动——徐州的归属，在此一刻，在此一地，在此一人。',
];

export function LevelEndScreen() {
  const conditions = useLevel1Store((s) => s.conditions);
  const stats = useLevel1Store((s) => s.stats);
  const attrs = useLevel1Store((s) => s.attrs);
  const triggerWin = useLevel1Store((s) => s.triggerWin);
  const triggerLose = useLevel1Store((s) => s.triggerLose);
  const reset = useLevel1Store((s) => s.reset);
  const goToTitle = useGameStore((s) => s.goToTitle);

  // Determine initial step
  const initialStep = useMemo<Step>(() => {
    if (conditions.won) return { kind: 'win' };
    if (conditions.loseReason) return { kind: 'lose', reason: conditions.loseReason };
    // If we got here without win/lose, it's the final D20 sequence
    return { kind: 'taoQianDeath' };
  }, [conditions.won, conditions.loseReason]);

  const [step, setStep] = useState<Step>(initialStep);

  // Final D20 modifiers
  const finalModifiers = useMemo(
    () => buildFinalD20Modifiers(conditions, stats),
    [conditions, stats],
  );

  const handleTaoQianDone = useCallback(() => {
    setStep({ kind: 'finalD20' });
  }, []);

  const handleFinalD20Result = useCallback(
    (success: boolean) => {
      if (success) {
        triggerWin();
        setStep({ kind: 'win' });
      } else {
        triggerLose('failed_xuzhou');
        setStep({ kind: 'lose', reason: 'failed_xuzhou' });
      }
    },
    [triggerWin, triggerLose],
  );

  const handleRetry = useCallback(() => {
    reset();
  }, [reset]);

  /* ── Render ────────────────────────────────────────────── */

  // Tao Qian death scene
  if (step.kind === 'taoQianDeath') {
    return (
      <div className="w-full py-4">
        <EventDisplay
          key="taoqian-death"
          paragraphs={TAO_QIAN_DEATH}
          onDone={handleTaoQianDone}
        />
      </div>
    );
  }

  // Final D20 check
  if (step.kind === 'finalD20') {
    return (
      <div className="w-full py-4 flex justify-center">
        <D20Check
          difficulty={FINAL_D20_DIFFICULTY}
          situation="normal"
          attrKey="charisma"
          attrValue={attrs.charisma}
          modifiers={finalModifiers}
          onResult={handleFinalD20Result}
        />
      </div>
    );
  }

  // Win screen
  if (step.kind === 'win') {
    return (
      <div className="w-full max-w-md mx-auto py-8">
        <h2 className="font-serif text-2xl text-red-800 text-center mb-8 tracking-widest">
          第一章 · 通关
        </h2>
        <EventDisplay
          key="win-narrative"
          paragraphs={WIN_NARRATIVE}
          onDone={() => {}}
        />
        <div className="mt-8 text-center">
          <button
            className="px-8 py-3 border border-stone-400 rounded hover:bg-stone-100 font-serif text-stone-700"
            onClick={goToTitle}
          >
            返回标题
          </button>
        </div>
      </div>
    );
  }

  // Lose screen
  if (step.kind === 'lose') {
    const narratives = LOSE_NARRATIVES[step.reason] ?? ['游戏结束。'];

    return (
      <div className="w-full max-w-md mx-auto py-8">
        <h2 className="font-serif text-2xl text-stone-400 text-center mb-8 tracking-widest">
          游戏结束
        </h2>
        <EventDisplay
          key={`lose-${step.reason}`}
          paragraphs={narratives}
          onDone={() => {}}
        />
        <div className="mt-8 flex justify-center gap-4">
          <button
            className="px-6 py-2 border border-stone-400 rounded hover:bg-stone-100 font-serif text-stone-700"
            onClick={handleRetry}
          >
            重新来过
          </button>
          <button
            className="px-6 py-2 border border-stone-300 rounded hover:bg-stone-100 font-serif text-sm text-stone-500"
            onClick={goToTitle}
          >
            返回标题
          </button>
        </div>
      </div>
    );
  }

  return null;
}
