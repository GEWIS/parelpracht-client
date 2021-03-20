import React from 'react';
import { Dropdown, Segment } from 'semantic-ui-react';
import { Client, ContractedProductsAnalysis } from '../../clients/server.generated';
import { dateToFinancialYear } from '../../helpers/timestamp';
import CategoryLineChart from '../chart/CategoryLineChart';

interface Props {}

interface State {
  data?: ContractedProductsAnalysis;
  financialYear: number;
  loading: boolean;
}

class DashboardContractedCategoryGraph extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      data: undefined,
      financialYear: dateToFinancialYear(new Date()),
      loading: true,
    };
  }

  async componentDidMount() {
    const { financialYear } = this.state;
    await this.updateGraph(financialYear);
  }

  async updateGraph(year: number) {
    this.setState({ loading: true });
    const client = new Client();
    const data = await client.getContractedProductsStatistics(year);
    this.setState({
      data,
      loading: false,
    });
  }

  async changeFinancialYear(value: number) {
    this.setState({ financialYear: value, loading: true });
    await this.updateGraph(value);
  }

  createDropdownOptions() {
    const { data } = this.state;
    const financialYears = data?.financialYears || [];
    const result: object[] = [];
    financialYears.forEach((y: number) => {
      result.push({
        key: y, value: y, text: `${(y - 1).toString()} - ${y.toString()}`,
      });
    });
    return result;
  }

  render() {
    const { data, loading, financialYear } = this.state;

    if (data === undefined) {
      return (
        <Segment loading={loading} />
      );
    }

    return (
      <Segment loading={loading}>
        <CategoryLineChart
          data={data.categories}
          labels={data.labels === undefined ? ['June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March', 'April', 'May', 'June'] : data.labels}
          extraDropdown={(
            <Dropdown
              options={this.createDropdownOptions()}
              basic
              value={financialYear}
              float="right"
              onChange={(value, d) => this.changeFinancialYear(d.value as number)}
            />
          )}
        />
      </Segment>
    );
  }
}

export default DashboardContractedCategoryGraph;
