declare const require: {
  context(
    directory: string,
    useSubdirectories?: boolean,
    regExp?: RegExp
  ): {
    keys(): string[];
    <T>(id: string): T;
    <T>(id: string): T;
    resolve(id: string): string;
  };
};

const requireAll = (requireContext: any) => {
  return requireContext.keys().map(requireContext);
};

const BACKGROUNDS = requireAll(require.context("assets", false));

export const getBack = () => {
  return BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)];
};
