# Gameplay Spec

1. Player attributes (Attr): 
    1. player have "strength", "intelligence", "charism" as the attributes used for D20 check.
    2. player attr can change during game
    3. Player attr starts from 10. the value is capped between 0-20.
    4. the attr are used as modifier to D20 in a way that modifer = value - 10.

2. Game states (Stats):
    1. Game states are values that represents the current state of game. Game states + player action determines next state of game.
    2. Player attributes is part of game states, but when we talk about game states in the document, player attributes are not included.
    3. Game state include:
        1. Public opinion: it is the opinion from aristocratic families against the player. Public opinion affects attitude of people in aristocratic families towards player.It includes two values:
            1. Morality (0-100)
            2. Talent (0-100)
       
        2. Territory status: it is the status of the territory and people owned by the player as a warlord group. It includes following values:
            1. Millitary: number of people in service
            2. Combat power: level of combat power of player millitary
                - Combat power is calculated with Training and Eqipments
                - Training value is between 0-10
                - Equpment value is between 0-10
                - Combat power (0-100) = (Training + Equipment) * 5
            3. Morale: 0-100
            4. Millitary rations: raw number, unit is man*day
            5. Funds: raw number
            7. Support: 0-100, how the people live in the territory support the player as the landlord.
        3. Character relationship: some characters have a relationship value to the player. the value determines the attitude of the character when interact with player. some events may be triggered by this value.

3. Strategic Gameplay
    1. in most of the chapters (levels), the game is driven by strategic gameplay.
    2. in strategic gameplay, game loop is performed in a round by round mode. A round has a in-game time frame, for example, 10 days. each round has this flow:
        1. start up: there can be hardcoded script to be played, and/or dynamic event scripts to be played.
        2. Primary task: at the begining of a round, there is usually a standup, where major followers of the player will be assigned a primary task, such as recruite soldiers, train troops, etc. the result will be calculated and played at the end of the round.        
        3. main round phase: player can freely choose from available actions.
        4. each action takes in-game time as cost.
        5. when player uses up in-game time of a round, the main round phase ended.
        6. player can end main round phase actively as well.
        7. settlement phase: it is the last phase of a round, where events happens in settlement phase is played.
    3. A level ends on "game over" or "accomplish", which is triggered by hardcoded conditions of a level.
    4. available actions in a round can change, because actions can have pre-conditions.
    5. perform of an action can cause stats change, attr change, or set a condition.
4. Scripted Gameplay
    1. Some levels is driven by scripted gameplay, which is rendering pre-built text and/or dynamic text plus menu selection.
    2. Menu selection can change the next content of the script to play.
    3. Menu selection can change player attr, or game stats.
    4. Every menu selection triggers a save function, where player attr + game stats are saved.
5. D20 Check: D20 Check is a major mechanism for the game, which is used for decide the result of a choice/action triggered by player or NPC. Here is the guide about the implementation of D20 Check.
    1. The presentation of D20 check has 4 stages:
        1) Stage 1 data presentation: in this stage, game should show relevant data, such as the difficulty value, the situation (advantage/disavantage), the relevant attribute (e.g. strength).
        2) Stage 2 Roll: in this stage, game
            1. first show a die figure, 
            2. then let player click to start rolling. 
            3. once clicked, play a roll animation such as number flicking. 
            4. after a while the animation stopped and the roll result is shown on the die.
            5. If it is an advantaged/disavantaged situation, there should be two dies. There should also be a proper way to reflect which die hold the relevant result.
        3) Stage 3 modifier: show how relevant attribute modifier is applied to the result, with animation.
        4) Stage 4 Conclude the final result with text and animation.
    2. The presentation of D20 should happen in a single UI block.
    3. The presentation of D20 should be intuitive and not overly-complex.