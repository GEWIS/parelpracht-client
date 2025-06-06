import React, {ChangeEvent} from 'react';
import {connect} from 'react-redux';
import {Dispatch} from 'redux';
import {
  Form, Input,
} from 'semantic-ui-react';
import validator from 'validator';
import {WithTranslation, withTranslation} from 'react-i18next';
import {CategoryParams, ProductCategory, Roles} from '../../../clients/server.generated';
import {createSingle, deleteSingle, saveSingle} from '../../../stores/single/actionCreators';
import ResourceStatus from '../../../stores/resourceStatus';
import {RootState} from '../../../stores/store';
import PropsButtons from '../../PropsButtons';
import {getSingle} from '../../../stores/single/selectors';
import {SingleEntities} from '../../../stores/single/single';
import AuthorizationComponent from '../../AuthorizationComponent';
import {withRouter, WithRouter} from '../../../WithRouter';

interface Props extends WithTranslation, WithRouter {
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
  static defaultProps = {
    create: undefined,
    onCancel: undefined,
  };

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

      this.setState({editing: false});
    }
  }

  extractState = (props: Props) => {
    const {category} = props;
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
    this.setState({editing: true, ...this.extractState(this.props)});
  };

  cancel = () => {
    if (!this.props.create) {
      this.setState({editing: false, ...this.extractState(this.props)});
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
      const {navigate} = this.props.router;
      navigate('/category');
      this.props.deleteCategory(this.props.category.id);
    }
  };

  propsHaveErrors = (): boolean => {
    const {name} = this.state;
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
    const {t} = this.props;

    return (
      <>
        <h2>
          {this.props.create ? t('entities.category.newCategory') : t('entities.company.props.details')}

          <AuthorizationComponent roles={[Roles.ADMIN]} notFound={false}>
            <PropsButtons
              editing={editing}
              canEdit
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

        <Form style={{marginTop: '2em'}}>
          <Form.Group widths="equal">
            <Form.Field
              required
              disabled={!editing}
              id="form-input-name"
              placeholder={t('entities.category.props.name')}
              fluid
              control={Input}
              label={t('entities.category.props.name')}
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

export default withTranslation()(
  withRouter(connect(mapStateToProps, mapDispatchToProps)(ProductCategoryProps)),
);
