import React, { ChangeEvent } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
  Checkbox, Form, Input, Label,
} from 'semantic-ui-react';
import { useTranslation, withTranslation, WithTranslation } from 'react-i18next';
import validator from 'validator';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Product, ProductParams, ProductStatus, Roles,
} from '../../../clients/server.generated';
import ProductCategorySelector from '../productcategories/ProductCategorySelector';
import { formatPrice } from '../../../helpers/monetary';
import ResourceStatus from '../../../stores/resourceStatus';
import { createSingle, deleteSingle, saveSingle } from '../../../stores/single/actionCreators';
import { getSingle } from '../../../stores/single/selectors';
import { SingleEntities } from '../../../stores/single/single';
import { RootState } from '../../../stores/store';
import PropsButtons from '../../PropsButtons';
import { TransientAlert } from '../../../stores/alerts/actions';
import { showTransientAlert } from '../../../stores/alerts/actionCreators';
import CreatePricing from '../../productpricing/CreatePricing';
import AuthorizationComponent from '../../AuthorizationComponent';
import TextArea from '../../TextArea';

interface Props extends WithTranslation, RouteComponentProps {
  create?: boolean;
  onCancel?: () => void;

  product: Product;
  productPricingActive?: boolean;
  status: ResourceStatus;

  saveProduct: (id: number, product: ProductParams) => void;
  createProduct: (product: ProductParams) => void;
  deleteProduct: (id: number) => void;
  showTransientAlert: (alert: TransientAlert) => void;
}

interface State {
  editing: boolean;

  nameDutch: string;
  nameEnglish: string;
  targetPrice: string;
  status: ProductStatus;
  description: string;
  categoryId: number;
  contractTextDutch: string;
  contractTextEnglish: string;
  deliverySpecDutch: string | undefined;
  deliverySpecEnglish: string | undefined;
  minTarget: number;
  maxTarget: number;
}

class ProductProps extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);

    this.state = {
      editing: props.create ?? false,
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
    const { product } = props;
    return {
      nameDutch: product.nameDutch,
      nameEnglish: product.nameEnglish,
      targetPrice: formatPrice(product.targetPrice),
      status: product.status,
      description: product.description,
      categoryId: product.categoryId,
      contractTextDutch: product.contractTextDutch,
      contractTextEnglish: product.contractTextEnglish,
      deliverySpecDutch: product.deliverySpecificationDutch,
      deliverySpecEnglish: product.deliverySpecificationEnglish,
      minTarget: product.minTarget,
      maxTarget: product.maxTarget,
    };
  };

  toParams = (): ProductParams => {
    return new ProductParams({
      nameDutch: this.state.nameDutch,
      nameEnglish: this.state.nameEnglish,
      status: this.state.status,
      description: this.state.description,
      categoryId: this.state.categoryId,
      contractTextDutch: this.state.contractTextDutch,
      contractTextEnglish: this.state.contractTextEnglish,
      deliverySpecificationEnglish: this.state.deliverySpecEnglish,
      deliverySpecificationDutch: this.state.deliverySpecDutch,
      minTarget: this.state.minTarget,
      maxTarget: this.state.maxTarget,
      targetPrice: Math.round(Number.parseFloat(this.state.targetPrice.replace(',', '')) * 100),
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
      this.props.createProduct(this.toParams());
    } else {
      this.props.saveProduct(this.props.product.id, this.toParams());
    }
  };

  remove = () => {
    if (!this.props.create && this.props.deleteProduct) {
      this.props.history.push('/product');
      this.props.deleteProduct(this.props.product.id);
    }
  };

  propsHaveErrors = (): boolean => {
    const {
      nameDutch, nameEnglish, categoryId, targetPrice, minTarget, maxTarget,
      contractTextDutch, contractTextEnglish,
    } = this.state;
    return (validator.isEmpty(nameDutch)
      || validator.isEmpty(nameEnglish)
      || categoryId < 0
      || (parseFloat(targetPrice.replace(',', '.')) <= 0 || Number.isNaN(parseFloat(targetPrice.replace(',', '.'))))
      || (minTarget !== undefined ? minTarget < 0 : false)
      || maxTarget < (minTarget || 0)
      || validator.isEmpty(contractTextDutch)
      || validator.isEmpty(contractTextEnglish)
    );
  };

  deleteButtonActive = () => {
    if (this.props.create) {
      return undefined;
    }
    return !(this.props.product.instances.length > 0
      || this.props.product.files.length > 0);
  };

  render() {
    const {
      editing,
      nameDutch,
      nameEnglish,
      targetPrice,
      status,
      description,
      categoryId,
      contractTextDutch,
      contractTextEnglish,
      deliverySpecDutch,
      deliverySpecEnglish,
      minTarget,
      maxTarget,
    } = this.state;
    const { t } = this.props;

    return (
      <>
        <h2>
          {this.props.create ? 'New Product' : 'Details'}

          <PropsButtons
            editing={editing}
            canEdit
            canDelete={this.deleteButtonActive()}
            canSave={!this.propsHaveErrors()}
            entity={SingleEntities.Product}
            status={this.props.status}
            cancel={this.cancel}
            edit={this.edit}
            save={this.save}
            remove={this.remove}
          />
        </h2>

        <Form style={{ marginTop: '2em' }}>
          <Form.Group widths="equal">
            <Form.Field
              disabled={!editing}
              required
              id="form-input-dutch-name"
              fluid
              control={Input}
              label={t('products.props.nameNl')}
              placeholder={t('products.props.nameNl')}
              value={nameDutch}
              onChange={(e: ChangeEvent<HTMLInputElement>) => this.setState({
                nameDutch: e.target.value,
              })}
              error={
                validator.isEmpty(nameDutch)
              }
            />
            <Form.Field
              disabled={!editing}
              required
              fluid
              id="form-input-english-name"
              control={Input}
              label={t('products.props.nameEn')}
              placeholder={t('products.props.nameEn')}
              value={nameEnglish}
              onChange={(e: ChangeEvent<HTMLInputElement>) => this.setState({
                nameEnglish: e.target.value,
              })}
              error={
                validator.isEmpty(nameEnglish)
              }
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              disabled={!editing}
              required
            >
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor="form-input-category">
                {t('products.props.category')}
              </label>
              <ProductCategorySelector
                id="form-input-category"
                value={categoryId}
                onChange={(val: number) => {
                  this.setState({
                    categoryId: val,
                  });
                }}
              />
            </Form.Field>
            <Form.Field
              disabled={!editing}
            >
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor="form-check-status">
                {t('products.props.status.header')}
              </label>
              <Checkbox
                toggle
                id="form-check-status"
                label={status === ProductStatus.ACTIVE ? t('products.props.status.active') : t('products.props.status.inactive')}
                checked={status === ProductStatus.ACTIVE}
                onChange={(_, data) => this.setState({
                  status:
                    data.checked ? ProductStatus.ACTIVE : ProductStatus.INACTIVE,
                })}
              />
            </Form.Field>
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              disabled={!editing}
              required
              error={parseFloat(targetPrice.replace(',', '.')) <= 0 || Number.isNaN(parseFloat(targetPrice.replace(',', '.')))}
            >
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor="form-input-target-price">
                {t('products.props.price')}
              </label>
              <Input
                labelPosition="left"
                id="form-input-target-price"
                value={targetPrice}
                onChange={(e) => this.setState({ targetPrice: e.target.value })}
                fluid
              >
                <Label basic>€</Label>
                <input />
              </Input>
            </Form.Field>
            {this.props.productPricingActive ? (
              <AuthorizationComponent roles={[Roles.ADMIN]} notFound={false}>
                <Form.Field
                  disabled={!editing}
                >
                  {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                  <label htmlFor="form-check-status">
                    {t('products.props.customPrice')}
                  </label>
                  <CreatePricing productId={this.props.product.id} />
                </Form.Field>
              </AuthorizationComponent>
            ) : null }
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              disabled={!editing}
              error={minTarget !== undefined ? minTarget < 0 : false}
            >
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor="form-input-minimal-target">
                {t('products.props.minTarget')}
              </label>
              <Input
                id="form-input-minimal-target"
                type="number"
                placeholder="Minimal target"
                value={minTarget}
                fluid
                onChange={(e: ChangeEvent<HTMLInputElement>) => this.setState({
                  minTarget: e.target.value as any as number,
                })}
              />
            </Form.Field>
            <Form.Field
              disabled={!editing}
              error={maxTarget < (minTarget || 0)}
            >
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor="form-input-maximum-target">
                {t('products.props.maxTarget')}
              </label>
              <Input
                id="form-input-maximum-target"
                type="number"
                placeholder="Maximum target"
                value={maxTarget}
                fluid
                onChange={(e: ChangeEvent<HTMLInputElement>) => this.setState({
                  maxTarget: e.target.value as any as number,
                })}
              />
            </Form.Field>
          </Form.Group>
          <Form.Field disabled={!editing}>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="form-input-description">
              {t('products.props.comments')}
            </label>
            <TextArea
              id="form-input-description"
              value={description}
              onChange={(e) => this.setState({ description: e.target.value })}
              placeholder="Internal comments"
            />
          </Form.Field>
          <Form.Field required error={validator.isEmpty(contractTextDutch)} disabled={!editing}>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="form-input-contract-text-dutch">
              {t('products.props.contractTextNl')}
            </label>
            <TextArea
              id="form-input-contract-text-dutch"
              value={contractTextDutch}
              onChange={
                (e) => this.setState({ contractTextDutch: e.target.value })
              }
              placeholder="Contract text in Dutch"
            />
          </Form.Field>
          <Form.Field required error={validator.isEmpty(contractTextEnglish)} disabled={!editing}>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="form-input-contract-text-english">
              {t('products.props.contractTextEn')}
            </label>
            <TextArea
              id="form-input-contract-text-english"
              value={contractTextEnglish}
              onChange={
                (e) => this.setState({ contractTextEnglish: e.target.value })
              }
              placeholder="Contract text in English"
            />
          </Form.Field>
          <Form.Field disabled={!editing}>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="form-input-delivery-spec-dutch">
              {t('products.props.specsNl')}
            </label>
            <TextArea
              id="form-input-delivery-spec-dutch"
              value={deliverySpecDutch}
              onChange={
                (e) => this.setState({ deliverySpecDutch: e.target.value })
              }
              placeholder="Delivery specifications in Dutch"
            />
          </Form.Field>
          <Form.Field disabled={!editing}>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="form-input-delivery-spec-english">
              {t('products.props.specsEn')}
            </label>
            <TextArea
              id="form-delivery-spec-english"
              value={deliverySpecEnglish}
              onChange={
                (e) => this.setState({ deliverySpecEnglish: e.target.value })
              }
              placeholder="Delivery specifications in English"
            />
          </Form.Field>
        </Form>
      </>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    status: getSingle<Product>(state, SingleEntities.Product).status,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  saveProduct: (id: number, product: ProductParams) => dispatch(
    saveSingle(SingleEntities.Product, id, product),
  ),
  createProduct: (product: ProductParams) => dispatch(
    createSingle(SingleEntities.Product, product),
  ),
  deleteProduct: (id: number) => dispatch(
    deleteSingle(SingleEntities.Product, id),
  ),
  showTransientAlert: (alert: TransientAlert) => dispatch(showTransientAlert(alert)),
});

export default withTranslation()(
  withRouter(connect(mapStateToProps, mapDispatchToProps)(ProductProps)),
);
