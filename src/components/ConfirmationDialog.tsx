import React from 'react';
import ConfirmationDialogWithParameter from './tablefilters/ConfirmDialogWithParameter';

interface Props {
  header: string;
  description: string;
  button: string;

  onApprove: () => Promise<void>;
  onCancel?: () => void;

  disabled: boolean;
}

const ConfirmationDialog = (props: Props) => {
  return (
    <ConfirmationDialogWithParameter
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    />
  );
};

ConfirmationDialog.defaultProps = ({
  onCancel: undefined,
});

export default ConfirmationDialog;
