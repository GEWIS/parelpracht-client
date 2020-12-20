import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Button, Grid, Input } from 'semantic-ui-react';
import { fetchProducts } from '../stores/product/actionCreators';
import { countProducts } from '../stores/product/selectors';
import ResourceStatus from '../stores/resourceStatus';
import { RootState } from '../stores/store';

interface Props {
  status: ResourceStatus;
  count: number;

  refresh: () => void;
}

function ProductTableControls(props: Props) {
  return (
    <Grid columns={2}>
      <Grid.Column style={{ paddingTop: 0, paddingBottom: '0.5em' }} verticalAlign="middle">
        <p>{`${props.count} item(s)`}</p>
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
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  refresh: () => dispatch(fetchProducts()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductTableControls);
