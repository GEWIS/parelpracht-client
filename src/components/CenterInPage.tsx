import { PropsWithChildren } from "react";

type Props = PropsWithChildren

function CenterInPage(props: Props) {
  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      <div style={{ width: '350px' }}>
        {props.children}
      </div>
    </div>
  );
}

export default CenterInPage;
