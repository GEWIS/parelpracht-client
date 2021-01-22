import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Button, Grid, Header, Icon, Segment,
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import { ProductInstance } from '../../clients/server.generated';
import './ContractComponent.scss';
import { RootState } from '../../stores/store';
import { getProductName } from '../../stores/product/selectors';
import { formatPriceDiscount, formatPriceFull } from '../../helpers/monetary';

interface Props extends RouteComponentProps {
  productInstance: ProductInstance;

  productName: string;
}

class ContractProductComponent extends React.Component<Props> {
  public render() {
    const {
      productInstance, productName,
    } = this.props;
    return (
      <Segment.Group
        horizontal
        className="product-component"
        style={{ margin: 0, marginTop: '0.2em' }}
        onClick={() => {
          this.props.history.push(
            `${this.props.location.pathname}/product/${productInstance.id}`,
          );
        }}
      >
        <Segment
          as={Button}
          textAlign="left"
        >
          <Header>

            <Icon name="list alternate outline" size="large" />

            <Header.Content style={{ width: '100%' }}>
              <Grid columns={2}>
                <Grid.Column verticalAlign="middle">
                  {productName}
                </Grid.Column>
                <Grid.Column verticalAlign="middle">
                  <Header.Subheader>
                    <span style={{ float: 'right' }}>
                      {formatPriceFull(productInstance.basePrice - productInstance.discount)}
                    </span>
                    <br />
                    <span style={{ float: 'right' }}>
                      &nbsp;
                      {formatPriceDiscount(productInstance.discount)}
                    </span>
                  </Header.Subheader>
                </Grid.Column>
              </Grid>
            </Header.Content>

          </Header>
        </Segment>
        <Button
          attached="right"
          basic
          icon
          onClick={() => { }}
        >
          <Icon name="eye" />
        </Button>
      </Segment.Group>
    );
  }
}

const mapStateToProps = (state: RootState, props: { productInstance: ProductInstance }) => {
  return {
    productName: getProductName(state, props.productInstance.productId),
  };
};

export default withRouter(connect(mapStateToProps)(ContractProductComponent));
