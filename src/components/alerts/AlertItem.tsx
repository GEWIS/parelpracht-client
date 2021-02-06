import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Message } from 'semantic-ui-react';
import { hideAlert } from '../../stores/alerts/actionCreators';
import { AlertItemState } from '../../stores/alerts/reducer';

interface Props {
  alert: AlertItemState;
  onHide: (id: string) => void;
}

function AlertItem(props: Props) {
  return (
    <Message
      onDismiss={() => props.onHide(props.alert.id)}
      error={props.alert.type === 'error'}
      success={props.alert.type === 'success'}
      info={props.alert.type === 'info'}
      warning={props.alert.type === 'warning'}
      style={{ zIndex: '3939' }}
    >
      <Message.Header>{props.alert.title}</Message.Header>
      {props.alert.message}
    </Message>
  );
}

const mapStateToProps = () => ({
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onHide: (id: string) => {
    dispatch(hideAlert(id));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AlertItem);
