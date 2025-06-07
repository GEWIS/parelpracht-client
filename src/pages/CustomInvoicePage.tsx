import { Component } from 'react';
import { Button, Container, Grid, Header, Icon, Segment } from 'semantic-ui-react';
import { withTranslation, WithTranslation } from 'react-i18next';
import validator from 'validator';
import {
  CustomInvoiceGenSettings,
  CustomProduct,
  CustomRecipient,
  ICustomInvoiceGenSettings,
  Language,
  ReturnFileType,
  Roles,
  VAT,
} from '../clients/server.generated';
import CustomInvoiceProducts from '../components/custominvoice/CustomInvoiceProducts';
import CustomInvoiceProps from '../components/custominvoice/CustomInvoiceProps';
import CustomInvoiceRecipient from '../components/custominvoice/CustomInvoiceRecipient';
import { FilesClient } from '../clients/filesClient';
import AuthorizationComponent from '../components/AuthorizationComponent';
import { isInvalidDate } from '../helpers/timestamp';
import { TitleContext } from '../components/TitleContext';
import { WithRouter, withRouter } from '../WithRouter';

interface Props extends WithTranslation, WithRouter {}

interface State {
  customInvoice: ICustomInvoiceGenSettings;

  loading: boolean;
}

class CustomInvoicePage extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      customInvoice: {
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
        products: [
          new CustomProduct({
            name: '',
            amount: 0,
            pricePerOne: 0,
            valueAddedTax: VAT.HIGH,
          }),
        ],
      },
      loading: false,
    };
  }

  componentDidMount() {
    const { t } = this.props;
    document.title = t('pages.customInvoice.title');
  }

  setAttribute = <T extends keyof ICustomInvoiceGenSettings = keyof ICustomInvoiceGenSettings>(
    attribute: T,
    value: ICustomInvoiceGenSettings[T],
  ) => {
    this.setState({
      customInvoice: {
        ...this.state.customInvoice,
        [attribute]: value,
      },
    });
  };

  addProduct = () => {
    const { products } = this.state.customInvoice;
    const newProduct = new CustomProduct({
      name: '',
      amount: 0,
      pricePerOne: 0,
      valueAddedTax: VAT.HIGH,
    });
    products.push(newProduct);
    this.setAttribute('products', products);
  };

  updateProduct = <T extends keyof CustomProduct = keyof CustomProduct>(
    id: number,
    attribute: T,
    value: CustomProduct[T],
  ) => {
    const { products } = this.state.customInvoice;
    products[id][attribute] = value;
    this.setAttribute('products', products);
  };

  removeProduct = (id: number) => {
    const { products } = this.state.customInvoice;
    products.splice(id, 1);
    this.setAttribute('products', products);
  };

  updateRecipientAttribute = <T extends keyof CustomRecipient = keyof CustomRecipient>(
    attribute: T,
    value: CustomRecipient[T],
  ) => {
    const { recipient } = this.state.customInvoice;
    recipient[attribute] = value;
    this.setAttribute('recipient', recipient);
  };

  generate = async () => {
    this.setState({ loading: true });
    const client = new FilesClient();
    await client.generateCustomInvoiceFile(new CustomInvoiceGenSettings(this.state.customInvoice));

    this.setState({ loading: false });
  };

  render() {
    const { t } = this.props;
    const { subject, ourReference, recipient, products, date } = this.state.customInvoice;

    return (
      <AuthorizationComponent roles={[Roles.FINANCIAL, Roles.ADMIN]} notFound>
        <Segment style={{ backgroundColor: 'rgba(237, 237, 237, 0.98)' }} vertical basic>
          <Container style={{ paddingTop: '1em' }}>
            <Grid columns={2}>
              <Grid.Column width={10}>
                <Header as="h1">
                  <Icon name="credit card" />
                  <Header.Content>
                    <Header.Subheader>{t('pages.customInvoice.subheader')}</Header.Subheader>
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
                  onClick={() => {
                    this.generate().catch(console.error);
                  }}
                  loading={this.state.loading}
                  disabled={
                    isInvalidDate(date) ||
                    validator.isEmpty(subject) ||
                    validator.isEmpty(ourReference) ||
                    validator.isEmpty(recipient.name)
                  }
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
                <CustomInvoiceProps customInvoice={this.state.customInvoice} setAttribute={this.setAttribute} />
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
