import React, { Dispatch } from 'react';

const TITLE_UNDEFINED = 'ParelPracht';
const TITLE_TEMPLATE = '{} - ParelPracht';

type Title = string | undefined;

export interface ITitleContext {
  title: Title;
  setTitle: Dispatch<string>;
}

export const TitleContext = React.createContext<ITitleContext>({
  title: undefined,
  setTitle: () => null,
});

export const useTitle = () => React.useContext(TitleContext);

interface Props {
  children: any;
}

const TitleRenderer = ({ children }: Props) => {
  const [title, setTitle] = React.useState<Title>(undefined);

  React.useEffect(() => {
    if (title === undefined || title === '') {
      document.title = TITLE_UNDEFINED;
    } else {
      document.title = TITLE_TEMPLATE.replace('{}', title);
    }
  }, [title]);

  const titleContext = React.useMemo(() => ({
    title,
    setTitle,
  }), [title]);

  return (
    <TitleContext.Provider value={titleContext}>
      {children}
    </TitleContext.Provider>
  );
};

export default TitleRenderer;
