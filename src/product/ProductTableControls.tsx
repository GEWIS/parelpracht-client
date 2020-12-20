import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import TimeAgo from 'javascript-time-ago';
import { fetchProducts, searchProducts } from '../stores/product/actionCreators';
import { countFetchedProducts, countTotalProducts, sortColumn } from '../stores/product/selectors';
import ResourceStatus from '../stores/resourceStatus';
import { RootState } from '../stores/store';
import TableControls from '../components/TableControls';

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

function ProductTableControls(props: Props) {
  // Make sure the component refreshes every minute to update "updated ..."
  const [, setTime] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 60 * 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const timeAgo = new TimeAgo();
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
  status: state.product.listStatus,
  countFetched: countFetchedProducts(state),
  countTotal: countTotalProducts(state),
  column: sortColumn(state),
  lastUpdated: state.product.listLastUpdated,
  search: state.product.listSearch,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  refresh: () => dispatch(fetchProducts()),
  setSearch: (search: string) => {
    dispatch(searchProducts(search));
    dispatch(fetchProducts());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductTableControls);
