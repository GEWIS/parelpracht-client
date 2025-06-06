import { useEffect, useState, useRef } from 'react';
import {
  Dropdown, Grid, Popup, Segment, Table,
} from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { Bar } from 'react-chartjs-2';
import {ChartJSOrUndefined} from "react-chartjs-2/dist/types";
import { ChartData } from 'chart.js';
import { useNavigate } from 'react-router-dom';
import { Client, DashboardProductInstanceStats } from '../../clients/server.generated';
import { dateToFinancialYear } from '../../helpers/timestamp';
import { formatPriceFull } from '../../helpers/monetary';
import './FinancialOverview.scss';
import { FinancialOverviewField } from './FinancialOverviewField';

function FinancialOverview() {
  const chart = useRef<ChartJSOrUndefined<'bar'> | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [data, setData] = useState<DashboardProductInstanceStats | undefined>(undefined);
  const [financialYear, setFinancialYear] = useState<number>(dateToFinancialYear(new Date()));
  const [loading, setLoading] = useState<boolean>(true);

  const updateGraph = async (year: number) => {
    setLoading(true);
    const client = new Client();
    const graphData = await client.getDashboardProductInstanceStatistics(year);
    setData(graphData);
    setLoading(false);
  };

  const goToInsightsTable = (status: 'suggested' | 'contracted' | 'delivered' | 'invoiced') => {
    navigate(`/insights#${status}&${financialYear}`);
  };

  const createBarChartDataObject = (): ChartData<'bar'> => {
    return {
      labels: [
        t('dashboard.financialOverview.suggested'),
        t('dashboard.financialOverview.contractedShort'),
        t('dashboard.financialOverview.delivered'),
        t('dashboard.financialOverview.invoiced'),
        t('dashboard.financialOverview.paid')],
      datasets: [
        {
          label: t('entities.graph.label.amount'),
          backgroundColor: 'rgba(41, 48, 101, 0.8)',
          borderColor: 'rgba(41, 48, 101, 1)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(255, 148, 128, 0.8)',
          hoverBorderColor: 'rgba(41, 48, 101, 1)',
          data: data ? [data?.suggested.amount, data?.contracted.amount, data?.delivered.amount,
            data?.invoiced.delivered.amount, data?.paid.amount] : [],
        },
        {
          label: t('dashboard.financialOverview.delivered'),
          backgroundColor: 'rgba(41, 48, 101, 0.8)',
          borderColor: 'rgba(41, 48, 101, 1)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(255, 148, 128, 0.8)',
          hoverBorderColor: 'rgba(41, 48, 101, 1)',
          data: data ? [0, 0, 0, data?.invoiced.notDelivered.amount, 0] : [],
        },
      ],
    };
  };

  const createDropdownOptions = () => {
    const financialYears = data?.financialYears || [];
    const result: object[] = [];
    financialYears.forEach((y: number) => {
      result.push({
        key: y, value: y, text: `${(y - 1).toString()} - ${y.toString()}`,
      });
    });
    return result;
  };

  useEffect(() => {
    updateGraph(financialYear).catch(console.error);
  }, [financialYear]);

  return (
    <Segment loading={loading} className="financial-overview">
      <Grid style={{ marginBottom: '1em' }}>
        <Grid.Row columns={2}>
          <Grid.Column textAlign="left">
            <h3>{t('dashboard.financialOverview.header')}</h3>
          </Grid.Column>
          <Grid.Column textAlign="right" verticalAlign="bottom" style={{ fontSize: '1.2em' }}>
            <Dropdown
              options={createDropdownOptions()}
              basic
              value={financialYear}
              float="right"
              onChange={(_value, d) => setFinancialYear(d.value as number)}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <div>
        <Bar
          ref={chart}
          data={createBarChartDataObject()}
          options={{
            scales: {
              x: {
                stacked: true,
              },
              y : {
                stacked: true,
                beginAtZero: true,
                ticks: {
                  callback(value: number | string) {
                    if (typeof value === 'string') return 'TEMP';
                    return formatPriceFull(value);
                  },
                },
              },
            },
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                callbacks: {
                  label(tooltipItem) {
                    return formatPriceFull(tooltipItem.raw as number);
                  },
                },
              },
            },
          }}
        />
      </div>
      <Table celled definition style={{ marginTop: '2em' }} unstackable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell />
            <Table.HeaderCell>
              <Popup
                trigger={(
                  <span>
                      {t('dashboard.financialOverview.suggested')}
                    </span>
                )}
                header={t('dashboard.financialOverview.suggested')}
                content={t('dashboard.financialOverview.description.suggested')}
              />
            </Table.HeaderCell>
            <Table.HeaderCell>
              <Popup
                trigger={(
                  <span>
                      {t('dashboard.financialOverview.contracted')}
                    </span>
                )}
                header={t('dashboard.financialOverview.contracted')}
                content={t('dashboard.financialOverview.description.contracted')}
              />
            </Table.HeaderCell>
            <Table.HeaderCell>
              <Popup
                trigger={(
                  <span>
                      {t('dashboard.financialOverview.delivered')}
                    </span>
                )}
                header={t('dashboard.financialOverview.delivered')}
                content={t('dashboard.financialOverview.description.delivered')}
              />
            </Table.HeaderCell>
            <Table.HeaderCell>
              <Popup
                trigger={(
                  <span>
                      {t('dashboard.financialOverview.invoiced')}
                    </span>
                )}
                header={t('dashboard.financialOverview.invoiced')}
                content={t('dashboard.financialOverview.description.invoiced')}
              />
            </Table.HeaderCell>
            <Table.HeaderCell>
              <Popup
                trigger={(
                  <span>
                      {t('dashboard.financialOverview.paid')}
                    </span>
                )}
                header={t('dashboard.financialOverview.paid')}
                content={t('dashboard.financialOverview.description.paid')}
              />
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>{t('dashboard.financialOverview.value')}</Table.Cell>
            <Table.Cell onClick={() => goToInsightsTable('suggested')}>
              <FinancialOverviewField
                fields={[t('dashboard.financialOverview.suggested')]}
                values={[data?.suggested.amount || 0]}
                type="value"
              />
            </Table.Cell>
            <Table.Cell onClick={() => goToInsightsTable('contracted')}>
              <FinancialOverviewField
                fields={[t('dashboard.financialOverview.contracted')]}
                values={[data?.contracted.amount || 0]}
                type="value"
              />
            </Table.Cell>
            <Table.Cell onClick={() => goToInsightsTable('delivered')}>
              <FinancialOverviewField
                fields={[t('dashboard.financialOverview.delivered')]}
                values={[data?.delivered.amount || 0]}
                type="value"
              />
            </Table.Cell>
            <Table.Cell onClick={() => goToInsightsTable('invoiced')}>
              <FinancialOverviewField
                fields={[t('dashboard.financialOverview.delivered'), t('dashboard.financialOverview.notDelivered')]}
                values={[
                  data?.invoiced.delivered.amount || 0, data?.invoiced.notDelivered.amount || 0]}
                type="value"
                header={t('dashboard.financialOverview.invoiced')}
              />
            </Table.Cell>
            <Table.Cell>
              <FinancialOverviewField
                fields={[t('dashboard.financialOverview.paid')]}
                values={[data?.paid.amount || 0]}
                type="value"
              />
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>{t('dashboard.financialOverview.nrOfProducts')}</Table.Cell>
            <Table.Cell onClick={() => goToInsightsTable('suggested')}>
              <FinancialOverviewField
                fields={[t('dashboard.financialOverview.suggested')]}
                values={[data?.suggested.nrOfProducts || 0]}
                type="amount"
              />
            </Table.Cell>
            <Table.Cell onClick={() => goToInsightsTable('contracted')}>
              <FinancialOverviewField
                fields={[t('dashboard.financialOverview.contracted')]}
                values={[data?.contracted.nrOfProducts || 0]}
                type="amount"
              />
            </Table.Cell>
            <Table.Cell onClick={() => goToInsightsTable('delivered')}>
              <FinancialOverviewField
                fields={[t('dashboard.financialOverview.delivered')]}
                values={[data?.delivered.nrOfProducts || 0]}
                type="amount"
              />
            </Table.Cell>
            <Table.Cell onClick={() => goToInsightsTable('delivered')}>
              <FinancialOverviewField
                fields={[t('dashboard.financialOverview.delivered'), t('dashboard.financialOverview.notDelivered')]}
                values={[
                  data?.invoiced.delivered.nrOfProducts || 0,
                  data?.invoiced.notDelivered.nrOfProducts || 0]}
                type="amount"
                header={t('dashboard.financialOverview.invoiced')}
              />
            </Table.Cell>
            <Table.Cell>
              <FinancialOverviewField
                fields={[t('dashboard.financialOverview.paid')]}
                values={[data?.paid.nrOfProducts || 0]}
                type="amount"
              />
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>

    </Segment>
  );
}

export default FinancialOverview;
