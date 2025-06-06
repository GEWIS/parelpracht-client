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

      {...props}
    />
  );
};

export default ConfirmationDialog;
