import { useEffect, createContext, useContext, useState } from 'react';
import { Box, Flex, Alert } from '@strapi/design-system';
import { useFetchClient } from '@strapi/admin/strapi-admin';
import { useForm, Control, UseFormHandleSubmit, FormState } from 'react-hook-form';
import { PLUGIN_ID } from '../pluginId';
import { TPlugin, TApiContentTypes } from '../../../shared/types';
import { CreateEventModal } from '../components/layouts/CreateEventModal';
import { ShowEvetns } from '../components/layouts/ShowEvents';

export type TRootContext = {
  formState: FormState<TPlugin>;
  control: Control<TPlugin, any>;
  handleSubmit: UseFormHandleSubmit<TPlugin, undefined>;
  contentTypes: TApiContentTypes;
  events: TPlugin[];
  addLambdaEvent: (payload: TPlugin) => Promise<any>;
  validateLambda: (payload: TPlugin) => Promise<any>;
  deleteLambdaEvent: (id: string) => Promise<any>;
} | null;
export const RootContext = createContext<TRootContext>(null);
export const useRootContext = () => {
  const context = useContext(RootContext);
  if (!context) {
    throw new Error('useRootContext must be used within a RootContextProvider');
  }
  return context as NonNullable<TRootContext>;
};

const HomePage = () => {
  const { get, post, del } = useFetchClient();
  const { control, handleSubmit, formState } = useForm<TPlugin>({
    defaultValues: {
      name: '',
      aws: { awsAccessKey: '', awsSecreteKey: '', arn: '' },
      strapi: { contentType: '', event: [] },
    },
  });
  const [contentTypes, setContentTypes] = useState<TApiContentTypes>();
  const [events, setEvents] = useState<Array<TPlugin>>();
  const [openAlert, setOpenAlert] = useState<{ status: boolean; variant: string; label: string }>({
    status: false,
    variant: 'success',
    label: 'Add Lambda event success.',
  });

  useEffect(() => {
    getContentType();
    getEvents();
    return () => {};
  }, []);

  const handleAlert = (status: boolean, variant: string, label: string) => {
    setOpenAlert({ status, variant, label });
  };

  const getContentType = async () => {
    const requestURL = `/${PLUGIN_ID}/strapi/contentTypes`;
    const { data } = await get(requestURL);
    setContentTypes(data);
  };

  const getEvents = async () => {
    const requestURL = `/${PLUGIN_ID}/getEvents`;
    const response = await get(requestURL);
    const { body } = response.data;
    setEvents(body);
  };

  const addLambdaEvent = async (payload: TPlugin) => {
    const requestURL = `/${PLUGIN_ID}/addEvent`;
    const response = await post(requestURL, payload);
    if (response.data.status === 201) {
      handleAlert(true, 'success', 'Add Lambda event success.');
      setEvents((prev) => (prev ? [...prev, response.data.body] : []));
    }
    return response.data;
  };

  const validateLambda = async (payload: TPlugin) => {
    const requestURL = `/${PLUGIN_ID}/validateAWSKey`;
    const response = await post(requestURL, payload);
    return response.data;
  };

  const deleteLambdaEvent = async (id: string) => {
    const requestURL = `/${PLUGIN_ID}/deleteEvent/${id}`;
    const response = await del(requestURL);
    if (response.data.status === 200) {
      handleAlert(true, 'danger', 'Delete event successfuly.');
      setEvents((prev) => prev?.filter((e) => e.id !== id));
    }
    return response.data;
  };

  const contextValue: NonNullable<TRootContext> = {
    formState,
    control,
    handleSubmit,
    contentTypes,
    events,
    addLambdaEvent,
    validateLambda,
    deleteLambdaEvent,
  };

  return (
    <RootContext.Provider value={contextValue}>
      <Box padding={4} margin={6} shadow="filterShadow">
        {openAlert && openAlert.status === true && (
          <Flex
            direction="column"
            alignItems="center"
            gap={1}
            position="fixed"
            left="50%"
            transform="translateX(-50%)"
          >
            <Alert
              closeLabel="Close"
              title="Event"
              variant="success"
              onClose={() => handleAlert(false, openAlert.variant, openAlert.label)}
            >
              {openAlert.label}
            </Alert>
          </Flex>
        )}
        <Flex justifyContent="flex-end" margin={2}>
          <CreateEventModal />
        </Flex>
        <ShowEvetns />
      </Box>
    </RootContext.Provider>
  );
};

export { HomePage };
