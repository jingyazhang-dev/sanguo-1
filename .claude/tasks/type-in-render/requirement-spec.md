# Requirement Spec for Type-In Renderer

Type-in renderer is a React component, which renders scripts in a way that simulates typing.

## Functional Requirements
1. Type-in renderer can render two kinds of data, called "TextNode" and "ChoiceNode".
2. TextNode is text with html-like tags. When rendering TextNode, type-in renderer simulates the typing effect and output the characters one by one. Following rendering features should be supported:
    - render some text in special style to emphasize the importance. dedicated tags may need to be defined.
    - the global rendering speed can be adjusted, for example fast, normal, low.
    - some text can be rendered in custom speed, using tags to control it.
3. ChoiceNode is a menu, with one or more choices. It should be rendered as inline menu, meaning that the style should not be quite different from the text. When rendering ChoiceNode, it should be displayed as a whole without type-in effect.
4. The content to be rendered by the component is dynamic, meaning that new content can be added at any time, and get rendered when the rendering flow reaches it.

## Non-functional Requirements
1. The type-in renderer will evolve with adding more features, so maintainability is extremely important.
2. Preferably the content to be rendered can be managed by function calls, for example append(), reset().