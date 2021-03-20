import React, { ChangeEvent } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
  Form, Input,
} from 'semantic-ui-react';
import validator from 'validator';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { CategoryParams, ProductCategory, Roles } from '../../clients/server.generated';
import { createSingle, deleteSingle, saveSingle } from '../../stores/single/actionCreators';
import ResourceStatus from '../../stores/resourceStatus';
import { RootState } from '../../stores/store';
import PropsButtons from '../PropsButtons';
import { getSingle } from '../../stores/single/selectors';
import { SingleEntities } from '../../stores/single/single';
import AuthorizationComponent from '../AuthorizationComponent';

interface Props extends RouteComponentProps {
  create?: boolean;
  onCancel?: () => void;

  category: ProductCategory;
  status: ResourceStatus;

  saveCategory: (id: number, category: CategoryParams) => void;
  createCategory: (category: CategoryParams) => void;
  deleteCategory: (id: number) => void;
}

interface State {
  editing: boolean;
  name: string;
  // products: [];
}

class ProductCategoryProps extends React.Component<Props, State> {
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
    const { category } = props;
    return {
      name: category.name,
      // products: category.products,
    };
  };

  toParams = (): CategoryParams => {
    return new CategoryParams({
      name: this.state.name,
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
      this.props.createCategory(this.toParams());
    } else {
      this.props.saveCategory(this.props.category.id, this.toParams());
    }
  };

  remove = () => {
    if (!this.props.create && this.props.deleteCategory) {
      this.props.history.push('/category');
      this.props.deleteCategory(this.props.category.id);
    }
  };

  propsHaveErrors = (): boolean => {
    const { name } = this.state;
    return validator.isEmpty(name);
  };

  deleteButtonActive = () => {
    if (this.props.create) {
      return undefined;
    }
    return !(this.props.category.products.length > 0);
  };

  render() {
    const {
      editing,
      name,
      // products,
    } = this.state;

    return (
      <>
        <h2>
          {this.props.create ? 'New Product Category' : 'Details'}

          <AuthorizationComponent roles={[Roles.ADMIN]} notFound={false}>
            <PropsButtons
              editing={editing}
              canDelete={this.deleteButtonActive()}
              canSave={!this.propsHaveErrors()}
              entity={SingleEntities.ProductCategory}
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
            <Form.Field
              required
              disabled={!editing}
              id="form-input-name"
              placeholder="Name"
              fluid
              control={Input}
              label="Name"
              value={name}
              onChange={(e: ChangeEvent<HTMLInputElement>) => this.setState({
                name: e.target.value,
              })}
              error={
                validator.isEmpty(name)
              }
            />
          </Form.Group>
        </Form>
      </>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    status: getSingle<ProductCategory>(state, SingleEntities.ProductCategory).status,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  saveCategory: (id: number, category: CategoryParams) => dispatch(
    saveSingle(SingleEntities.ProductCategory, id, category),
  ),
  createCategory: (category: CategoryParams) => dispatch(
    createSingle(SingleEntities.ProductCategory, category),
  ),
  deleteCategory: (id: number) => dispatch(
    deleteSingle(SingleEntities.ProductCategory, id),
  ),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProductCategoryProps));
