import type { MDXComponents } from "mdx/types";

export const getMDXComponents = (components?: MDXComponents) => ({
  ...components,
});

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
