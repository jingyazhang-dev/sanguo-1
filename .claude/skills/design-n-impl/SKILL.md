---
name: design-n-impl
description: Guide for design and implementsoftware system or modules
---

To design and implement software systems or modules, follow this process:

1. Use ``design`` skill to create the design for the software system or module. Use $0 as the parameter for the ``design`` skill, to provide the necessary input for the design process.
2. When design is complete, provide user two options: approve or feedback and let user select. If the user approves, proceed to step 3. If the user selects feedback, go back to step 1 with user's feedback.
3. Use ``impl`` skill to implement the software system or module based on the design. Use $0 as the parameter for the ``impl`` skill, to provide the necessary input for the implementation process.
4. Ask an art director agent to review the UI design of the implementation using the ``ui-review`` skill, if the software system or module has a user interface component. Fix issues in the implementation based on the feedback from the art director agent.
5. When implementation is complete, provide user two options: approve or feedback and let user select. If the user approves, you can conclude the process. If the user selects feedback , go back to step 1 with user's feedback.