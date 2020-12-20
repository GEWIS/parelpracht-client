import React from 'react';
import { connect } from 'react-redux';
import { Container, Rail } from 'semantic-ui-react';
import { AlertItemState } from '../../stores/alerts/reducer';
import { RootState } from '../../stores/store';
import AlertItem from './AlertItem';
import './AlertContainer.scss';

interface AlertsProps {
  internal?: boolean;
  alerts: AlertItemState[];
}

class AlertContainer extends React.Component<AlertsProps> {
  public render() {
    return (
      <Rail internal={this.props.internal} position="right">
        {this.props.alerts.map((alert) => (
          <AlertItem
            key={alert.id}
            alert={alert}
          />
        ))}
      </Rail>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  alerts: state.alerts,
});

export default connect(mapStateToProps)(AlertContainer);
