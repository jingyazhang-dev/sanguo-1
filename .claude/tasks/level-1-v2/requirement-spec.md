# Requirement Spec for Level 1 V2
This is the revised version of Level 1. The base requirement for Level 1 can be found in [.github/tasks/level-1]. If there is any conflicts between the base requirement and this revision, use this revision.
## Change to game stats
The game stats change as below:
1. Merge public opnion - morality and public opnion - talent into public opinion (声望)
2. Morale no longer appear in the level, it will be only useful and managed in combat gameplay(not in this revision)
3. Combat Power = (Training + Equipment) /2, where Training and Equipment both range 0-100.
## Initial stats
The initial stats of level 1 should be:
  - Soldier: 6000 (Tao Qian supported Liu Bei with 4000 DanYang elite soldiers)
  - Rations: 180000 (30 days)
  - Gold: 1000 (write in stats panel as "金：1000")
  - Training: 50
  - Equipment: 50
  - Support: 50
  - Public Opinion: 30
## Talk with followers
This action is redesigned as:
  1. when talk to a follower, player can choose a topic from one fixed topic "闲谈" and a couple of dynamic topics.
  2. for "闲谈", the follower can react with a talk picking from three kind of talks 
  (1) talks that trigger scripted event. the event may involve D20 check, or player choice, and can result in stats change, either plus, or minus; (2) talks that are purely narrative, to render the background story around the time and place; (3) talks about the current situation. For example, when the support is very low, a follower may remind the player about the danger of rebelling. The probability of picking topic kind (3) is dependent on the follower's intelligence. The higher the intelligence, the more situation-aware the follower is. The probability of picking topic kind (1) is half as the probablity of picking topic kind (2). If a topic in topic (3) has been talked in the round, it will not be picked again in the round. If a topic in topic (1) and (2) has been picked in a round, it will never be picked again in the level.
  3. The dynamic topics need to be triggered by start-up event, or event from actions. once triggered, a topic is added to player's talk topic options in every follower talk action. such dynamic topics can be for example: "急需军粮","结识士族".
  4. For a specific dynamic topic, not all followers have meaningful conversation lines, in most cases only 1-2 followers/adviser can react with a useful talk. for example:
    - for "急需军粮", Ms. Gan may react with suggestion on visiting aristocratic families, and Jian Yong and Sun Qian may react with suggestion on taxing inhabitants. Other followers may have no idea.
    - for "结识士族", Ms. Gan and Sun Qian may react with talk that unlock Kong Rong; Jian Yong may react with talk that unlock Mi Zhu and Chen Deng. Others may have no idea.
  5. A dynamic topic will be removed when it is no longer relevant, for example, when you have sufficient rations, "急需军粮" should no longer appear.
## Visit aristocratic families
This action is redesigned as:
### Greetings
  when visit a person, he or she will greet with a line which is in accordance with the relationship between Liu Bei and the visitee. relationship = 50 means normal relationship, not a friend, not a hatee.
### Kong Rong
  1. Kong Rong should have 10-20 topics to talk about, and most of them are just narrative talk regarding the situation, the previous interaction, the people.
  2. There is one key talk topic hidden in the topics that is "evaluation", it boosts the public opinion of Liu Bei by public opinion + 30.
  3. When visit Kong Rong, player can choose from 5 talk topics, where the evaluation will always appear, with 4 other randomly picked topics, in a random order.
  4. when a talk topic has been picked, it will never appear in the level.
  5. when all the talk topics have been picked, show a fall back narrative talk topic every time afterwards.
### Mi Zhu
  1. Mi Zhu has 10 topics to talk about.
  2. 9 out of 10 topics are scripted events that involve either D20 check or player choice, or both to adjust player relationship with Mi Zhu.
  3. The adjustment must make sense and has reasonable connection with the talk content.
  4. one topic is special, it is about Chen Deng's position as "典农校尉" in Xu Zhou, which is an important hint for the player to break out the ration scarcity. It only appears when the relationship is above 50. When this talk is picked, a special talk topic with Chen Deng is unlocked.
  5. when visit Mi Zhu, player can pick from 3 random topics.
  6. when a topic has been talked in the level, it is removed from the topic pool.
  7. when all the topics are talked, player can pick a fallback narrative talk.
  8. when the relationship is above 60, a start-up event will be triggered that Mi Zhu gift 10000 gold to Liu Bei.
  9. when the relationship is above 80, a start-up event will be triggered that Mi Zhu marry his younger sister Ms. Mi to Liu Bei.
  11. the relationship with Mi Zhu starts from 50. Every talk event can change it between 0-10. 
  12. Mi Zhu does not meet you when public opinion is below 40.
### Chen Deng
  1. Chen Deng has 10 topics to talk about.
  2. All topics are scripted events that involve either D20 check or player choice, or both to adjust player relationship with Chen Deng.
  3. The adjustment must make sense and has reasonable connection with the talk content.
  4. one topic is special, it is about asking Chen Deng for rations support. It is unlocked by a special talk with Mi Zhu. The talk always need a D20 check, the difficulty is 10, and the modifier is relationship-60. If player succeeds, Chen Deng will gift 1000000 rations, and if player fails, the topic is not removed so he can retry next round.
  5. when visit Chen Deng, player can pick from 3 random topics.
  6. when a topic has been talked in the level, it is removed from the topic pool.
  7. when all the topics are talked, player can pick a fallback narrative talk.
  8. when the relationship above 80, a speicial talk topic is unlocked, which is about supporting Liu Bei in future crisis (Tao Qian's death). This topic always needs a D20 check, the difficulty is 10, and the modifier is relationship-80. This topic will not be removed when player failed D20, so he can retry next round.
  9. The relationship with Chen Deng starts from 30, every talk event can change it between 0-10.
  10. Chen Deng does not meet you when public opinion is below 40.
## Patrol Event
When doing patrol in free actions, it will trigger an event, which adjust game stats.
1. the patrol event never changes player attr.
2. the patrol event should always provide player with two or more options, each changes game stats in different ways.
3. the change should be explicitly showed together with the option, and it usually includes both plus and minus. For example:
    - [option 1 description] Gold -100, Support + 10
    - [option 2 description] Gold +100, Support - 10
4. if an option requires a D20 check, also show the attr used as modifier as supplimentary information together with the option description and stats adjustment.
    - [option x description] ([modifier attr]) Win: Gold + 200 Lose: Gold -100 
5. Some patrol event changes game stats largely, and usually the change is gated by D20 check, these patrol events are marked as "Rare". 20% of events are rare. 
## Adviser
Talk with adviser is redesigned as:
### Ms. Gan
1. Ms. Gan has all the topic kinds as the follower.
2. Ms. Gan has a special topic about "传言", which is a vague hint about next patrol event: what it is about, what you may get, or whether it is rare.
### Ms. Mi
1. Ms. Mi has only "闲谈" topicc.
## Narrative Hints
1. All followers and visitees should talk in a tone that matches their images in history and related literary.
2. Ms. Gan does not have sufficient historical and literary sources, define her characteristic as: 温柔，直觉准确，有点任性，美丽，不依靠理性判断。
3. Ms. Mi does not have sufficient historical and literary sources, define her characteristic as: 温柔，贤惠，理性，大方