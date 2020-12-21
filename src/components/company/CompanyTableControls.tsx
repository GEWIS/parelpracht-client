import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import TimeAgo from 'javascript-time-ago';
import { fetchCompanies, searchCompanies } from '../../stores/company/actionCreators';
import { countFetchedCompanies, countTotalCompanies, sortColumn } from '../../stores/company/selectors';
import ResourceStatus from '../../stores/resourceStatus';
import { RootState } from '../../stores/store';
import TableControls from '../TableControls';

interface Props {
  status: ResourceStatus;
  countFetched: number;
  countTotal: number;
  column: string;
  lastUpdated: Date;
  search: string;

  refresh: () => void;
  setSearch: (search: string) => void;
}

function CompanyTableControls(props: Props) {
  return (
    <TableControls
      status={props.status}
      countFetched={props.countFetched}
      countTotal={props.countTotal}
      column={props.column}
      lastUpdated={props.lastUpdated}
      search={props.search}
      refresh={props.refresh}
      setSearch={props.setSearch}
    />
  );
}

const mapStateToProps = (state: RootState) => ({
  status: state.company.listStatus,
  countFetched: countFetchedCompanies(state),
  countTotal: countTotalCompanies(state),
  column: sortColumn(state),
  lastUpdated: state.company.listLastUpdated,
  search: state.company.listSearch,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  refresh: () => dispatch(fetchCompanies()),
  setSearch: (search: string) => {
    dispatch(searchCompanies(search));
    dispatch(fetchCompanies());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CompanyTableControls);
