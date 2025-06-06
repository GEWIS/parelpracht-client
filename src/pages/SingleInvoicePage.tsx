import * as React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Breadcrumb,
  Container, Grid, Loader, Segment, Tab,
} from 'semantic-ui-react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Invoice, Roles } from '../clients/server.generated';
import { RootState } from '../stores/store';
import ResourceStatus from '../stores/resourceStatus';
import InvoiceSummary from '../components/entities/invoice/InvoiceSummary';
import InvoiceProps from '../components/entities/invoice/InvoiceProps';
import { clearSingle, fetchSingle } from '../stores/single/actionCreators';
import { SingleEntities } from '../stores/single/single';
import { getSingle } from '../stores/single/selectors';
import ActivitiesList from '../components/activities/ActivitiesList';
import { GeneralActivity } from '../components/activities/GeneralActivity';
import FinancialDocumentProgress from '../components/activities/FinancialDocumentProgress';
import InvoiceProductList from '../components/entities/invoice/InvoiceProductList';
import FilesList from '../components/files/FilesList';
import GenerateInvoiceModal from '../components/files/GenerateInvoiceModal';
import AuthorizationComponent from '../components/AuthorizationComponent';
import { authedUserHasRole } from '../stores/auth/selectors';
import { TitleContext } from '../components/TitleContext';
import { WithRouter, withRouter } from '../WithRouter';
import NotFound from './NotFound';

interface Props extends WithTranslation, WithRouter {
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
    const { location, navigate } = props.router;

    const panes = this.getPanes();
    let { hash } = location;
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

      navigate(`#${panes[0].menuItem.toLowerCase()}`, { replace: true });
    }

    this.state = {
      paneIndex: index,
    };
  }

  componentDidMount() {
    const { params } = this.props.router;

    this.props.clearInvoice();
    this.props.fetchInvoice(Number.parseInt(params.invoiceId, 10));
  }

  componentDidUpdate() {
    const { invoice, t } = this.props;
    if (invoice === undefined) {
      document.title = t('entity.contract');
    } else {
      document.title = `F${invoice.id} ${invoice.title}`;
    }
  }

  getPanes = () => {
    const {
      invoice, fetchInvoice, status, hasRole, t,
    } = this.props;

    const panes = [
      {
        menuItem: t('entity.products'),
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
        menuItem: t('entity.files'),
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
        menuItem: t('entity.activities'),
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
    const { invoice, status, t } = this.props;
    const { paneIndex } = this.state;
    const { navigate } = this.props.router;

    if (status === ResourceStatus.NOTFOUND) {
      return <NotFound />;
    }

    if (invoice === undefined) {
      return (
        <Container style={{ paddingTop: '1em' }}>
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
        <Segment style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }} vertical basic>
          <Container>
            <Breadcrumb
              icon="right angle"
              sections={[
                { key: 'Invoices', content: <NavLink to="/invoice">{t('entity.invoices')}</NavLink> },
                { key: 'Invoice', content: `F${invoice.id} ${invoice.title}`, active: true },
              ]}
            />
          </Container>
        </Segment>
        <Container style={{ marginTop: '1.25em' }}>
          <InvoiceSummary />
          <Grid rows={2} stackable>
            <Grid.Row centered columns={1} style={{ paddingLeft: '1em', paddingRight: '1em' }}>
              <Segment secondary style={{ backgroundColor: 'rgba(243, 244, 245, 0.98)' }}>
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
                    navigate(`#${data.panes![data.activeIndex! as number].menuItem.toLowerCase()}`, { replace: true });
                  }}
                  activeIndex={paneIndex}
                />
              </Grid.Column>
              <Grid.Column width={6}>
                <Segment secondary style={{ backgroundColor: 'rgba(243, 244, 245, 0.98)' }}>
                  <InvoiceProps
                    invoice={invoice}
                  />
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

SingleInvoicePage.contextType = TitleContext;

export default withTranslation()(withRouter(connect(mapStateToProps,
  mapDispatchToProps)(SingleInvoicePage)));
