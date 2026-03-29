import type { ChatTopic } from '../../../types/level1Types';
import { MS_MI_ID, MS_MI_NAME } from '../constants';

/**
 * Ms Mi (糜夫人) chat topics — 闲谈 only.
 *
 * She is Liu Bei's new wife and younger sister of Mi Zhu (糜竺).
 * Available only after conditions.miZhuMarriage === true.
 * She is talk-only: no primary tasks, no 传言, no dynamic topics.
 *
 * Character: 温柔，贤惠，理性，大方
 * Background: merchant family of enormous wealth (糜家，"祖世货殖，僮客万人，赀产钜亿")
 *             from 东海郡朐县 (modern Lianyungang, Jiangsu).
 *             She married Liu Bei as a political alliance, but carries her own heart in it.
 *
 * Thematic pillars:
 *  - Merchant family wisdom (reading people, understanding value, practical logistics)
 *  - Observations on Xuzhou's people and economy
 *  - Emotional warmth and support as a new wife
 *  - Concern for Liu Bei's health and rest
 *  - Gentle political counsel drawn from a lifetime watching deals being struck
 *
 * All topics are `narrative` kind (consumed permanently, atmospheric backstory).
 * Rewards use `reputation` only, reflecting the trust and warmth she builds.
 */

/** Prefix for all topic IDs, derived from character constant. */
const _id = MS_MI_ID; // 'msmi'

export const MS_MI_CHAT_TOPICS: ChatTopic[] = [
  // ── Narrative (7, consumed permanently) ──

  {
    id: `${_id}-family-ledgers`,
    kind: 'narrative',
    label: '糜家往事',
    narrative: [
      `${MS_MI_NAME}坐于窗侧，望着院中来往的兵士，轻声道：'妾身幼时，家中常有外地商客往来——父兄接待，妾身便在旁侧看着，看他们如何开口，如何还价，如何在一盏茶的工夫里，将一个素不相识的陌生人变成日后的生意伙伴。'`,
      `'妾身那时便想，买卖做得长久的人，看人的眼光必是极准的——他们见过太多形形色色的面孔，自知谁说话算数，谁不过是说说罢了。'她顿了顿，眸中透着几分温定，'夫君，妾身嫁给你，用的也是那双眼睛——糜家做了几代生意，从未赌错过一次。'`,
    ],
    statsDelta: { reputation: 6 },
  },

  {
    id: `${_id}-new-wife`,
    kind: 'narrative',
    label: '初为人妇',
    narrative: [
      `${MS_MI_NAME}将一盏灯移近，轻声道：'夫君，妾身嫁来已有些时日——从前在家中，每日看账簿、理仓库，从不知何为军营、何为钟鼓。如今妾身已习惯了这校场的喧嚷，习惯了夜里风里带着篝火的气味。'`,
      `'妾身有时想，所谓嫁，便是把自己的脚步挪到另一个人的路上来——路虽陌生，只要认准了方向，便不怕走远。'她侧过脸，轻轻一笑，'夫君，你的路，妾身认准了。'`,
    ],
    statsDelta: { reputation: 5 },
  },

  {
    id: `${_id}-market-wisdom`,
    kind: 'narrative',
    label: '市井观人',
    narrative: [
      `${MS_MI_NAME}理了理袖口，从容道：'夫君，妾身有一点商贾人家的习气，走到哪处，先看市集——市集热不热，菜价贵不贵，摊主是笑着招呼还是低头叹气，这些便是一地民心的明镜，比衙门里的文书说得更真。'`,
      `'妾身在徐州走了几回，觉得此地百姓历来习于安定，不愿再乱——他们不在乎谁做主君，只在乎主君是否做了那几件实事：减赋、护路、管水。'`,
      `'夫君若能在这三件事上早有作为，徐州的民心便是夫君的了。'她淡然一笑，'妾身家里做生意，讲究的不过是一个字——实。'`,
    ],
    statsDelta: { reputation: 7 },
  },

  {
    id: `${_id}-rest-and-health`,
    kind: 'narrative',
    label: '劝夫早息',
    narrative: [
      `${MS_MI_NAME}端了一盏热茶来，轻轻搁在案上，低声道：'夫君，妾身看你眼下有些乌青——这几日怕是又熬了夜罢？'`,
      `'妾身不是要来啰嗦，只是……夫君身子若垮了，帐中的文书、营里的将士，谁来撑？'她停了停，语气软了几分，'凡是扛得住的事，明日再说也不迟——夫君先歇一个时辰，妾身守着，有事妾身叫你。'`,
    ],
    statsDelta: { reputation: 3 },
  },

  {
    id: `${_id}-xuzhou-customs`,
    kind: 'narrative',
    label: '徐州人情',
    narrative: [
      `${MS_MI_NAME}回味般地道：'夫君，妾身老家在东海朐县，离徐州不远，却也大不相同——朐县临海，人心直爽，有话便说，宁可当面翻脸，也不在背后使绊；徐州居中，南北行商往来，人情便细腻些，弯弯绕绕的，不轻易当面表态。'`,
      `'夫君若要在此地立足，不妨多借助一些中间人——徐州人不喜欢被直接要求什么，却喜欢自己"主动"来投。'`,
      `'这是妾身多年看兄长做生意看出来的门道——夫君只当妾身闲话，信不信由夫君定。'她说完，不疾不徐地喝了口茶，神色坦然。`,
    ],
    statsDelta: { reputation: 6 },
  },

  {
    id: `${_id}-brother-mi-zhu`,
    kind: 'narrative',
    label: '兄长厚意',
    narrative: [
      `${MS_MI_NAME}轻轻摩挲着腕上的玉镯，低声道：'夫君，外人说兄长将妾身嫁来，是政治联姻——妾身不辩，因为这也是实话。可实话里头，还有一句真话，外人不知道。'`,
      `'兄长在将妾身许给夫君的那晚，单独唤妾身来，只说了一句话：此人，值得托付。——兄长做生意几十年，阅人无数，他说"值得"二字，便是真的值得。'`,
      `'妾身那晚便定了心。'她抬起眼来，眸色沉静，'夫君，你没有辜负兄长的眼光，也没有辜负妾身。'`,
    ],
    statsDelta: { reputation: 8 },
  },

  {
    id: `${_id}-household-order`,
    kind: 'narrative',
    label: '理家絮语',
    narrative: [
      `${MS_MI_NAME}看了看营中新置的几口大锅，点头道：'夫君，妾身想说一件小事——厨下的柴火近来有些不够用，妾身已让人去附近村中买了一批，先顶一阵；粮袋的封口也换了新麻绳，免得受潮。这些零碎事，妾身来管便是，不必劳烦夫君。'`,
      `'只是妾身想让夫君知道，家里的事，妾身心里有数。'她平静地道，'兄长家里管着万人僮客，妾身从小跟着看——这点阵仗，妾身应付得来。夫君放心去理外头的事，里头的事交给妾身。'`,
    ],
    statsDelta: { reputation: 4 },
  },
];
