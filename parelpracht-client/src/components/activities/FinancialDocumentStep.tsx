import { Icon, Step, StepContent, StepDescription, StepTitle } from 'semantic-ui-react';
import { JSX, useState } from 'react';
import { ContractStatus, InvoiceStatus, ProductInstanceStatus } from '../../clients/server.generated';
import ResourceStatus from '../../stores/resourceStatus';
import FinancialDocumentStatusModal from './FinancialDocumentStatusModal.tsx';

export enum FinancialDocumentStepStatus {
  COMPLETED,
  CREATABLE,
  CANCELLED,
  DEFERRED,
}

interface Props<T extends ContractStatus | InvoiceStatus | ProductInstanceStatus> {
  documentStatus: T;
  stepStatus?: FinancialDocumentStepStatus | undefined;
  title: string;
  description?: string | undefined;
  resourceStatus: ResourceStatus;
  onSave: (documentStatus: T, description: string) => void;
}

function FinancialDocumentStep<T extends ContractStatus | InvoiceStatus | ProductInstanceStatus>({
  stepStatus = undefined,
  title,
  description,
  documentStatus,
  resourceStatus,
  onSave: onSaveOriginal,
}: Props<T>) {
  const [documentStatusModalOpen, setDocumentStatusModalOpen] = useState(false);

  const getIcon = (): JSX.Element | null => {
    switch (stepStatus) {
      case FinancialDocumentStepStatus.COMPLETED:
        return <Icon name="check" color="green" />;
      case FinancialDocumentStepStatus.CANCELLED:
        return <Icon color="red" name="close" />;
      case FinancialDocumentStepStatus.DEFERRED:
        return <Icon color="orange" name="stopwatch" />;
      default:
        return null;
    }
  };

  return (
    <>
      <FinancialDocumentStatusModal
        documentStatus={documentStatus}
        documentStatusText={title}
        open={documentStatusModalOpen}
        originalDescription={description}
        resourceStatus={resourceStatus}
        onClose={() => {
          setDocumentStatusModalOpen(false);
        }}
        onSave={(documentStatus, description) => {
          onSaveOriginal(documentStatus, description);
          setDocumentStatusModalOpen(false);
        }}
      />
      <Step
        completed={stepStatus === FinancialDocumentStepStatus.COMPLETED}
        onClick={
          stepStatus === FinancialDocumentStepStatus.CREATABLE ? () => setDocumentStatusModalOpen(true) : undefined
        }
      >
        {getIcon()}
        <StepContent>
          <StepTitle>{title}</StepTitle>
          <StepDescription>{description}</StepDescription>
        </StepContent>
      </Step>
    </>
  );
}

export default FinancialDocumentStep;
