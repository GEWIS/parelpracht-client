import React, { useState } from 'react';
import {
  Button, Dropdown, Grid, Segment,
} from 'semantic-ui-react';

interface Props {
  countTotal: number;
  countFetched: number;
  skip: number;
  take: number;

  setTake: (take: number) => void;
  nextPage: () => void;
  prevPage: () => void;
}

const takeOptions = [
  { key: 25, value: 25, text: '25' },
  { key: 50, value: 50, text: '50' },
  { key: 100, value: 100, text: '100' },
  { key: 250, value: 250, text: '250' },
  { key: 500, value: 500, text: '500' },
  { key: 999, value: 'All', text: 'All' },
];

function TablePagination({
  countTotal, countFetched, skip, take,
  setTake, nextPage, prevPage,
}: Props) {
  const canPrev = skip > 0;
  const canNext = skip + take < countTotal;

  const [selectedAll, changeSelectedAll] = useState(false);

  return (
    <Segment attached="bottom">
      <Grid columns={2} verticalAlign="middle">
        <Grid.Column>
          {`Showing ${skip + 1} to ${Math.min(skip + countFetched, countTotal)} of ${countTotal}`}
        </Grid.Column>
        <Grid.Column>
          <Button.Group floated="right">
            <Button icon="chevron left" disabled={!canPrev} onClick={prevPage} />
            <Button icon="chevron right" disabled={!canNext} onClick={nextPage} />
          </Button.Group>
          <Button.Group floated="right">
            <Dropdown
              options={takeOptions}
              button
              basic
              text={`${selectedAll ? 'All' : take} items`}
              value={take}
              onChange={(_, data) => {
                if (data.value === 'All') {
                  changeSelectedAll(true);
                  setTake(countTotal);
                } else {
                  changeSelectedAll(false);
                  setTake(data.value as number);
                }
              }}
              style={{ marginRight: '1em' }}
            />
          </Button.Group>
        </Grid.Column>
      </Grid>
    </Segment>
  );
}

export default TablePagination;
