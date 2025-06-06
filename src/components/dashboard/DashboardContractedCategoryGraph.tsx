import { Component} from 'react';
import { Dropdown, Segment } from 'semantic-ui-react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Client, ContractedProductsAnalysis } from '../../clients/server.generated';
import { dateToFinancialYear } from '../../helpers/timestamp';
import CategoryLineChart from '../chart/CategoryLineChart';

type Props = WithTranslation

interface State {
  data?: ContractedProductsAnalysis;
  financialYear: number;
  loading: boolean;
}

class DashboardContractedCategoryGraph extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      data: undefined,
      financialYear: dateToFinancialYear(new Date()),
      loading: true,
    };
  }

  componentDidMount() {
    const { financialYear } = this.state;
    this.updateGraph(financialYear).catch(console.error);
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
    const { t } = this.props;
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
          labels={data.labels === undefined ? [
            t('entities.graph.month.jun'),
            t('entities.graph.month.jul'),
            t('entities.graph.month.aug'),
            t('entities.graph.month.sep'),
            t('entities.graph.month.okt'),
            t('entities.graph.month.nov'),
            t('entities.graph.month.dec'),
            t('entities.graph.month.jan'),
            t('entities.graph.month.feb'),
            t('entities.graph.month.maa'),
            t('entities.graph.month.apr'),
            t('entities.graph.month.mei'),
            t('entities.graph.month.jun'),
          ] : data.labels}
          extraDropdown={(
            <Dropdown
              options={this.createDropdownOptions()}
              basic
              value={financialYear}
              float="right"
              onChange={(_, d) => { this.changeFinancialYear(d.value as number).catch(console.error); }}
            />
          )}
        />
      </Segment>
    );
  }
}

export default withTranslation()(DashboardContractedCategoryGraph);
