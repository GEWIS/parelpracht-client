import React from 'react';
import {
  Button, Icon, Input, Modal,
} from 'semantic-ui-react';
import { withTranslation, WithTranslation } from 'react-i18next';

interface Props extends WithTranslation {
  header: string;
  description: string;
  button: string;

  inputField?: string;
  defaultInput?: string;

  onApprove: (parameter?: string) => Promise<void>;
  onCancel?: () => void;

  disabled: boolean;
}

interface State {
  open: boolean;
  loading: boolean;
  input: string;
}

class ConfirmationDialogWithParameter extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      open: false,
      loading: false,
      input: props.defaultInput ?? '',
    };
  }

  onClose = () => {
    this.setState({ open: false });
  };

  onApprove = async () => {
    const { onApprove, inputField } = this.props;
    const { input } = this.state;

    this.setState({ loading: true });
    await onApprove(inputField ? input : undefined);
    this.setState({ loading: false, open: false });
  };

  render() {
    const {
      header, description, button, t, disabled, inputField,
    } = this.props;
    const { open, loading, input } = this.state;
    return (
      <Modal
        trigger={(
          <Button disabled={disabled} style={{ marginBottom: '0.25rem' }}>
            {button}
          </Button>
        )}
        closeIcon
        open={open}
        size="tiny"
        basic
        onOpen={() => this.setState({ open: true })}
        onClose={this.onClose}
      >
        <Modal.Header>
          <p>{header}</p>
          {inputField ? (
            <Input
              error={input === ''}
              onChange={(event) => this.setState({ input: event.target.value })}
              fluid
              placeholder={inputField}
              value={input}
              size="mini"
            />
          ) : null}
        </Modal.Header>
        <Modal.Content>
          <p>{description}</p>
        </Modal.Content>
        <Modal.Actions>
          <Button color="red" onClick={this.onClose}>
            <Icon name="remove" />
            {' '}
            {t('buttons.cancel')}
          </Button>
          <Button
            color="green"
            onClick={this.onApprove}
            loading={loading}
            disabled={inputField !== undefined && input === ''}
          >
            <Icon name="checkmark" />
            {' '}
            {t('buttons.ok')}
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default withTranslation()(ConfirmationDialogWithParameter);
