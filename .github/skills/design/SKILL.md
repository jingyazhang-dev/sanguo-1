---
name: design
description: Guide for design software system or modules
---

To design software systems or modules, follow this process:

1. Understand the requirements by reading the requirement spec provided by the user in the directory $0.
2. Identify the issues that are not explained precisely in the requirement spec, and ask the user questions about them to get a perfect understanding.
3. Identify the key design decisions that need to be made, and ask the user questions about them to get confirmation about the design decisions.
4. Create the design, and ask another agent with the role of tech-reviewer to use ``design-review`` skill to review the design. You use $0 as the parameter for the ``design-review`` skill, to provide the necessary input for the review process. If the tech-reviewer points out issues, fix those you think make sense. If there are conflicting opinions from the tech-reviewer, ask the user to make the final decision.
5. When the design is approved by the reviewer, briefly present the design to the user.