---
name: issue-fix
description: Guide for fixing a list of issues in game software
---

This skill is used by a developer agent to fix issues in game software. The issues can be bugs, or change requests. Each issue should have a clear description.
To fix issues follow this process:
1. Read the issue report in directory $0 to understand the issue and its context. If the issue report is not clear, ask the user questions to clarify the issue and its context.
2. If you are not perfectly sure about the issues, ask the user questions one by one. You do not make assumptions.
3. Fix the issues one by one, and ask another agent with the role of tech-reviewer to use ``code-review`` skill to review the fixes. If the tech-reviewer has any feedback about the fixes, update the fixes based on the feedback, and repeat step 3 until the tech-reviewer confirms the fixes.