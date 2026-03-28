# Requirement Spec - Level 1
1. Chapter 1 mainly follows Strategic Gameplay, see @gameplay.md.
2. Chapter 1 has 12 rounds, each round lasts 10 days.
3. The time frame of Chapter 1 is Jun 194 to Oct 194. Liu Bei's force deployed at XiaoPei, a town near XuZhou.
4. Each round has 5 main phases:
    1. Start events: there can be events at the begining of a round. The events include:
        - semi-random events triggered by game state aware random check, and
        - scripted event that must happen at specific round.
    2. Opening script: a pre-authed text script about the round for narration experience.
    3. Standup: every follower will propose his/her primary task in this round. the player can approve or assign another task.
    4. Free action: Player can freely choose action from a pool, each action takes days, until the 10 days of the round run up.
    5. Ending events: some events will be triggered at the end of a round. They can be:
        - primary task report: followers who finished the primary task will report the result, hence game states change.
        - semi-random event: event triggered by game state aware random check.
        - scripted event that must happen at specific round.
5. Every follower can propose at most one primary task for a round, which could be: "募兵", "练兵", "征粮", "征税", "治安巡逻"，"拜访名士","贴身防卫".
6. Follower's proposal is based on two factor: 1. personal preference, 2. situation: game states and win/lose criteria. The higher the intelligence of the follower, the more he/she cares about the situation.
7. There are 4 followers in the begining: Guan Yu, Zhang Fei, Jian Yong, Sun Qian. Mi Zhu may join at the last several rounds.
8. In the free action phase, player can do:
    - "交谈": talk with a follower. Liu Bei's first wife, Ms. Gan is also a character player can talk with. She is especially important in providing clues about the situation and what to do the next. Talk can trigger game state change, reward player with clues, or create narrative experience.
    - "拜访": visit aristocratic families to trigger game state change, collect hint about situation, craete narrative experience, or trigger events.
    - "查访民情": Patrol in the territory to trigger events that can change game state.
    - "休息": Skip the rest of the round.
9. There are three people in aristocratic families that can be visited: "孔融","糜竺" and "陈登". None of them can be visited at the begining of the level. 
    - To unlock Kong Rong, player must first try to visit aristocratic families, but got response that "you dont know anyone in aristocratic families". Player talk to "简雍" or "孙乾" afterwards, and get reminded that he knows Kong Rong who lives far away. This unlocks Kong Rong.
    - By talking with Kong Rong on right topic, Mi Zhu and Chen Deng are unlocked, but if player visit them, will get rejected at the door because his public opinion is low.
    - To get a decent public opinion, player needs to visit Kong Rong and talk about the right topic about evaluation. Kong Rong will set a initial value of player's public opinion, which makes Mi Zhu and Chen Deng friendly to player.
    - Player can talk with Mi Zhu when he is friendly, and by talking about multiple topics and making choices, Mi Zhu will:
        - promise to support Liu Bei in future events when relationship is good.
        - propose marriage of her younger sister and Liu Bei when relationship is very good.
        - join Liu Bei force as a follower when relationship is top.
        - when Mi Zhu joins Liu Bei, he will brings all his treasure to Liu Bei.
    - Player can talk with Chen Deng when he is friendly, and by talking about multiple topics and making choices, Chen Deng will:
        - support Liu Bei rations when relationship is good.
        - promise to support Liu Bei in future events when relationship is vey good.
10. The level ends on round 12, aka late third of October. Tao Qian dies at the end of the round. This is the last event, and player must do a D20 check to become landlord of XuZhou. Mi Zhu's support, Liu Bei's millitary power and most importantly, Chen Deng's support are modifiers to the D20. If player failed the check, game over, otherwise the level is considered win.
11. There are other lose conditions:
    - player get killed by assassin from XiaoPei people. It is triggered randomly when Liu Bei's popularity is low. Assassin can be beat, if player or his body guard win D20.
    - Army mutiny because player run out of millitary rations.
    - player get killed by assassin sent by Chen Deng. If player's relationship with Chen Deng is low, and his popularity is also low to a degree, Chen Deng may send very dangerous assassin to kill the player, which is triggered by random check.
12. "查访民情" always trigger a random event, which changes game state. The event may need D20 check to determin the result. Player can request a companion who is his follower, to help win D20. If a follower is requested, he will be bored and wont be the companion for this round and next.
13. Talk to Ms. Gan may be awarded with vague hint about what kind of event will it be if player go with "查访民情", so player knows request who as companion.
14. Millitary rations is very low in the begining, it could be something around 30 days. Player must struggle to get sufficient rations to survive.
15. The major experience flow of the level is: Low rations pressure -> squeeze folks -> low popularity -> survive and get support from Chen Deng with rations -> fix popularity and improve millitary power -> Tao Qian dramma, political fight
16. The name of the level is "徐州之龙", it implies Chen Deng (字 元龙)
17. The story before the level is not elaborated in the level, but it should be covered in various conversations in scripts and between people. 
18. The lines of characters in narration should be rich, not long but picked randomly from a decent pool, so player does not feel repeatitive.
19. The UI of the level should include a pane for game stats and a pane for level stats (round, days left, etc)