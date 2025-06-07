import { ChangeEvent, Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Checkbox, Form, Input, Label } from 'semantic-ui-react';
import { withTranslation, WithTranslation } from 'react-i18next';
import validator from 'validator';
import {
  Client,
  PaginationParams,
  Product,
  ProductParams,
  ProductStatus,
  Roles,
} from '../../../clients/server.generated';
import ProductCategorySelector from '../productcategories/ProductCategorySelector';
import { formatPrice } from '../../../helpers/monetary';
import ResourceStatus from '../../../stores/resourceStatus';
import { createSingle, deleteSingle, saveSingle } from '../../../stores/single/actionCreators';
import { getSingle } from '../../../stores/single/selectors';
import { SingleEntities } from '../../../stores/single/single';
import { RootState } from '../../../stores/store';
import PropsButtons from '../../PropsButtons';
import TextArea from '../../TextArea';
import { authedUserHasRole } from '../../../stores/auth/selectors';
import { withRouter, WithRouter } from '../../../WithRouter';
import ProductVatSelector from './ProductVatSelector';

interface Props extends WithTranslation, WithRouter {
  create?: boolean;
  onCancel?: () => void;

  product: Product;
  status: ResourceStatus;

  hasRole: (role: Roles) => boolean;
  canEdit: Roles[];
  canDelete: Roles[];

  saveProduct: (id: number, product: ProductParams) => void;
  createProduct: (product: ProductParams) => void;
  deleteProduct: (id: number) => void;
}

interface State {
  editing: boolean;
  hasInstances: boolean;

  nameDutch: string;
  nameEnglish: string;
  targetPrice: string;
  status: ProductStatus;
  description: string;
  categoryId: number;
  vatId: number;
  contractTextDutch: string;
  contractTextEnglish: string;
  deliverySpecDutch: string | undefined;
  deliverySpecEnglish: string | undefined;
  minTarget: number;
  maxTarget: number;
}

class ProductProps extends Component<Props, State> {
  static defaultProps = {
    create: undefined,
    onCancel: undefined,
  };

  public constructor(props: Props) {
    super(props);

    this.state = {
      editing: props.create ?? false,
      hasInstances: false,
      ...this.extractState(props),
    };

    this.hasInstances();
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.status === ResourceStatus.SAVING && this.props.status === ResourceStatus.FETCHED) {
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
      vatId: product.vatId,
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
      vatId: this.state.vatId,
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
    const { navigate } = this.props.router;
    if (!this.props.create && this.props.deleteProduct) {
      navigate('/product');
      this.props.deleteProduct(this.props.product.id);
    }
  };

  propsHaveErrors = (): boolean => {
    const {
      nameDutch,
      nameEnglish,
      vatId,
      categoryId,
      targetPrice,
      minTarget,
      maxTarget,
      contractTextDutch,
      contractTextEnglish,
    } = this.state;
    return (
      validator.isEmpty(nameDutch) ||
      validator.isEmpty(nameEnglish) ||
      vatId < 0 ||
      categoryId < 0 ||
      parseFloat(targetPrice.replace(',', '.')) <= 0 ||
      Number.isNaN(parseFloat(targetPrice.replace(',', '.'))) ||
      (minTarget !== undefined ? minTarget < 0 : false) ||
      maxTarget < (minTarget || 0) ||
      validator.isEmpty(contractTextDutch) ||
      validator.isEmpty(contractTextEnglish)
    );
  };

  hasInstances = async () => {
    const client = new Client();
    const hasInstances =
      (
        await client.getProductContracts(
          this.props.product.id,
          new PaginationParams({
            skip: 0,
            take: 1,
          }),
        )
      ).list.length > 0;
    this.setState({ hasInstances });
  };

  deleteButtonActive = () => {
    if (this.props.create) {
      return undefined;
    }
    return !(this.state.hasInstances || this.props.product.files.length > 0);
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
      vatId,
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
          {this.props.create ? t('pages.product.newProduct') : t('entities.details')}

          <PropsButtons
            editing={editing}
            canEdit={this.props.canEdit.some(this.props.hasRole)}
            canDelete={this.deleteButtonActive() && this.props.canDelete.some(this.props.hasRole)}
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
              label={t('entities.product.props.nameNl')}
              placeholder={t('entities.product.props.nameNl')}
              value={nameDutch}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                this.setState({
                  nameDutch: e.target.value,
                })
              }
              error={validator.isEmpty(nameDutch)}
            />
            <Form.Field
              disabled={!editing}
              required
              fluid
              id="form-input-english-name"
              control={Input}
              label={t('entities.product.props.nameEn')}
              placeholder={t('entities.product.props.nameEn')}
              value={nameEnglish}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                this.setState({
                  nameEnglish: e.target.value,
                })
              }
              error={validator.isEmpty(nameEnglish)}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field disabled={!editing} required>
              <label htmlFor="form-input-category">{t('entities.product.props.category')}</label>
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
            <Form.Field disabled={!editing}>
              <label htmlFor="form-check-status">{t('entities.product.props.status.header')}</label>
              <Checkbox
                toggle
                id="form-check-status"
                label={
                  status === ProductStatus.ACTIVE
                    ? t('entities.product.props.status.active')
                    : t('entities.product.props.status.inactive')
                }
                checked={status === ProductStatus.ACTIVE}
                onChange={(_, data) =>
                  this.setState({
                    status: data.checked ? ProductStatus.ACTIVE : ProductStatus.INACTIVE,
                  })
                }
              />
            </Form.Field>
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              disabled={!editing}
              required
              error={
                parseFloat(targetPrice.replace(',', '.')) <= 0 ||
                Number.isNaN(parseFloat(targetPrice.replace(',', '.')))
              }
            >
              <label htmlFor="form-input-target-price">{t('entities.product.props.price')}</label>
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
            <Form.Field disabled={!editing} required>
              <label htmlFor="form-input-vat">{t('entities.product.props.valueAddedTax')}</label>
              <ProductVatSelector
                id="form-input-vat"
                value={vatId}
                onChange={(val: number) => {
                  this.setState({
                    vatId: val,
                  });
                }}
              />
            </Form.Field>
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field disabled={!editing} error={minTarget !== undefined ? minTarget < 0 : false}>
              <label htmlFor="form-input-minimal-target">{t('entities.product.props.minTarget')}</label>
              <Input
                id="form-input-minimal-target"
                type="number"
                placeholder="Minimal target"
                value={minTarget}
                fluid
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  this.setState({
                    minTarget: Number(e.target.value),
                  })
                }
              />
            </Form.Field>
            <Form.Field disabled={!editing} error={maxTarget < (minTarget || 0)}>
              <label htmlFor="form-input-maximum-target">{t('entities.product.props.maxTarget')}</label>
              <Input
                id="form-input-maximum-target"
                type="number"
                placeholder="Maximum target"
                value={maxTarget}
                fluid
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  this.setState({
                    maxTarget: Number(e.target.value),
                  })
                }
              />
            </Form.Field>
          </Form.Group>
          <Form.Field disabled={!editing}>
            <label htmlFor="form-input-description">{t('entities.product.props.comments')}</label>
            <TextArea
              id="form-input-description"
              value={description}
              onChange={(e) => this.setState({ description: e.target.value })}
              placeholder="Internal comments"
            />
          </Form.Field>
          <Form.Field required error={validator.isEmpty(contractTextDutch)} disabled={!editing}>
            <label htmlFor="form-input-contract-text-dutch">{t('entities.product.props.contractTextNl')}</label>
            <TextArea
              id="form-input-contract-text-dutch"
              value={contractTextDutch}
              onChange={(e) => this.setState({ contractTextDutch: e.target.value })}
              placeholder="Contract text in Dutch"
            />
          </Form.Field>
          <Form.Field required error={validator.isEmpty(contractTextEnglish)} disabled={!editing}>
            <label htmlFor="form-input-contract-text-english">{t('entities.product.props.contractTextEn')}</label>
            <TextArea
              id="form-input-contract-text-english"
              value={contractTextEnglish}
              onChange={(e) => this.setState({ contractTextEnglish: e.target.value })}
              placeholder="Contract text in English"
            />
          </Form.Field>
          <Form.Field disabled={!editing}>
            <label htmlFor="form-input-delivery-spec-dutch">{t('entities.product.props.specsNl')}</label>
            <TextArea
              id="form-input-delivery-spec-dutch"
              value={deliverySpecDutch}
              onChange={(e) => this.setState({ deliverySpecDutch: e.target.value })}
              placeholder="Delivery specifications in Dutch"
            />
          </Form.Field>
          <Form.Field disabled={!editing}>
            <label htmlFor="form-input-delivery-spec-english">{t('entities.product.props.specsEn')}</label>
            <TextArea
              id="form-delivery-spec-english"
              value={deliverySpecEnglish}
              onChange={(e) => this.setState({ deliverySpecEnglish: e.target.value })}
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
    hasRole: (role: Roles): boolean => authedUserHasRole(state, role),
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  saveProduct: (id: number, product: ProductParams) => dispatch(saveSingle(SingleEntities.Product, id, product)),
  createProduct: (product: ProductParams) => dispatch(createSingle(SingleEntities.Product, product)),
  deleteProduct: (id: number) => dispatch(deleteSingle(SingleEntities.Product, id)),
});

export default withTranslation()(withRouter(connect(mapStateToProps, mapDispatchToProps)(ProductProps)));
