import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Button, Container, Grid, Header, Icon, Segment,
} from 'semantic-ui-react';
import { withTranslation, WithTranslation } from 'react-i18next';
import validator from 'validator';
import {
  CustomInvoiceGenSettings,
  CustomProduct,
  CustomRecipient,
  Language,
  ReturnFileType,
  Roles, VAT,
} from '../clients/server.generated';
import CustomInvoiceProducts from '../components/custominvoice/CustomInvoiceProducts';
import CustomInvoiceProps from '../components/custominvoice/CustomInvoiceProps';
import CustomInvoiceRecipient from '../components/custominvoice/CustomInvoiceRecipient';
import { FilesClient } from '../clients/filesClient';
import AuthorizationComponent from '../components/AuthorizationComponent';
import { isInvalidDate } from '../helpers/timestamp';
import { TitleContext } from '../components/TitleContext';

interface Props extends RouteComponentProps, WithTranslation {}

interface State {
  language: Language;
  fileType: ReturnFileType;
  subject: string;
  ourReference: string;
  theirReference: string;
  date: Date;

  // invoiceReason: string;
  recipient: CustomRecipient;
  products: CustomProduct[];

  loading: boolean;
}

class CustomInvoicePage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      language: Language.DUTCH,
      fileType: ReturnFileType.PDF,
      subject: '',
      ourReference: '',
      theirReference: '',
      date: new Date(),
      recipient: new CustomRecipient({
        name: '',
        organizationName: '',
        number: '',
        street: '',
        postalCode: '',
        city: '',
        country: '',
      }),
      products: [new CustomProduct({
        name: '',
        amount: 0,
        pricePerOne: 0,
        valueAddedTax: VAT.HIGH,
      })],
      loading: false,
    };
  }

  componentDidMount() {
    const { t } = this.props;
    this.context.setTitle(t('pages.customInvoice.title'));
  }

  setAttribute = (attribute: string, value: string) => {
    // @ts-ignore
    this.setState({ [attribute]: value });
  };

  setRecipient = (recipient: CustomRecipient) => {
    this.setState({ recipient });
  };

  setLanguage = (language: Language) => {
    this.setState({ language });
  };

  setFileType = (fileType: ReturnFileType) => {
    this.setState({ fileType });
  };

  setDate = (date: Date) => {
    this.setState({ date });
  };

  addProduct = () => {
    const { products } = this.state;
    const newProduct = new CustomProduct({
      name: '',
      amount: 0,
      pricePerOne: 0,
      valueAddedTax: VAT.HIGH,
    });
    products.push(newProduct);
    this.setState({ products });
  };

  updateProduct = (id: number, attribute: string, value: any) => {
    const { products } = this.state;
    // @ts-ignore
    products[id][attribute] = value;
    this.setState({ products });
  };

  removeProduct = (id: number) => {
    const { products } = this.state;
    products.splice(id, 1);
    this.setState({ products });
  };

  updateRecipientAttribute = (attribute: string, value: string) => {
    const { recipient } = this.state;
    // @ts-ignore
    recipient[attribute] = value;
    this.setState({
      recipient,
    });
  };

  generate = async () => {
    const {
      language, fileType, ourReference, theirReference, subject, recipient, products, date,
    } = this.state;
    this.setState({ loading: true });
    const client = new FilesClient();
    await client.generateCustomInvoiceFile(new CustomInvoiceGenSettings({
      language,
      fileType,
      ourReference,
      theirReference,
      subject,
      recipient,
      products,
      date,
    }));

    this.setState({ loading: false });
  };

  render() {
    const { t } = this.props;
    const {
      language, fileType, subject, ourReference, theirReference, recipient, products, date, loading,
    } = this.state;

    return (
      <AuthorizationComponent roles={[Roles.FINANCIAL, Roles.ADMIN]} notFound>
        <Segment style={{ backgroundColor: 'rgba(237, 237, 237, 0.98)' }} vertical basic>
          <Container style={{ paddingTop: '1em' }}>
            <Grid columns={2}>
              <Grid.Column width={10}>
                <Header as="h1">
                  <Icon name="credit card" />
                  <Header.Content>
                    <Header.Subheader>
                      {t('pages.customInvoice.subheader')}
                    </Header.Subheader>
                    {t('pages.customInvoice.header')}
                  </Header.Content>
                </Header>
              </Grid.Column>
              <Grid.Column width="6">
                <Button
                  icon
                  labelPosition="left"
                  primary
                  floated="right"
                  onClick={() => this.generate()}
                  loading={loading}
                  disabled={(isInvalidDate(date) || validator.isEmpty(subject)
                    || validator.isEmpty(ourReference) || validator.isEmpty(recipient.name))}
                >
                  <Icon name="download" />
                  {t('pages.customInvoice.generateButton')}
                </Button>
              </Grid.Column>
            </Grid>

          </Container>
        </Segment>
        <Container style={{ marginTop: '2em' }}>
          <Grid>
            <Grid.Row columns={2}>
              <Grid.Column>
                <CustomInvoiceProps
                  language={language}
                  fileType={fileType}
                  subject={subject}
                  ourReference={ourReference}
                  theirReference={theirReference}
                  date={date}
                  setAttribute={this.setAttribute}
                  setLanguage={this.setLanguage}
                  setFileType={this.setFileType}
                  setDate={this.setDate}
                />
              </Grid.Column>
              <Grid.Column>
                <CustomInvoiceRecipient
                  recipient={recipient}
                  updateRecipientAttribute={this.updateRecipientAttribute}
                />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <CustomInvoiceProducts
                  products={products}
                  addProduct={this.addProduct}
                  updateProduct={this.updateProduct}
                  removeProduct={this.removeProduct}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </AuthorizationComponent>
    );
  }
}

CustomInvoicePage.contextType = TitleContext;

export default withTranslation()(withRouter(CustomInvoicePage));
