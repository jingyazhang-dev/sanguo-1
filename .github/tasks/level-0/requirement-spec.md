# Requirement Spec
This is the first chapter of the game, which is a scripted chapter aiming at setting player attributes and deliver narrative experience. 
1. For this task, the story content is saved for next task. Use placeholder text when needed.
2. Player is provided with 5 questions in sequence, each question starts with a narrative text.
3. Each question has 3 options for answers, describing different solutions towards a challenge.
4. the question is rendered with type-in renderer. Player answer the questions by clicking the options menu.
5. Player attr is init as 10/10/10. Each option will change player attrs, usually more than one attr, where there can be plus or minus change. but the total change in most cases should be +1.
6. see [.github/tasks/game-design/] for details about player attributes.
7. after answering the last question, there is an out-tro narrative text, and player click anywhere to proceed to summary screen when the text rendering is finished.
8. in the summary screen, show player attributes while highlights changes. *Do not use type-in renderer in summary screen*. player click anywhere to proceed to next level.
9. the level has a cover screen with the level name: "序章.惊梦", and the picture chapter0.png. Play chapter0.mp3 and repeat for the level.