import React, { useState } from 'react';
import {
  Button, Checkbox, Container, Dropdown, Grid, Menu, Modal, Portal, Segment,
} from 'semantic-ui-react';

function CompanyStatusFilter() {
  const [open, changeOpen] = useState(false);
  return (
    <Portal
      open
      trigger={(
        <Button
          className="icon"
          icon="filter"
          style={{ margin: '-8px -6px', float: 'right', padding: '11px' }}
        />
      )}
    >
      <Grid verticalAlign="middle" textAlign="center">
        <Grid.Column width={6}>
          <Container>
            <Segment>
              Test
            </Segment>
          </Container>
        </Grid.Column>
      </Grid>
    </Portal>
  );
}

export default CompanyStatusFilter;

/* <Dropdown
  style={{ margin: '-8px -6px', float: 'right', padding: '11px' }}
  selection
  multiple
  search
  button
  options={[{ key: 0, value: 'ACTIVE', text: 'Active' },
  { key: 1, value: 'INACTIVE', text: 'Inactive' }]}
/> */
