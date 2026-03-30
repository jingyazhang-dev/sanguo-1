# Issue Report 10
1. Visit Kong Rong should work as below:
  - Kong Rong have 10 lines of talk, where 9 are purely narrative (no attr or stats change at all), 1 is special, which is about evaluate the player and boosts player's reputation by +20.
  - Every time when player visits Kong Rong, show 5 topics. 4 topics are randomly picked from the 9 pure narrative talk pool, and 1 is the special reputation talk.
  - The order of the 5 showing topics should be random, dont always make the special talk on top.
  - If one of the talk is selected in a visit, it will be removed from the pool (never appear in the level). If the special talk is selected, it is also removed from the level.
2. D20 should offer reroll, whose cost is increased over times. cost = n*n*100 gold, where n is the time of rerolling in the level.
3. Collect rations in primary tasks have a reward decay:
    - ```reward =  50000 * (1 + (charisma-10) * 0.1) * 0.7^(n-1)``` where n is the times of collection.
    - The cost is constant -5 support.