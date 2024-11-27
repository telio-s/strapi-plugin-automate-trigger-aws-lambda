import { Dialog, Button } from '@strapi/design-system';
import { WarningCircleIcon } from '../icons/WarningCircle';
import { TrashIcon } from '../icons/TrashIcon';
import { useRootContext } from '../../pages/HomePage';

const DeleteEventDialog = ({ id }: { id: string }) => {
  const { deleteLambdaEvent } = useRootContext();

  const onDelete = () => {
    deleteLambdaEvent(id);
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button variant="ghost">
          <TrashIcon />
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>Confirmation</Dialog.Header>
        <Dialog.Body icon={<WarningCircleIcon fill="danger600" />}>
          Are you sure you want to delete this?
        </Dialog.Body>
        <Dialog.Footer>
          <Dialog.Cancel>
            <Button fullWidth variant="tertiary">
              Cancel
            </Button>
          </Dialog.Cancel>
          <Dialog.Action>
            <Button onClick={() => onDelete()} fullWidth variant="danger-light">
              Yes, delete
            </Button>
          </Dialog.Action>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export { DeleteEventDialog };
