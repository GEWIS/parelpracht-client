import { PropsWithChildren, ReactNode } from 'react';
import { Grid, GridColumn, GridRow, Segment, StepGroup } from 'semantic-ui-react';
import ResourceStatus from '../../stores/resourceStatus';

interface Props extends PropsWithChildren {
  leftButton?: ReactNode;
  rightButton?: ReactNode;
  resourceStatus: ResourceStatus;
  title: string;
}

function FinancialDocumentProgress({
  children,
  leftButton = undefined,
  rightButton = undefined,
  resourceStatus,
  title,
}: Props) {
  return (
    <Segment
      secondary
      style={{ backgroundColor: 'rgba(243, 244, 245, 0.98)' }}
      loading={[ResourceStatus.FETCHING, ResourceStatus.SAVING, ResourceStatus.DELETING].includes(resourceStatus)}
    >
      <Grid columns={3}>
        <GridRow>
          <GridColumn verticalAlign="middle">{leftButton}</GridColumn>
          <GridColumn verticalAlign="middle">
            <h3 style={{ textAlign: 'center' }}>{title}</h3>
          </GridColumn>
          <GridColumn verticalAlign="middle">{rightButton}</GridColumn>
        </GridRow>
      </Grid>
      <StepGroup fluid widths={5}>
        {children}
      </StepGroup>
    </Segment>
  );
}

export default FinancialDocumentProgress;
