import { Button, Icon } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import ResourceStatus from '../stores/resourceStatus';
import { SingleEntities } from '../stores/single/single';
import DeleteButton from './DeleteButton';

interface Props {
  editing: boolean;
  canEdit: boolean | undefined;
  canDelete: boolean | undefined;
  canSave: boolean;
  entity: SingleEntities;
  status: ResourceStatus;
  style?: Partial<CSSStyleDeclaration>;

  cancel: () => void;
  edit: () => void;
  save: () => void;
  remove: () => void;
}

function PropsButtons(props: Props) {
  const { editing, canEdit, canDelete, canSave, entity, status, cancel, edit, save, remove, style = {} } = props;
  const { t } = useTranslation();

  switch (status) {
    default:
    case ResourceStatus.FETCHED:
      if (editing) {
        return (
          <>
            <Button
              icon
              labelPosition="left"
              color="green"
              floated="right"
              onClick={save}
              disabled={!canSave}
              style={style}
            >
              <Icon name="save" />
              {t('buttons.save')}
            </Button>
            <Button icon floated="right" onClick={cancel} style={style}>
              {t('buttons.cancel')}
            </Button>
            <DeleteButton entity={entity} canDelete={canDelete} status={status} remove={remove} style={style} />
          </>
        );
      }
      return (
        <>
          <Button icon labelPosition="left" floated="right" onClick={edit} style={style} disabled={!canEdit}>
            <Icon name="pencil" />
            {t('buttons.edit')}
          </Button>
          <DeleteButton entity={entity} canDelete={canDelete} status={status} remove={remove} style={style} />
        </>
      );
    case ResourceStatus.SAVING:
      return (
        <>
          <Button icon labelPosition="left" color="green" floated="right" loading style={style}>
            <Icon name="save" />
            {t('buttons.save')}
          </Button>
          <Button icon floated="right" onClick={cancel} disabled style={style}>
            {t('buttons.cancel')}
          </Button>
          <DeleteButton
            entity={entity}
            canDelete={canDelete === undefined ? undefined : false}
            status={status}
            remove={remove}
            style={style}
          />
        </>
      );
  }
}

export default PropsButtons;
