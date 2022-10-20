import React, { ChangeEvent } from 'react';
import { connect } from 'react-redux';
import { Form, Input, Label } from 'semantic-ui-react';
import { withTranslation, WithTranslation } from 'react-i18next';
import {
  ActivityType,
  Contract,
  ContractStatus,
  ProductInstance,
  ProductInstanceParams,
  ProductSummary,
  Roles, VATSummary,
} from '../../../clients/server.generated';
import ResourceStatus from '../../../stores/resourceStatus';
import { RootState } from '../../../stores/store';
import { getSummary } from '../../../stores/summaries/selectors';
import PropsButtons from '../../PropsButtons';
import ProductSelector from './ProductSelector';
import { SingleEntities } from '../../../stores/single/single';
import AuthorizationComponent from '../../AuthorizationComponent';
import { getLastStatus } from '../../../helpers/activity';
import { authedUserHasRole } from '../../../stores/auth/selectors';
import ProductLink from './ProductLink';
import { SummaryCollections } from '../../../stores/summaries/summaries';

interface Props extends WithTranslation {
  create?: boolean;
  onCancel?: () => void;

  contract: Contract;
  productInstance: ProductInstance;
  status: ResourceStatus;

  saveProductInstance: (productInstance: ProductInstanceParams) => void;
  createProductInstance: (productInstance: ProductInstanceParams) => void;
  removeProductInstance: () => void;

  getBasePrice: (id: number) => number;
  getValueAddedTax: (id: number) => number;
  hasRole: (role: Roles) => boolean;
}

interface State {
  editing: boolean;

  productId: number;
  valueAddedTax: string;
  basePrice: string;
  discount: string;
  details?: string;
}

class ProductInstanceProps extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);

    this.state = {
      editing: props.create ?? false,
      valueAddedTax: props.productInstance.product
        ? props.productInstance.product.valueAddedTax.amount.toString() : '0',
      ...this.extractState(props),
    };
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.status === ResourceStatus.SAVING
      && this.props.status === ResourceStatus.FETCHED) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ editing: false });
    }
  }

  extractState = (props: Props) => {
    const { productInstance } = props;
    return {
      productId: productInstance.productId,
      basePrice: (productInstance.basePrice / 100).toString(),
      discount: (productInstance.discount / 100).toString(),
      details: productInstance.details,
    };
  };

  toParams = (): ProductInstanceParams => {
    return new ProductInstanceParams({
      productId: this.state.productId,
      basePrice: Math.round(parseFloat(this.state.basePrice.replace(',', '.')) * 100),
      discount: Math.round(parseFloat(this.state.discount.replace(',', '.')) * 100),
      details: this.state.details,
    });
  };

  edit = () => {
    this.setState({ editing: true, ...this.extractState(this.props) });
  };

  cancel = () => {
    if (!this.props.create) {
      this.setState({ editing: false, ...this.extractState(this.props) });
    } else if (this.props.onCancel) {
      this.props.onCancel();
    }
  };

  save = () => {
    if (this.props.create) {
      this.props.createProductInstance(this.toParams());
    } else {
      this.props.saveProductInstance(this.toParams());
    }
  };

  remove = () => {
    if (!this.props.create && this.props.removeProductInstance) {
      this.props.removeProductInstance();
    }
  };

  propsHaveErrors = (): boolean => {
    const { productId, basePrice, discount } = this.state;
    return (
      productId < 0
      || Number.isNaN(Math.round(parseFloat(basePrice.replace(',', '.')) * 100))
      || Number.isNaN(Math.round(parseFloat(discount.replace(',', '.')) * 100))
    );
  };

  deleteButtonActive = () => {
    if (this.props.create) {
      return undefined;
    }
    return !(this.props.contract.activities
      .filter((a) => a.type === ActivityType.STATUS).length > 1
      || this.props.productInstance.activities
        .filter((a) => a.type === ActivityType.STATUS).length > 1
      || this.props.productInstance.invoiceId === undefined);
  };

  editButtonActive = () => {
    if (this.props.hasRole(Roles.ADMIN)) {
      return true;
    }

    if (this.props.create) {
      return undefined;
    }
    const status = getLastStatus(this.props.contract.activities
      .filter((a) => a.type === ActivityType.STATUS));
    return !(status!.subType === ContractStatus.CONFIRMED
      || status!.subType === ContractStatus.FINISHED
      || status!.subType === ContractStatus.CANCELLED
      || this.props.productInstance.invoiceId !== undefined);
  };

  render() {
    const {
      editing,
      basePrice,
      discount,
      details,
      productId,
      valueAddedTax,
    } = this.state;
    const { productInstance, t } = this.props;
    let productNameElement = (
      <Form.Field>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label htmlFor="form-product-dropdown">{t('entity.product')}</label>
        <br />
        <ProductLink id={productId} />
      </Form.Field>
    );
    if (this.props.create) {
      productNameElement = (
        <Form.Field
          disabled={!editing || productInstance.id >= 0}
        >
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label htmlFor="form-product-dropdown">{t('entity.product')}</label>
          <ProductSelector
            id="form-product-dropdown"
            value={productId}
            onChange={(id: string) => {
              if (id === '') {
                this.setState({
                  productId: -1,
                  basePrice: '0',
                });
              } else {
                this.setState({
                  productId: parseInt(id, 10),
                  basePrice: (this.props.getBasePrice(parseInt(id, 10)) / 100).toString(),
                  valueAddedTax: (this.props.getValueAddedTax(parseInt(id, 10))).toString(),
                });
              }
            }}
            clearable
            fluid
          />
        </Form.Field>
      );
    }
    return (
      <>
        <h2>
          {this.props.create ? t('entities.productInstance.newProduct') : t('entities.details')}

          <AuthorizationComponent roles={[Roles.ADMIN, Roles.GENERAL]} notFound={false}>
            <PropsButtons
              editing={editing}
              canEdit={this.editButtonActive() || this.props.hasRole(Roles.ADMIN)}
              canDelete={this.deleteButtonActive()}
              canSave={!this.propsHaveErrors()}
              entity={SingleEntities.ProductInstance}
              status={this.props.status}
              cancel={this.cancel}
              edit={this.edit}
              save={this.save}
              remove={this.remove}
            />
          </AuthorizationComponent>
        </h2>

        <Form style={{ marginTop: '2em' }}>
          <Form.Group widths="equal">
            {productNameElement}
            <Form.Field disabled={!editing}>
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor="form-input-details">
                {t('entities.productInstance.props.details')}
              </label>
              <Input
                id="form-input-details"
                value={details}
                onChange={
                  (e) => this.setState({ details: e.target.value })
                }
                placeholder={t('entities.productInstance.props.details')}
                fluid
              />
            </Form.Field>
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              disabled={!editing}
              error={Number.isNaN(Math.round(parseFloat(this.state.basePrice.replace(',', '.')) * 100))}
              value={parseFloat(basePrice.replace(',', '.')).toFixed(2)}
            >
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor="form-input-base-price">
                {t('entities.productInstance.props.basePrice')}
              </label>
              <Input
                labelPosition="left"
                id="form-input-base-price"
                value={basePrice}
                onChange={(e: ChangeEvent<HTMLInputElement>) => this.setState({
                  basePrice: e.target.value,
                })}
                fluid
              >
                <Label basic>€</Label>
                <input />
              </Input>
            </Form.Field>
            <Form.Field
              disabled={!editing}
              error={Number.isNaN(Math.round(parseFloat(this.state.discount.replace(',', '.')) * 100))}
            >
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor="form-input-discount">
                {t('entities.productInstance.props.discount')}
              </label>
              <Input
                labelPosition="left"
                id="form-input-discount"
                value={discount}
                onChange={(e: ChangeEvent<HTMLInputElement>) => this.setState({
                  discount: e.target.value,
                })}
                fluid
              >
                <Label basic>€</Label>
                <input />
              </Input>
            </Form.Field>
            <Form.Field
              disabled={!editing}
            >
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor="form-input-value-added-tax">
                {t('entities.productInstance.props.valueAddedTax')}
              </label>
              <Input
                labelPosition="left"
                id="form-input-value-added-tax"
                value={valueAddedTax}
                fluid
              >
                <Label basic>%</Label>
                <input />
              </Input>
            </Form.Field>
            <Form.Field
              disabled={!editing}
            >
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor="form-input-real-price-no-vat">
                {t('entities.productInstance.props.realPriceNoVat')}
              </label>
              <Input
                labelPosition="left"
                id="form-input-real-price-no-vat"
                value={(parseFloat(basePrice.replace(',', '.')) - parseFloat(discount.replace(',', '.'))).toFixed(2)}
                fluid
              >
                <Label basic>€</Label>
                <input />
              </Input>
            </Form.Field>
            <Form.Field
              disabled={!editing}
            >
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor="form-input-real-price-with-vat">
                {t('entities.productInstance.props.realPriceWithVat')}
              </label>
              <Input
                labelPosition="left"
                id="form-input-real-price-with-vat"
                value={((parseFloat(basePrice.replace(',', '.')) - parseFloat(discount.replace(',', '.'))) * (parseFloat(valueAddedTax) / 100 + 1)).toFixed(2)}
                fluid
              >
                <Label basic>€</Label>
                <input />
              </Input>
            </Form.Field>
          </Form.Group>
        </Form>
      </>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  options: state.summaries.Products.options,
  hasRole: (role: Roles): boolean => authedUserHasRole(state, role),
  getBasePrice: (id: number) => getSummary<ProductSummary>(state,
    SummaryCollections.Products, id).targetPrice,
  getValueAddedTax: (id: number) => getSummary<VATSummary>(state,
    SummaryCollections.ValueAddedTax, getSummary<ProductSummary>(state,
      SummaryCollections.Products, id).vatId).amount,
});

export default withTranslation()(connect(mapStateToProps)(ProductInstanceProps));
