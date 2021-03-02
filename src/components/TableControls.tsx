import React, { useEffect, useState } from 'react';
import { Button, Grid, Input } from 'semantic-ui-react';
import TimeAgo from 'javascript-time-ago';
import ResourceStatus from '../stores/resourceStatus';

interface Props {
  status: ResourceStatus;
  countFetched: number;
  countTotal: number;
  column: string;
  lastUpdated: Date;
  search: string;

  refresh: () => void;
  setSearch: (search: string) => void;

  bottomLine?: string;
}

function TableControls(props: Props) {
  // Make sure the component refreshes every minute to update "updated ..."
  const [, setTime] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 60 * 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const timeAgo = new TimeAgo();
  return (
    <Grid columns={2}>
      <Grid.Column style={{ paddingTop: 0, paddingBottom: '0.5em' }} verticalAlign="middle">
        <p>
          {`${props.countFetched} of ${props.countTotal} item(s) shown \u00b7
            sorted on ${props.column} \u00b7
            updated ${timeAgo.format(props.lastUpdated)}`}
          {props.bottomLine !== undefined ? <br /> : undefined}
          {props.bottomLine}
        </p>
      </Grid.Column>
      <Grid.Column style={{ paddingTop: 0, paddingBottom: '0.5em' }} verticalAlign="middle">
        <Button
          icon="refresh"
          floated="right"
          onClick={props.refresh}
          loading={props.status === ResourceStatus.FETCHING}
        />

        <Input
          style={{ float: 'right' }}
          icon="search"
          iconPosition="left"
          placeholder="Search..."
          value={props.search}
          action={
            <Button icon="close" onClick={() => props.setSearch('')} />
          }
          onChange={(e) => props.setSearch(e.target.value)}
        />
      </Grid.Column>
    </Grid>
  );
}

TableControls.defaultProps = {
  bottomLine: undefined,
};

export default TableControls;
