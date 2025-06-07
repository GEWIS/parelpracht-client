import { createContext, Dispatch, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';

const TITLE_UNDEFINED = 'ParelPracht';
const TITLE_TEMPLATE = '{} - ParelPracht';

type Title = string | undefined;

export interface ITitleContext {
  title: Title;
  setTitle: Dispatch<string>;
}

export const TitleContext = createContext<ITitleContext>({
  title: undefined,
  setTitle: () => null,
});

export const useTitle = () => useContext(TitleContext);

const TitleRenderer = ({ children }: PropsWithChildren) => {
  const [title, setTitle] = useState<Title>(undefined);

  useEffect(() => {
    if (title === undefined || title === '') {
      document.title = TITLE_UNDEFINED;
    } else {
      document.title = TITLE_TEMPLATE.replace('{}', title);
    }
  }, [title]);

  const titleContext = useMemo(
    () => ({
      title,
      setTitle,
    }),
    [title],
  );

  return <TitleContext.Provider value={titleContext}>{children}</TitleContext.Provider>;
};

export default TitleRenderer;
