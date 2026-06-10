import get from 'lodash/get';
import set from 'lodash/set';
/**
 * `state.foo.bar` → capture `.foo.bar`, then lodash path is `foo.bar` (drop leading dot).
 * Aligns with Builder’s simple state getter shape (no bracket notation).
 */
const STATE_GETTER_REGEX = /^(?:return )?\s*state((?:\.\w+)+)\s*;?$/;

const PLACEHOLDER_REGEX = /{{([^}]+)}}/g;

const getStatePathFromExpression = (code: string): string | undefined => {
  const dotPath = STATE_GETTER_REGEX.exec(code.trim())?.[1];
  return dotPath ? dotPath.slice(1) : undefined; // "foo.bar", not ".foo.bar"
};

const evaluate = (
  expression: string,
  state: Record<string, unknown>,
  replaceFallback?: string
): unknown => {
  const path = getStatePathFromExpression(expression);
  return path ? get(state, path) ?? replaceFallback : replaceFallback;
};

const replaceBindings = (blocks, state, replaceFallback?: string) => {
  for (const block of blocks) {
    if (block.component) {
      if (block.bindings) {
        for (const binding in block.bindings) {
          // get only those options fields where we need to replace placeholders
          const expression = get(block, binding);
          const resolved = expression.replace(
            PLACEHOLDER_REGEX,
            (_match: string, group: string) =>
              evaluate(group, state, replaceFallback)
          );
          set(block, binding, resolved);
        }
        delete block.bindings;
      }
    }
    if (block.children) {
      replaceBindings(block.children, state, replaceFallback);
    }
  }
};

export const transformBuilderContent = (
  content: any,
  shouldTransform: boolean,
  customData?: Record<string, any>,
  replaceFallback?: string
) => {
  if (
    !shouldTransform ||
    !Array.isArray(content?.meta?.dataSources) ||
    content?.meta?.dataSources.length === 0 ||
    !content?.data?.blocks
  ) {
    return content;
  }

  // merge the custom data with the data in state
  content.data.state = {
    ...content.data.state,
    ...customData,
  };

  // iterate through the blocks array, where each block contains either children (an array of blocks) or a component with bindings
  // bindings are used to mark the fields with placeholders
  replaceBindings(content.data.blocks, content.data.state, replaceFallback);
  return content;
};
