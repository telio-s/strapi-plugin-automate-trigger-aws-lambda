import { useRef, useState } from 'react';
import {
  Modal,
  Field,
  Button,
  Typography,
  Box,
  SingleSelect,
  SingleSelectOption,
  MultiSelectOption,
  MultiSelect,
} from '@strapi/design-system';
import { PlusIcon } from '../icons/PlusIcon';
import { TPlugin } from '../../../../shared/types';
import { useRootContext } from '../../pages/HomePage';
import { Controller, SubmitHandler } from 'react-hook-form';
import { InputField } from '../input/InputField';

const CreateEventModal = () => {
  const multiSelectRef = useRef<HTMLDivElement | null>(null);
  const { control, handleSubmit, contentTypes, formState, addLambdaEvent, validateLambda } =
    useRootContext();
  const { errors } = formState;
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [awsErrorMessage, setAwsErrorMessage] = useState<string>('');

  const onSubmit: SubmitHandler<TPlugin> = async (data) => {
    try {
      const validateLambdaResponse = await validateLambda(data);
      if (validateLambdaResponse.status === 200) {
        const addEventResponse = await addLambdaEvent(data);
        if (addEventResponse.status === 201) {
          setOpenModal(false);
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === 'AccessDeniedException') {
          setAwsErrorMessage(
            `${error.message}, Please check your AWS Role (lambda:InvokeFunction)`
          );
        } else {
          setAwsErrorMessage(error.message);
        }
      } else {
        console.log('[CreateEventModal] Error :', error);
      }
    }
  };
  return (
    <>
      <Modal.Root open={openModal} onOpenChange={setOpenModal}>
        <Modal.Trigger>
          <Button>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <PlusIcon />
              <Typography style={{ marginLeft: '4px' }}>Create Event</Typography>
            </div>
          </Button>
        </Modal.Trigger>
        <Modal.Content>
          <Modal.Header>
            <Modal.Title variant="beta">Create Event Trigger</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Box>
              <InputField
                label="Event name"
                name="name"
                input={{ placeholder: 'My trigger event', type: 'text', maxLength: 20 }}
                rules={{
                  required: 'This field is required',
                  maxLength: {
                    value: 20,
                    message: 'The length must be 20 characters',
                  },
                }}
              />
              <InputField
                label="AWS access key"
                name="aws.awsAccessKey"
                input={{ placeholder: 'AWS Access Key', type: 'text', maxLength: 20 }}
                rules={{
                  required: 'This field is required',
                  minLength: {
                    value: 20,
                    message: 'The length must be 20 characters',
                  },
                  maxLength: {
                    value: 20,
                    message: 'The length must be 20 characters',
                  },
                }}
              />
              <InputField
                label="AWS Secret key"
                name="aws.awsSecreteKey"
                input={{ placeholder: 'AWS Secret Key', type: 'password', maxLength: 40 }}
                rules={{
                  required: 'This field is required',
                  minLength: {
                    value: 40,
                    message: 'The length must be 20 characters',
                  },
                  maxLength: {
                    value: 40,
                    message: 'The length must be 40 characters',
                  },
                }}
              />
              <InputField
                label="Lambda function ARN"
                name="aws.arn"
                input={{
                  placeholder: 'arn:aws:lambda:ap-southeast-1:xxxxxxxxxxxx:function:funtion-name',
                  type: 'text',
                }}
                rules={{
                  required: 'This field is required',
                }}
              />
              <Field.Root error={errors.strapi?.contentType?.message}>
                <Controller
                  name="strapi.contentType"
                  control={control}
                  rules={{ required: 'This field is required' }}
                  render={({ field }) => (
                    <>
                      <Field.Label onClick={() => multiSelectRef.current?.focus()}>
                        Content type
                      </Field.Label>
                      <SingleSelect
                        {...field}
                        ref={multiSelectRef}
                        withTags
                        placeholder="Choose content type..."
                      >
                        {Object.keys(contentTypes).map((key) => (
                          <SingleSelectOption key={key} value={contentTypes[key].collectionName}>
                            {contentTypes[key].collectionName}
                          </SingleSelectOption>
                        ))}
                      </SingleSelect>
                    </>
                  )}
                />
                <Field.Error />
              </Field.Root>
              <Field.Root error={errors.strapi?.event?.message}>
                <Controller
                  name="strapi.event"
                  control={control}
                  rules={{ required: 'This field is required' }}
                  render={({ field }) => (
                    <>
                      <Field.Label onClick={() => multiSelectRef.current?.focus()}>
                        Event action
                      </Field.Label>
                      <MultiSelect
                        {...field}
                        ref={multiSelectRef}
                        withTags
                        placeholder="Choose event action..."
                      >
                        <MultiSelectOption value="afterCreate">afterCreate</MultiSelectOption>
                        <MultiSelectOption value="beforeCreate">beforeCreate</MultiSelectOption>
                      </MultiSelect>
                    </>
                  )}
                />

                {awsErrorMessage && (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      marginTop: '8px',
                    }}
                  >
                    <Typography variant="delta" textColor="danger700">
                      {awsErrorMessage}
                    </Typography>
                  </div>
                )}

                <Field.Error />
              </Field.Root>
            </Box>
          </Modal.Body>
          <Modal.Footer>
            <Modal.Close>
              <Button variant="tertiary">Cancel</Button>
            </Modal.Close>
            <Button onClick={handleSubmit(onSubmit)}>Confirm</Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root>
    </>
  );
};

export { CreateEventModal };
