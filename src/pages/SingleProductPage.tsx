import * as React from 'react';
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Breadcrumb, Container, Grid, Loader, Segment, Tab,
} from 'semantic-ui-react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Product, Roles } from '../clients/server.generated';
import { RootState } from '../stores/store';
import ProductProps from '../components/entities/product/ProductProps';
import ResourceStatus from '../stores/resourceStatus';
import ProductSummary from '../components/entities/product/ProductSummary';
import { getSingle } from '../stores/single/selectors';
import { SingleEntities } from '../stores/single/single';
import { clearSingle, fetchSingle } from '../stores/single/actionCreators';
import ActivitiesList from '../components/activities/ActivitiesList';
import { GeneralActivity } from '../components/activities/GeneralActivity';
import { TransientAlert } from '../stores/alerts/actions';
import { showTransientAlert } from '../stores/alerts/actionCreators';
import FilesList from '../components/files/FilesList';
import ContractCompactTable from '../components/entities/contract/ContractCompactTable';
import InvoiceCompactTable from '../components/entities/invoice/InvoiceCompactTable';
import ProductsContractedGraph from '../components/entities/product/ProductsContractedGraph';
import PricingTable from '../components/productpricing/PricingTable';
import AuthorizationComponent from '../components/AuthorizationComponent';
import NotFound from './NotFound';
import { getLanguage } from '../localization';
import { TitleContext } from '../components/TitleContext';
import CreatePricing from '../components/productpricing/CreatePricing';

interface Props extends WithTranslation, RouteComponentProps<{ productId: string }> {
  product: Product | undefined;
  status: ResourceStatus;

  fetchProduct: (id: number) => void;
  clearProduct: () => void;
  showTransientAlert: (alert: TransientAlert) => void;
}

interface State {
  paneIndex: number;
}

class SingleProductPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const panes = this.getPanes();
    let { hash } = this.props.location;
    // If there is no hash, do not take the first (#) character
    if (hash.length > 0) {
      hash = hash.substr(1);
    }
    // Find the corresponding tab that has been selected
    let index = panes.findIndex((p) => p.menuItem.toLowerCase() === hash.toLowerCase());
    // If no parameter is given, or a parameter is given that does not exist,
    // select the first one by default
    if (index < 0) {
      index = 0;
      this.props.history.replace(`#${panes[0].menuItem.toLowerCase()}`);
    }

    this.state = {
      paneIndex: index,
    };
  }

  componentDidMount() {
    const { productId } = this.props.match.params;

    this.props.clearProduct();
    this.props.fetchProduct(Number.parseInt(productId, 10));
  }

  componentDidUpdate(prevProps: Readonly<Props>) {
    const { product, status, t } = this.props;

    if (product === undefined) {
      this.context.setTitle(t('entity.product'));
    } else if (getLanguage() === 'nl-NL') {
      this.context.setTitle(product.nameDutch);
    } else {
      this.context.setTitle(product.nameEnglish);
    }

    if (status === ResourceStatus.EMPTY
      && prevProps.status === ResourceStatus.DELETING
    ) {
      this.props.history.push('/product');
      this.props.showTransientAlert({
        title: 'Success',
        message: `Product ${prevProps.product?.nameEnglish} successfully deleted`,
        type: 'success',
        displayTimeInMs: 3000,
      });
    } else if (prevProps.status === ResourceStatus.SAVING
      && this.props.status === ResourceStatus.FETCHED) {
      this.props.showTransientAlert({
        title: 'Success',
        message: `Properties of ${this.props.product?.nameEnglish} successfully updated.`,
        type: 'success',
        displayTimeInMs: 3000,
      });
    }
  }

  getPanes = () => {
    const {
      t, product, fetchProduct, status,
    } = this.props;
    const panes = [
      {
        menuItem: t('entity.contracts'),
        render: product ? () => (
          <Tab.Pane>
            <ContractCompactTable
              product={product}
            />
          </Tab.Pane>
        ) : () => <Tab.Pane />,
      },
      {
        menuItem: t('entity.invoices'),
        render: product ? () => (
          <Tab.Pane>
            <InvoiceCompactTable
              product={product}
            />
          </Tab.Pane>
        ) : () => <Tab.Pane />,
      },
      {
        menuItem: t('entity.files'),
        render: product ? () => (
          <Tab.Pane>
            <FilesList
              files={product.files}
              entityId={product.id}
              entity={SingleEntities.Product}
              fetchEntity={fetchProduct}
              status={status}
            />
          </Tab.Pane>
        ) : () => <Tab.Pane />,
      },
      {
        menuItem: t('entity.activities'),
        render: product ? () => (
          <Tab.Pane>
            <ActivitiesList
              activities={product.activities as GeneralActivity[]}
              componentId={product.id}
              componentType={SingleEntities.Product}
              resourceStatus={status}
            />
          </Tab.Pane>
        ) : () => <Tab.Pane />,
      },
      {
        menuItem: t('entity.insights'),
        render: product ? () => <ProductsContractedGraph product={product} />
          : () => <Tab.Pane />,
      },
      {
        menuItem: t('entities.product.props.customPrice'),
        render: product ? () => (
          <Tab.Pane>
            {!product.pricing ? (
              <>
                <h3>
                  {t('entities.product.insights.header')}
                </h3>
                <AuthorizationComponent roles={[Roles.ADMIN]} notFound={false}>
                  {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                  <CreatePricing productId={product.id} />
                </AuthorizationComponent>
              </>
            ) : <PricingTable pricing={product.pricing!} productId={product.id} /> }
          </Tab.Pane>
        ) : () => <Tab.Pane />,
      },
    ];

    return panes;
  };

  public render() {
    const { product, status, t } = this.props;
    const { paneIndex } = this.state;
    const useDutch = getLanguage() === 'nl-NL';

    if (status === ResourceStatus.NOTFOUND) {
      return <NotFound />;
    }

    if (product === undefined) {
      return (
        <AuthorizationComponent roles={[Roles.GENERAL, Roles.ADMIN]} notFound>
          <Container style={{ paddingTop: '1em' }}>
            <Loader content="Loading" active />
          </Container>
        </AuthorizationComponent>
      );
    }

    const panes = this.getPanes();

    return (
      <AuthorizationComponent roles={[Roles.GENERAL, Roles.ADMIN]} notFound>
        <Segment style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }} vertical basic>
          <Container>
            <Breadcrumb
              icon="right angle"
              sections={[
                { key: 'Products', content: <NavLink to="/product">{t('entity.products')}</NavLink> },
                { key: 'Product', content: useDutch ? product.nameDutch : product.nameEnglish, active: true },
              ]}
            />
          </Container>
        </Segment>
        <Container style={{ marginTop: '1.25em' }}>
          <ProductSummary product={product} />
          <Grid columns={2} stackable>
            <Grid.Column width={10}>
              <Tab
                panes={panes}
                menu={{ pointing: true, inverted: true }}
                onTabChange={(e, data) => {
                  this.setState({ paneIndex: data.activeIndex! as number });
                  this.props.history.replace(`#${data.panes![data.activeIndex! as number].menuItem.toLowerCase()}`);
                }}
                activeIndex={paneIndex}
              />
            </Grid.Column>
            <Grid.Column width={6}>
              <Segment secondary style={{ backgroundColor: 'rgba(243, 244, 245, 0.98)' }}>
                <ProductProps
                  product={product}
                  productPricingActive={product.pricing === undefined}
                  canEdit={[Roles.ADMIN]}
                  canDelete={[Roles.ADMIN]}
                />
              </Segment>
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

SingleProductPage.contextType = TitleContext;

export default withTranslation()(
  withRouter(connect(mapStateToProps, mapDispatchToProps)(SingleProductPage)),
);
