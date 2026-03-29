---
name: impl
description: Guide for implement software system or modules based on the design
---

To implement software systems or modules based on the design, follow this process:

1. Understand the requirements and design by reading the requirement spec and design document provided as input in the directory $0.
2. Identify the issues that are not explained precisely in the requirement spec or design document, and ask the user questions about them to get a perfect understanding.
3. Implement the design, and ask another agent with the role of tech-reviewer to use ``code-review`` skill to review the implementation. You use $0 as the parameter for the ``code-review`` skill, to provide the necessary input for the review process. If the tech-reviewer points out issues, fix those you think make sense. If there are conflicting opinions from the tech-reviewer, ask the user to make the final decision.
4. When the implementation is approved by the reviewer, briefly present the implementation to the user.