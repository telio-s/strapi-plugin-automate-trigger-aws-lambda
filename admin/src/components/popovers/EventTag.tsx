import { useState } from 'react';
import { Popover, Button, Tag, Typography } from '@strapi/design-system';
import { InformationIcon } from '../icons/InformationIcon';
import { TStrapiConfiguration } from '../../../../shared/types';

const EventTag = ({ event }: Omit<TStrapiConfiguration, 'contentType'>) => {
  const [showTag, setShowTag] = useState<boolean>(false);
  return (
    <Popover.Root open={showTag} onOpenChange={setShowTag}>
      <Popover.Trigger>
        <Button
          variant="secondary"
          style={{ width: 'fit-content' }}
          startIcon={<InformationIcon aria-hidden />}
        >
          <Typography>Show More</Typography>
        </Button>
      </Popover.Trigger>
      <Popover.Content>
        <Popover.ScrollArea>
          <div
            style={{
              paddingTop: '4px',
              paddingBottom: '4px',
              flexDirection: 'column',
              display: 'flex',
              rowGap: '4px',
            }}
          >
            {event.map((e: string) => (
              <Tag key={e} icon={<InformationIcon aria-hidden />}>
                {e}
              </Tag>
            ))}
          </div>
        </Popover.ScrollArea>
      </Popover.Content>
    </Popover.Root>
  );
};

export { EventTag };
