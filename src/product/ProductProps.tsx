import React, {
  ChangeEvent,
} from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
  Checkbox,
  Form, Input, Label, Segment, TextArea,
} from 'semantic-ui-react';
import { Product, ProductParams, ProductStatus } from '../clients/server.generated';
import { formatPrice } from '../helpers/monetary';
import { createSingleProduct, saveSingleProduct } from '../stores/product/actionCreators';
import ResourceStatus from '../stores/resourceStatus';
import { RootState } from '../stores/store';
import ProductPropsButtons from './ProductPropsButtons';

interface Props {
  create?: boolean;
  onCancel?: () => void;

  product: Product;
  status: ResourceStatus;

  saveProduct: (id: number, product: ProductParams) => void;
  createProduct: (product: ProductParams) => void;
}

interface State {
  editing: boolean;

  nameDutch: string;
  nameEnglish: string;
  targetPrice: string;
  status: ProductStatus;
  description: string;
  contractTextDutch: string;
  contractTextEnglish: string;
  deliverySpecDutch: string;
  deliverySpecEnglish: string;
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
      contractTextDutch: product.contractTextDutch,
      contractTextEnglish: product.contractTextEnglish,
      deliverySpecDutch: product.deliverySpecificationDutch,
      deliverySpecEnglish: product.deliverySpecificationEnglish,
    };
  };

  toParams = (): ProductParams => {
    return new ProductParams({
      nameDutch: this.state.nameDutch,
      nameEnglish: this.state.nameEnglish,
      targetPrice: Math.round(Number.parseFloat(this.state.targetPrice) * 100),
      status: this.state.status,
      description: this.state.description,
      contractTextDutch: this.state.contractTextDutch,
      contractTextEnglish: this.state.contractTextEnglish,
      deliverySpecificationEnglish: this.state.deliverySpecEnglish,
      deliverySpecificationDutch: this.state.deliverySpecDutch,
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

  render() {
    const {
      editing,
      nameDutch, nameEnglish,
      targetPrice, status,
      description,
      contractTextDutch, contractTextEnglish,
      deliverySpecDutch, deliverySpecEnglish,
    } = this.state;

    return (
      <>
        <h2>
          {this.props.create ? 'New Product' : 'Details'}

          <ProductPropsButtons
            editing={editing}
            status={this.props.status}
            cancel={this.cancel}
            edit={this.edit}
            save={this.save}
          />
        </h2>

        <Form style={{ marginTop: '2em' }}>
          <Form.Group widths="equal">
            <Form.Field
              disabled={!editing}
              id="form-input-dutch-name"
              fluid
              control={Input}
              label="Name (Dutch)"
              value={nameDutch}
              onChange={(e: ChangeEvent<HTMLInputElement>) => this.setState({
                nameDutch: e.target.value,
              })}
            />
            <Form.Field
              disabled={!editing}
              fluid
              id="form-input-english-name"
              control={Input}
              label="Name (English)"
              value={nameEnglish}
              onChange={(e: ChangeEvent<HTMLInputElement>) => this.setState({
                nameEnglish: e.target.value,
              })}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field disabled={!editing}>
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor="form-input-target-price">
                Target Price
              </label>
              <Input
                labelPosition="left"
                id="form-input-target-price"
                value={targetPrice}
                onChange={(e) => this.setState({ targetPrice: e.target.value })}
              >
                <Label basic>€</Label>
                <input />
              </Input>
            </Form.Field>
            <Form.Field disabled={!editing}>
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor="form-check-status">
                Status
              </label>
              <Checkbox
                toggle
                id="form-check-status"
                label={status === ProductStatus.ACTIVE ? 'Active' : 'Inactive'}
                checked={status === ProductStatus.ACTIVE}
                onChange={(_, data) => this.setState({
                  status:
                    data.checked ? ProductStatus.ACTIVE : ProductStatus.INACTIVE,
                })}
              />
            </Form.Field>
          </Form.Group>
          <Form.Field disabled={!editing}>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="form-input-description">
              Description
            </label>
            <TextArea
              id="form-input-description"
              value={description}
              onChange={(e) => this.setState({ description: e.target.value })}
              placeholder="Description"
            />
          </Form.Field>
          <Form.Field disabled={!editing}>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="form-input-contract-text-dutch">
              Contract Text (Dutch)
            </label>
            <TextArea
              id="form-input-contract-text-dutch"
              value={contractTextDutch}
              onChange={
                (e) => this.setState({ contractTextDutch: e.target.value })
              }
              placeholder="Contract Text (Dutch)"
            />
          </Form.Field>
          <Form.Field disabled={!editing}>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="form-input-contract-text-english">
              Contract Text (English)
            </label>
            <TextArea
              id="form-input-contract-text-english"
              value={contractTextEnglish}
              onChange={
                (e) => this.setState({ contractTextEnglish: e.target.value })
              }
              placeholder="Contract Text (English)"
            />
          </Form.Field>
          <Form.Field disabled={!editing}>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="form-input-delivery-spec-dutch">
              Delivery Specification (Dutch)
            </label>
            <TextArea
              id="form-input-delivery-spec-dutch"
              value={deliverySpecDutch}
              onChange={
                (e) => this.setState({ deliverySpecDutch: e.target.value })
              }
              placeholder="Delivery Specification (Dutch)"
            />
          </Form.Field>
          <Form.Field disabled={!editing}>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="form-input-delivery-spec-english">
              Delivery Specification (English)
            </label>
            <TextArea
              id="form-delivery-spec-english"
              value={deliverySpecEnglish}
              onChange={
                (e) => this.setState({ deliverySpecEnglish: e.target.value })
              }
              placeholder="Delivery Specification (English)"
            />
          </Form.Field>
        </Form>
      </>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    status: state.product.singleStatus,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  saveProduct: (id: number, product: ProductParams) => dispatch(saveSingleProduct(id, product)),
  createProduct: (product: ProductParams) => dispatch(createSingleProduct(product)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductProps);
