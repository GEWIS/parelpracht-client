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

interface State {
  paneIndex: number;
}

class SingleInvoicePage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const panes = this.getPanes();
    let { hash } = this.props.location;
    // If there is no hash, do not take the first (#) character
    if (hash.length > 0) {
      hash = hash.substr(1);
    }
    // Find the corresponding tab that has been selected
    let index = panes.findIndex((p) => p.menuItem.toLowerCase() === hash.toLowerCase());
    // If no parameter is given, or a parameter is given that does not exist,
    // select the first one by default
    if (index < 0) {
      index = 0;
      this.props.history.replace(`#${panes[0].menuItem.toLowerCase()}`);
    }

    this.state = {
      paneIndex: index,
    };
  }

  componentDidMount() {
    const { invoiceId } = this.props.match.params;

    this.props.clearInvoice();
    this.props.fetchInvoice(Number.parseInt(invoiceId, 10));
  }

  getPanes = () => {
    const {
      invoice, fetchInvoice, status, hasRole,
    } = this.props;

    const panes = [
      {
        menuItem: 'Products',
        render: invoice ? () => (
          <Tab.Pane>
            <InvoiceProductList
              invoice={invoice}
              fetchInvoice={fetchInvoice}
            />
          </Tab.Pane>
        ) : () => <Tab.Pane />,
      },
    ];

    if (hasRole(Roles.GENERAL)
      || hasRole(Roles.ADMIN) || hasRole(Roles.AUDIT) || hasRole(Roles.FINANCIAL)) {
      panes.push({
        menuItem: 'Files',
        render: invoice ? () => (
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
        ) : () => <Tab.Pane />,
      });
      panes.push({
        menuItem: 'Activities',
        render: invoice ? () => (
          <Tab.Pane>
            <ActivitiesList
              activities={invoice.activities as GeneralActivity[]}
              componentId={invoice.id}
              componentType={SingleEntities.Invoice}
              resourceStatus={status}
            />
          </Tab.Pane>
        ) : () => <Tab.Pane />,
      });
    }

    return panes;
  };

  public render() {
    const { invoice, status } = this.props;
    const { paneIndex } = this.state;

    if (invoice === undefined) {
      return (
        <Container style={{ paddingTop: '0.5em' }}>
          <Loader content="Loading" active />
        </Container>
      );
    }

    const panes = this.getPanes();

    return (
      <AuthorizationComponent
        roles={[Roles.GENERAL, Roles.FINANCIAL, Roles.AUDIT, Roles.ADMIN]}
        notFound
      >
        <Container style={{ paddingTop: '0.5em' }}>
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
                <Tab
                  panes={panes}
                  menu={{ pointing: true, inverted: true }}
                  onTabChange={(e, data) => {
                    this.setState({ paneIndex: data.activeIndex! as number });
                    this.props.history.replace(`#${data.panes![data.activeIndex! as number].menuItem.toLowerCase()}`);
                  }}
                  activeIndex={paneIndex}
                />
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
