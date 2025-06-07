/* eslint no-trailing-spaces: 0 */
import { Component } from "react";
import { connect } from 'react-redux';
import { Rail } from 'semantic-ui-react';
import { AlertItemState } from '../../stores/alerts/reducer';
import { RootState } from '../../stores/store';
import AlertItem from './AlertItem';
import './AlertContainer.scss';

interface AlertsProps {
  internal?: boolean;
  alerts: AlertItemState[];
}

class AlertContainer extends Component<AlertsProps> {
  static defaultProps = {
    internal: undefined,
  };

  public render() {
    return (
      <Rail
          internal={this.props.internal}
          position="right"
          style={{ marginTop: this.props.internal ? '2em' : undefined, height: 'auto', maxHeight: 'calc(100% - 2em)' }}
      >
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
