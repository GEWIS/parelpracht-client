import * as React from 'react';
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Breadcrumb, Container, Grid, Loader, Segment, Tab,
} from 'semantic-ui-react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Product, Roles } from '../clients/server.generated';
import { RootState } from '../stores/store';
import ProductProps from '../components/product/ProductProps';
import ResourceStatus from '../stores/resourceStatus';
import ProductSummary from '../components/product/ProductSummary';
import { getSingle } from '../stores/single/selectors';
import { SingleEntities } from '../stores/single/single';
import { clearSingle, fetchSingle } from '../stores/single/actionCreators';
import ActivitiesList from '../components/activities/ActivitiesList';
import { GeneralActivity } from '../components/activities/GeneralActivity';
import { TransientAlert } from '../stores/alerts/actions';
import { showTransientAlert } from '../stores/alerts/actionCreators';
import FilesList from '../components/files/FilesList';
import ContractCompactTable from '../components/contract/ContractCompactTable';
import InvoiceCompactTable from '../components/invoice/InvoiceCompactTable';
import ProductsContractedGraph from '../components/product/ProductsContractedGraph';
import PricingTable from '../components/productpricing/PricingTable';
import CreatePricing from '../components/productpricing/CreatePricing';
import AuthorizationComponent from '../components/AuthorizationComponent';

interface Props extends RouteComponentProps<{ productId: string }> {
  product: Product | undefined;
  status: ResourceStatus;

  fetchProduct: (id: number) => void;
  clearProduct: () => void;
  showTransientAlert: (alert: TransientAlert) => void;
}

class SingleProductPage extends React.Component<Props> {
  componentDidMount() {
    const { productId } = this.props.match.params;

    this.props.clearProduct();
    this.props.fetchProduct(Number.parseInt(productId, 10));
  }

  componentDidUpdate(prevProps: Readonly<Props>) {
    if (this.props.status === ResourceStatus.EMPTY
      && prevProps.status === ResourceStatus.DELETING
    ) {
      this.props.history.push('/product');
      this.props.showTransientAlert({
        title: 'Success',
        message: `Product ${prevProps.product?.nameEnglish} successfully deleted`,
        type: 'success',
      });
    }
  }

  public render() {
    const { product, fetchProduct, status } = this.props;

    if (product === undefined) {
      return (
        <AuthorizationComponent roles={[Roles.GENERAL, Roles.ADMIN]} notFound>
          <Container style={{ paddingTop: '2em' }}>
            <Loader content="Loading" active />
          </Container>
        </AuthorizationComponent>
      );
    }

    const panes = [
      {
        menuItem: 'Contracts',
        render: () => (
          <Tab.Pane>
            <ContractCompactTable
              product={product}
            />
          </Tab.Pane>
        ),
      },
      {
        menuItem: 'Invoices',
        render: () => (
          <Tab.Pane>
            <InvoiceCompactTable
              product={product}
            />
          </Tab.Pane>
        ),
      },
      {
        menuItem: 'Files',
        render: () => (
          <Tab.Pane>
            <FilesList
              files={product.files}
              entityId={product.id}
              entity={SingleEntities.Product}
              fetchEntity={fetchProduct}
              status={status}
            />
          </Tab.Pane>
        ),
      },
      {
        menuItem: 'Activities',
        render: () => (
          <Tab.Pane>
            <ActivitiesList
              activities={product.activities as GeneralActivity[]}
              componentId={product.id}
              componentType={SingleEntities.Product}
              resourceStatus={status}
            />
          </Tab.Pane>
        ),
      },
      {
        menuItem: 'Insights',
        render: () => <ProductsContractedGraph product={product} />,
      },
    ];

    if (product.pricing !== undefined) {
      panes.push({
        menuItem: 'Pricing',
        render: () => (
          <Tab.Pane>
            <PricingTable pricing={product.pricing!} productId={product.id} />
          </Tab.Pane>
        ),
      });
    }

    return (
      <AuthorizationComponent roles={[Roles.GENERAL, Roles.ADMIN]} notFound>
        <Container style={{ paddingTop: '2em' }}>
          <Breadcrumb
            icon="right angle"
            sections={[
              { key: 'Products', content: <NavLink to="/product">Products</NavLink> },
              { key: 'Product', content: product.nameDutch, active: true },
            ]}
          />
          <ProductSummary product={product} />
          <Grid columns={2}>
            <Grid.Column width={10}>
              <Tab panes={panes} menu={{ pointing: true, inverted: true }} />
            </Grid.Column>
            <Grid.Column width={6}>
              <Segment secondary>
                <ProductProps product={product} />
              </Segment>
              {product.pricing === undefined ? (
                <Segment secondary>
                  <CreatePricing productId={product.id} />
                </Segment>
              ) : null }
            </Grid.Column>
          </Grid>
        </Container>
      </AuthorizationComponent>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    product: getSingle<Product>(state, SingleEntities.Product).data,
    status: getSingle<Product>(state, SingleEntities.Product).status,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchProduct: (id: number) => dispatch(fetchSingle(SingleEntities.Product, id)),
  clearProduct: () => dispatch(clearSingle(SingleEntities.Product)),
  showTransientAlert: (alert: TransientAlert) => dispatch(showTransientAlert(alert)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SingleProductPage));
