/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';
import { RootState } from '../../stores/store';
import { getCategoryName } from '../../stores/productcategory/selectors';

interface Props {
  id: number;

  categoryName: string;
}

function CategoryLink(props: Props) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, categoryName, ...rest } = props;
  return (
    <NavLink to={`/category/${id}`}>
      <Icon name="tags" />
      {categoryName}
    </NavLink>
  );
}

const mapStateToProps = (state: RootState, props: { id: number }) => {
  return {
    categoryName: getCategoryName(state, props.id),
  };
};

export default connect(mapStateToProps)(CategoryLink);
