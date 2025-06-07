import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Button, Icon, Loader, Table } from 'semantic-ui-react';
import _ from 'lodash';
import { withTranslation, WithTranslation } from 'react-i18next';
import { ActivityType, Contract, ContractStatus, Roles, VAT } from '../../../clients/server.generated';
import { formatPriceFull } from '../../../helpers/monetary';
import ContractInvoiceModal from '../../../pages/ContractInvoiceModal';
import AuthorizationComponent from '../../AuthorizationComponent';
import { getLastStatus } from '../../../helpers/activity';
import { WithRouter, withRouter } from '../../../WithRouter';
import ContractProductRow from './ContractProductRow';

interface Props extends WithTranslation, WithRouter {
  contract: Contract;
}

interface State {
  selected: number[];
}

class ContractProductList extends Component<Props, State> {
  public constructor(props: Props) {
    super(props);

    this.state = {
      selected: [],
    };
  }

  componentDidUpdate(prevProps: Readonly<Props>) {
    if (prevProps.contract.products.length > this.props.contract.products.length) {
      // The following operation is safe, because we only change the state if one
      // of the products has been removed. We do this check on the props and not
      // on the state, so there is no infinite loop.

      this.setState({ selected: [] });
    }
  }

  clearSelection = () => {
    this.setState({ selected: [] });
  };

  selectProduct = (id: number) => {
    const { selected } = this.state;
    this.setState({ selected: _.xor(selected, [id]) });
  };

  public render() {
    const { contract, t } = this.props;
    const { selected } = this.state;
    const { location } = this.props.router;

    if (contract === undefined) {
      return <Loader content="Loading" active />;
    }

    const contractStatus = getLastStatus(contract.activities.filter((a) => a.type === ActivityType.STATUS))?.subType;

    const { products } = contract;
    let totalPriceNoVat = 0;
    let discountValue = 0;
    let totalPriceWithVat = 0;
    let totalLowVatValue = 0;
    let totalHighVatValue = 0;

    products.forEach((p) => {
      totalPriceNoVat += p.basePrice;
      discountValue += p.discount;

      const currentPrice = p.basePrice - p.discount;
      const currentPriceVAT = currentPrice * (p.product.valueAddedTax.amount / 100 + 1);
      totalPriceWithVat += currentPriceVAT;
      if (p.product.valueAddedTax.category === VAT.LOW) {
        totalLowVatValue += currentPriceVAT - currentPrice;
      }
      if (p.product.valueAddedTax.category === VAT.HIGH) {
        totalHighVatValue += currentPriceVAT - currentPrice;
      }
    });

    const canChangeProducts =
      contractStatus === ContractStatus.CREATED ||
      contractStatus === ContractStatus.PROPOSED ||
      contractStatus === ContractStatus.SENT;

    return (
      <>
        <h3>
          {t('entity.productinstances')}
          <AuthorizationComponent roles={[Roles.GENERAL, Roles.ADMIN]} notFound={false}>
            <Button
              icon
              labelPosition="left"
              floated="right"
              style={{ marginTop: '-0.5em' }}
              basic
              as={NavLink}
              to={`${location.pathname}/product/new`}
              disabled={!canChangeProducts}
            >
              <Icon name="plus" />
              {t('pages.contract.products.addProduct')}
            </Button>
            <ContractInvoiceModal
              contract={contract}
              productInstanceIds={selected}
              clearSelection={this.clearSelection}
            />
          </AuthorizationComponent>
        </h3>
        <Table compact unstackable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell />
              <Table.HeaderCell>{t('entity.productinstance')}</Table.HeaderCell>
              <Table.HeaderCell collapsing>{t('entities.productInstance.props.discount')}</Table.HeaderCell>
              <Table.HeaderCell collapsing>{t('entities.productInstance.props.realPrice')}</Table.HeaderCell>
              <Table.HeaderCell collapsing>{t('entities.generalProps.status')}</Table.HeaderCell>
              <Table.HeaderCell collapsing>{t('entity.invoice')}</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {[...products]
              .sort((a, b) => a.id - b.id)
              .map((product) => (
                <ContractProductRow
                  key={product.id}
                  productInstance={product}
                  selectFunction={this.selectProduct}
                  selected={selected.includes(product.id)}
                />
              ))}
          </Table.Body>
          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell />
              <Table.HeaderCell>
                <b>{t('entities.productInstance.props.realPriceNoVat')}</b>
                <br />
                <b>{t('entities.productInstance.props.priceLowVat')}</b>
                <br />
                <b>{t('entities.productInstance.props.priceHighVat')}</b>
              </Table.HeaderCell>
              <Table.HeaderCell singleLine collapsing>
                {formatPriceFull(discountValue)}
                <br />
                <br />
                <br />
              </Table.HeaderCell>
              <Table.HeaderCell collapsing>
                {formatPriceFull(totalPriceNoVat - discountValue)}
                <br />
                {formatPriceFull(totalLowVatValue)}
                <br />
                {formatPriceFull(totalHighVatValue)}
              </Table.HeaderCell>
              <Table.HeaderCell />
              <Table.HeaderCell />
            </Table.Row>
            <Table.Row>
              <Table.HeaderCell />
              <Table.HeaderCell>
                <b>{t('entities.productInstance.props.realPriceWithVat')}</b>
              </Table.HeaderCell>
              <Table.HeaderCell />
              <Table.HeaderCell collapsing>{formatPriceFull(totalPriceWithVat)}</Table.HeaderCell>
              <Table.HeaderCell />
              <Table.HeaderCell />
            </Table.Row>
          </Table.Footer>
        </Table>
      </>
    );
  }
}

export default withTranslation()(withRouter(ContractProductList));
