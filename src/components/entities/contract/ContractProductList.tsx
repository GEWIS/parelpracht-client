import React from 'react';
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Button, Icon, Loader, Table,
} from 'semantic-ui-react';
import _ from 'lodash';
import { withTranslation, WithTranslation } from 'react-i18next';
import ContractProductRow from './ContractProductRow';
import {
  ActivityType, Contract, ContractStatus, Roles, ValueAddedTax,
} from '../../../clients/server.generated';
import { formatPriceFull } from '../../../helpers/monetary';
import ContractInvoiceModal from '../../../pages/ContractInvoiceModal';
import AuthorizationComponent from '../../AuthorizationComponent';
import { getLastStatus } from '../../../helpers/activity';

interface Props extends RouteComponentProps, WithTranslation {
  contract: Contract;
}

interface State {
  selected: number[];
}

class ContractProductList extends React.Component<Props, State> {
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
      // eslint-disable-next-line react/no-did-update-set-state
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

  enumToVatAmount = (valueAddedTax: ValueAddedTax) => {
    switch (valueAddedTax) {
      case ValueAddedTax.LOW:
        return 1.09;
      case ValueAddedTax.HIGH:
        return 1.21;
      default:
        return 1;
    }
  };

  public render() {
    const { contract, t } = this.props;
    const { selected } = this.state;

    if (contract === undefined) {
      return (
        <Loader content="Loading" active />
      );
    }

    const contractStatus = getLastStatus(contract.activities
      .filter((a) => a.type === ActivityType.STATUS))?.subType;

    const { products } = contract;
    let priceSum = 0;
    let discountAmount = 0;
    let discountSum = 0;
    let priceSumVAT = 0;
    let lowVATsum = 0;
    let highVATsum = 0;

    products.forEach((p) => {
      priceSum += p.basePrice;
      discountSum += p.discount;
      if (p.discount !== 0) discountAmount++;

      const currentPrice = p.basePrice - p.discount;
      const currentPriceVAT = currentPrice * this.enumToVatAmount(p.product.valueAddedTax);
      priceSumVAT += currentPriceVAT;
      if (p.product.valueAddedTax === ValueAddedTax.LOW) {
        lowVATsum += currentPriceVAT - currentPrice;
      }
      if (p.product.valueAddedTax === ValueAddedTax.HIGH) {
        highVATsum += currentPriceVAT - currentPrice;
      }
    });

    const canChangeProducts = contractStatus === ContractStatus.CREATED
      || contractStatus === ContractStatus.PROPOSED
      || contractStatus === ContractStatus.SENT;

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
              to={`${this.props.location.pathname}/product/new`}
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
            {products.sort((a, b) => a.id - b.id).map((product) => (
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
                {formatPriceFull(discountSum)}
                {' '}
                (
                {discountAmount}
                )
                <br />
                <br />
                <br />
              </Table.HeaderCell>
              <Table.HeaderCell collapsing>
                {formatPriceFull(priceSum - discountSum)}
                <br />
                {formatPriceFull(lowVATsum)}
                <br />
                {formatPriceFull(highVATsum)}
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
              <Table.HeaderCell collapsing>
                {formatPriceFull(priceSumVAT)}
              </Table.HeaderCell>
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
