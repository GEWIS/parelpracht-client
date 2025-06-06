import { Component } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { TabPane } from 'semantic-ui-react';
import { Client, Company, ContractedProductsAnalysis } from '../../../clients/server.generated';
import CategoryLineChart from '../../chart/CategoryLineChart';

interface Props extends WithTranslation {
  company: Company;
}

interface State {
  data?: ContractedProductsAnalysis;
  loading: boolean;
}

class CompanyContractedProductsChart extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      data: undefined,
      loading: true,
    };
  }

  componentDidMount() {
    const { company } = this.props;
    const client = new Client();
    client.getCompanyStatistics(company.id)
      .then((data) => {
        this.setState({
          data,
          loading: false,
        });
      })
      .catch(console.error);
  }

  render() {
    const { data, loading } = this.state;
    const { t } = this.props;

    if (data === undefined) {
      return <TabPane loading={loading} />;
    }

    return (
      <TabPane loading={loading}>
        <CategoryLineChart
          data={data.categories}
          labels={data.labels || []}
        />
        <p style={{ textAlign: 'center', fontStyle: 'italic', marginTop: '0.5em' }}>
          {t('entities.product.warningFinancialYear')}
        </p>
      </TabPane>
    );
  }
}

export default withTranslation()(CompanyContractedProductsChart);
