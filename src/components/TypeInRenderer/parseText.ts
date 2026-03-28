import type { SpeedLevel, TextSegment } from './types';

interface ParseState {
  emphasis: boolean;
  speed?: SpeedLevel;
}

/**
 * Parses a TextNode content string with custom tags into an array of TextSegments.
 *
 * Supported tags (non-nestable, applied linearly):
 *   <em>          – start emphasis
 *   </em>         – end emphasis
 *   <speed fast|normal|slow>  – start speed override
 *   </speed>      – end speed override
 *
 * Unknown or malformed tags are treated as literal text.
 */
export function parseText(content: string): TextSegment[] {
  const segments: TextSegment[] = [];
  let pos = 0;
  let state: ParseState = { emphasis: false };
  let buffer = '';

  const flush = () => {
    if (buffer.length > 0) {
      segments.push({ text: buffer, emphasis: state.emphasis, speed: state.speed });
      buffer = '';
    }
  };

  while (pos < content.length) {
    if (content[pos] !== '<') {
      buffer += content[pos++];
      continue;
    }

    const tagEnd = content.indexOf('>', pos);
    if (tagEnd === -1) {
      // No closing '>' – treat remainder as literal text
      buffer += content.slice(pos);
      break;
    }

    const tagContent = content.slice(pos + 1, tagEnd).trim().toLowerCase();
    const speedMatch = tagContent.match(/^speed\s+(fast|normal|slow)$/);

    if (tagContent === 'em') {
      flush();
      state = { ...state, emphasis: true };
    } else if (tagContent === '/em') {
      flush();
      state = { ...state, emphasis: false };
    } else if (tagContent === '/speed') {
      flush();
      state = { ...state, speed: undefined };
    } else if (speedMatch) {
      flush();
      state = { ...state, speed: speedMatch[1] as SpeedLevel };
    } else {
      // Unknown or malformed tag – emit as literal text
      buffer += content.slice(pos, tagEnd + 1);
    }

    pos = tagEnd + 1;
  }

  flush();
  return segments;
}
