import React from 'react';
import { connect } from 'react-redux';
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Button, Icon, Loader,
} from 'semantic-ui-react';
import ContractProductComponent from './ContractProductComponent';
import { Contract } from '../../clients/server.generated';
import { getSingle } from '../../stores/single/selectors';
import { SingleEntities } from '../../stores/single/single';
import { RootState } from '../../stores/store';

interface Props extends RouteComponentProps {
  contract: Contract | undefined;
}

interface State {

}

class ProductList extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);
  }

  public render() {
    const { contract } = this.props;

    if (contract === undefined) {
      return (
        <Loader content="Loading" active />
      );
    }

    const { products } = contract;
    return (
      <>
        <h3>
          Products
          <Button
            icon
            labelPosition="left"
            floated="right"
            style={{ marginTop: '-0.5em' }}
            basic
            as={NavLink}
            to={`${this.props.location.pathname}/product/new`}
          >
            <Icon name="plus" />
            Add Product
          </Button>
        </h3>
        {products.map((product) => (
          <ContractProductComponent key={product.id} productInstance={product} />
        ))}
      </>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    contract: getSingle<Contract>(state, SingleEntities.Contract).data,
    status: getSingle<Contract>(state, SingleEntities.Contract).status,
  };
};

const mapDispatchToProps = () => ({
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProductList));
