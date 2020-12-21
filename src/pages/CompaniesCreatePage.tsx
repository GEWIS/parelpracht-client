import { RouteComponentProps } from "react-router-dom";
import ResourceStatus from "../stores/resourceStatus";

import * as React from 'react';
import {
  Modal, Segment,
} from 'semantic-ui-react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Product, ProductStatus } from '../clients/server.generated';
import { fetchSingleProduct, clearSingleProduct } from '../stores/product/actionCreators';
import { RootState } from '../stores/store';
import ProductProps from '../product/ProductProps';
import ResourceStatus from '../stores/resourceStatus';
import AlertContainer from '../components/alerts/AlertContainer';

interface Props extends RouteComponentProps {
  status: ResourceStatus;


}

class CompaniesCreatePage extends React.Component<Props> {
  public constructor(props: Props) {
    super(props);

    
  }
}