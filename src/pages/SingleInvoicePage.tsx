import * as React from 'react';
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Breadcrumb,
  Container, Grid, Loader, Segment, Tab,
} from 'semantic-ui-react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Invoice, Roles } from '../clients/server.generated';
import { RootState } from '../stores/store';
import ResourceStatus from '../stores/resourceStatus';
import InvoiceSummary from '../components/invoice/InvoiceSummary';
import InvoiceProps from '../components/invoice/InvoiceProps';
import { clearSingle, fetchSingle } from '../stores/single/actionCreators';
import { SingleEntities } from '../stores/single/single';
import { getSingle } from '../stores/single/selectors';
import ActivitiesList from '../components/activities/ActivitiesList';
import { GeneralActivity } from '../components/activities/GeneralActivity';
import FinancialDocumentProgress from '../components/activities/FinancialDocumentProgress';
import InvoiceProductList from '../components/invoice/InvoiceProductList';
import FilesList from '../components/files/FilesList';
import GenerateInvoiceModal from '../components/files/GenerateInvoiceModal';
import AuthorizationComponent from '../components/AuthorizationComponent';
import { authedUserHasRole } from '../stores/auth/selectors';

interface Props extends RouteComponentProps<{ invoiceId: string }> {
  invoice: Invoice | undefined;
  status: ResourceStatus;

  fetchInvoice: (id: number) => void;
  clearInvoice: () => void;
  hasRole: (role: Roles) => boolean;
}

class SingleInvoicePage extends React.Component<Props> {
  componentDidMount() {
    const { invoiceId } = this.props.match.params;

    this.props.clearInvoice();
    this.props.fetchInvoice(Number.parseInt(invoiceId, 10));
  }

  public render() {
    const {
      invoice, fetchInvoice, status, hasRole,
    } = this.props;

    if (invoice === undefined) {
      return (
        <Container style={{ paddingTop: '2em' }}>
          <Loader content="Loading" active />
        </Container>
      );
    }

    const panes = [
      {
        menuItem: 'Products',
        render: () => (
          <Tab.Pane>
            <InvoiceProductList
              invoice={invoice}
              fetchInvoice={fetchInvoice}
            />
          </Tab.Pane>
        ),
      },
    ];

    if (hasRole(Roles.GENERAL)
    || hasRole(Roles.ADMIN) || hasRole(Roles.AUDIT) || hasRole(Roles.FINANCIAL)) {
      panes.push({
        menuItem: 'Files',
        render: () => (
          <Tab.Pane>
            <FilesList
              files={invoice.files}
              entityId={invoice.id}
              entity={SingleEntities.Invoice}
              fetchEntity={fetchInvoice}
              generateModal={(
                <GenerateInvoiceModal
                  invoice={invoice}
                  fetchInvoice={fetchInvoice}
                />
            )}
              status={status}
            />
          </Tab.Pane>
        ),
      });
      panes.push({
        menuItem: 'Activities',
        render: () => (
          <Tab.Pane>
            <ActivitiesList
              activities={invoice.activities as GeneralActivity[]}
              componentId={invoice.id}
              componentType={SingleEntities.Invoice}
              resourceStatus={status}
            />
          </Tab.Pane>
        ),
      });
    }

    return (
      <AuthorizationComponent
        roles={[Roles.GENERAL, Roles.FINANCIAL, Roles.AUDIT, Roles.ADMIN]}
        notFound
      >
        <Container style={{ paddingTop: '2em' }}>
          <Breadcrumb
            icon="right angle"
            sections={[
              { key: 'Invoices', content: <NavLink to="/invoice">Invoices</NavLink> },
              { key: 'Invoice', content: invoice.id, active: true },
            ]}
          />
          <InvoiceSummary />
          <Grid rows={2}>
            <Grid.Row centered columns={1} style={{ paddingLeft: '1em', paddingRight: '1em' }}>
              <Segment secondary>
                <FinancialDocumentProgress
                  documentId={invoice.id}
                  activities={invoice.activities as GeneralActivity[]}
                  documentType={SingleEntities.Invoice}
                  resourceStatus={status}
                  roles={[Roles.ADMIN, Roles.GENERAL, Roles.FINANCIAL]}
                  canCancel
                />
              </Segment>
            </Grid.Row>
            <Grid.Row columns={2}>
              <Grid.Column width={10}>
                <Tab panes={panes} menu={{ pointing: true, inverted: true }} />
              </Grid.Column>
              <Grid.Column width={6}>
                <Segment secondary>
                  <InvoiceProps invoice={invoice} />
                </Segment>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </AuthorizationComponent>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    invoice: getSingle<Invoice>(state, SingleEntities.Invoice).data,
    status: getSingle<Invoice>(state, SingleEntities.Invoice).status,
    hasRole: (role: Roles): boolean => authedUserHasRole(state, role),
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchInvoice: (id: number) => dispatch(fetchSingle(SingleEntities.Invoice, id)),
  clearInvoice: () => dispatch(clearSingle(SingleEntities.Invoice)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SingleInvoicePage));
