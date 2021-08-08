import React from 'react';
import { NavLink } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { RootState } from '../../../stores/store';
import { getContractTitle } from '../../../stores/contract/selectors';
import { formatStatus } from '../../../helpers/activity';
import './ContactLink.scss';
import { ContractStatus } from '../../../clients/server.generated';
import PartialCircle from '../../PartialCircle';

interface Props {
  id: number;
  showId: boolean;
  showName: boolean;

  contractTitle: string;
  status?: ContractStatus;
}

function ContractLink(props: Props) {
  const {
    id, showId, showName, contractTitle, status,
  } = props;

  let statusCircle;
  switch (status) {
    case undefined: break;
    case ContractStatus.CREATED:
      statusCircle = <PartialCircle endAngle={72} startAngle={0} />;
      break;
    case ContractStatus.PROPOSED:
      statusCircle = <PartialCircle endAngle={144} startAngle={0} />;
      break;
    case ContractStatus.SENT:
      statusCircle = <PartialCircle endAngle={216} startAngle={0} />;
      break;
    case ContractStatus.CONFIRMED:
      statusCircle = <PartialCircle endAngle={288} startAngle={0} />;
      break;
    case ContractStatus.FINISHED:
      statusCircle = <PartialCircle endAngle={359.99999} startAngle={0} fillColor="lightgreen" />;
      break;
    case ContractStatus.CANCELLED:
      statusCircle = <PartialCircle endAngle={359.99999} startAngle={0} fillColor="#ff6966" />;
      break;
    default:
      throw new TypeError(`Unknown contract status: ${status} from contract ${id}`);
  }

  return (
    <NavLink
      to={`/contract/${id}`}
      className="contact-link"
      title={`C${id} ${contractTitle}${status ? ` (${formatStatus(status)})` : ''}`}
    >
      <Icon name="file alternate" />
      {showId ? `C${id} ` : ''}
      {showName ? contractTitle : ''}
      { statusCircle }
    </NavLink>
  );
}

ContractLink.defaultProps = {
  status: undefined,
};

const mapStateToProps = (state: RootState, props: { id: number }) => {
  return {
    contractTitle: getContractTitle(state, props.id),
  };
};

export default connect(mapStateToProps)(ContractLink);
