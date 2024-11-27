import { Box, EmptyStateLayout, Typography } from '@strapi/design-system';
import { useRootContext } from '../../pages/HomePage';
import { TPlugin } from '../../../../shared/types';
import { EventTag } from '../popovers/EventTag';
import { DeleteEventDialog } from './DeleteEventDialog';

const ShowEvetns = () => {
  const { events } = useRootContext();

  const getLambdaName = (func: string) => {
    const spliting = func.split(':');
    return spliting[spliting.length - 1];
  };

  return (
    <>
      {events && events.length > 0 ? (
        <Box
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '8px' }}
        >
          {events.map((event: TPlugin) => {
            return (
              <Box
                key={event?.id}
                style={{
                  display: 'flex',
                  borderRadius: '0.75rem',
                  padding: '8px',
                  flexDirection: 'row-reverse',
                }}
                background="neutral200"
              >
                {event?.id && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <DeleteEventDialog id={event.id} />
                  </div>
                )}
                <Box
                  style={{
                    display: 'grid',
                    gap: '4px',
                    flex: '1 1',
                  }}
                >
                  <Typography variant="delta">{event.name}</Typography>
                  <Typography>{event?.strapi?.contentType}</Typography>
                  <Typography>{getLambdaName(event?.aws?.arn)}</Typography>
                  <EventTag event={event?.strapi?.event} />
                </Box>
              </Box>
            );
          })}
        </Box>
      ) : (
        <Box background="neutral100">
          <EmptyStateLayout content="You don't have any content yet..." />
        </Box>
      )}
    </>
  );
};
export { ShowEvetns };
