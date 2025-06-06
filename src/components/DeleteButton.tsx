import { Button, Popup, SemanticCOLORS } from 'semantic-ui-react';
import React from 'react';
import { SemanticSIZES } from 'semantic-ui-react/dist/commonjs/generic';
import { useTranslation } from 'react-i18next';
import ResourceStatus from '../stores/resourceStatus';
import { SingleEntities } from '../stores/single/single';

interface DeleteProps {
  canDelete: boolean | undefined;
  entity: SingleEntities | 'InvoiceProduct';
  remove: () => void;
  status: ResourceStatus;
  size?: SemanticSIZES;
  color?: SemanticCOLORS;
  style?: Partial<CSSStyleDeclaration>;
}

function DeleteButton(props: DeleteProps) {
  const {
    canDelete, entity, remove, status, size = 'medium', color, style = {},
  } = props;
  const { t } = useTranslation();

  if (canDelete === true) {
    return (
      <Popup
        trigger={(
          <Button
            icon="trash"
            loading={status === ResourceStatus.DELETING}
            floated="right"
            size={size}
            color={color}
            style={style}
          />
        )}
        on="click"
        hideOnScroll
        content={(
          <Button
            color="red"
            onClick={remove}
            loading={status === ResourceStatus.DELETING}
            style={{ marginTop: '0.5em' }}
            title={t('buttons.delete.short')}
          >
            {t('buttons.delete.header', { entity: t(`entity.${entity.replace(/([a-z])([A-Z])/g, '$1$2').trim().toLowerCase()}`) })}
          </Button>
        )}
        header={t('buttons.delete.confirm')}
      />
    );
  }
  if (canDelete === false) {
    let deleteError: string;
    switch (entity) {
      case SingleEntities.Contract:
        deleteError = t('buttons.delete.errorContract');
        break;
      case SingleEntities.Invoice:
        deleteError = t('buttons.delete.errorInvoice');
        break;
      case SingleEntities.Company:
        deleteError = t('buttons.delete.errorCompany');
        break;
      case SingleEntities.Contact:
        deleteError = t('buttons.delete.errorContact');
        break;
      case SingleEntities.Product:
        deleteError = t('buttons.delete.errorProduct');
        break;
      case SingleEntities.ProductCategory:
        deleteError = t('buttons.delete.errorProductCategory');
        break;
      case SingleEntities.ProductInstance:
        deleteError = t('buttons.delete.errorProductInstance');
        break;
      case 'InvoiceProduct':
        deleteError = t('buttons.delete.errorInvoiceProduct');
        break;
      case SingleEntities.User:
        deleteError = t('buttons.delete.errorUser');
        break;
      default:
        throw new Error(`${entity} is not a valid DeleteEntity`);
    }

    return (
      <Popup
        trigger={(
          <Button.Group floated="right" size={size}>
            <Button
              disabled
              icon="trash"
              loading={status === ResourceStatus.DELETING}
              color={color}
              style={style}
            />
          </Button.Group>
        )}
        on="hover"
        mouseEnterDelay={500}
        content={deleteError}
      />
    );
  }
  return null;
}

export default DeleteButton;
