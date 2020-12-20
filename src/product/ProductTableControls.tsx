import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Button, Grid, Input } from 'semantic-ui-react';
import TimeAgo from 'javascript-time-ago';
import { fetchProducts } from '../stores/product/actionCreators';
import { countProducts, sortColumn } from '../stores/product/selectors';
import ResourceStatus from '../stores/resourceStatus';
import { RootState } from '../stores/store';

interface Props {
  status: ResourceStatus;
  count: number;
  column: string;
  lastUpdated: Date;

  refresh: () => void;
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
    <Grid columns={2}>
      <Grid.Column style={{ paddingTop: 0, paddingBottom: '0.5em' }} verticalAlign="middle">
        <p>
          {`${props.count} item(s) \u00b7
            sorted on ${props.column} \u00b7
            updated ${timeAgo.format(props.lastUpdated)}`}
        </p>
      </Grid.Column>
      <Grid.Column style={{ paddingTop: 0, paddingBottom: '0.5em' }} verticalAlign="middle">
        <Button
          icon="refresh"
          floated="right"
          onClick={props.refresh}
          loading={props.status === ResourceStatus.FETCHING}
        />
        <div style={{ float: 'right' }}>
          <Input icon="search" iconPosition="left" placeholder="Search..." />
        </div>
      </Grid.Column>
    </Grid>
  );
}

const mapStateToProps = (state: RootState) => ({
  status: state.product.listStatus,
  count: countProducts(state),
  column: sortColumn(state),
  lastUpdated: state.product.listLastUpdated,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  refresh: () => dispatch(fetchProducts()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductTableControls);
