import React from 'react';
import { Tab } from 'semantic-ui-react';
import { Client, Company, ContractedProductsAnalysis } from '../../../clients/server.generated';
import CategoryLineChart from '../../chart/CategoryLineChart';

interface Props {
  company: Company;
}

interface State {
  data?: ContractedProductsAnalysis;
  loading: boolean;
}

class CompanyContractedProductsChart extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      data: undefined,
      loading: true,
    };
  }

  async componentDidMount() {
    const { company } = this.props;
    const client = new Client();
    const data = await client.getCompanyStatistics(company.id);
    this.setState({
      data,
      loading: false,
    });
  }

  render() {
    const { data, loading } = this.state;

    if (data === undefined) {
      return <Tab.Pane loading={loading} />;
    }

    return (
      <Tab.Pane loading={loading}>
        <CategoryLineChart
          data={data.categories}
          labels={data.labels || []}
        />
        <p style={{ textAlign: 'center', fontStyle: 'italic', marginTop: '0.5em' }}>
          * Note that these years are the financial years,
          so 2021 means the association year 2020-2021.
        </p>
      </Tab.Pane>
    );
  }
}

export default CompanyContractedProductsChart;
