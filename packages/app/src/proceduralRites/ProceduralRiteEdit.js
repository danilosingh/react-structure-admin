import React, { useState } from 'react';
import { Input, Divider, Row, Col, Button } from 'antd';
import { useDispatch } from 'react-redux';
import {
  generateUUID,
  ModalEdit,
  FormItem,
  DragSortingTable,
  RemoteSelect
} from 'react-structure-admin';

import {
  changeSort,
  updateSteps,
  addStep
} from 'stores/proceduralRites/proceduralRiteActions';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 }
  },
  labelAlign: 'left',
  colon: false
};

const initialValues = {
  steps: []
};

const ProceduralRiteEdit = (props) => {
  const { form } = props;
  const dispach = useDispatch();
  const [selectedStep, setSelectedStep] = useState(undefined);

  const validateEditPressStep = (proceduralRiteStep, steps, fieldName) => {
    if (!proceduralRiteStep) {
      return {
        [fieldName || 'name']: {
          value: proceduralRiteStep,
          errors: [new Error('Selecione uma etapa')]
        }
      };
    }

    if (steps.findIndex((c) => c.step.id === proceduralRiteStep.step.id) > -1) {
      return {
        [fieldName || 'name']: {
          value: proceduralRiteStep.step.name,
          errors: [new Error('Etapa já está vinculada')]
        }
      };
    }
    return false;
  };

  const columns = [
    {
      dataIndex: ['step', 'name'],
      key: 'step.name',
      inputType: 'text',
      required: true,
      editable: true,
      autoFocus: true
    }
  ];

  const AddStep = () => {
    let { proceduralRiteSteps } = props.data;

    if (!Array.isArray(proceduralRiteSteps)) {
      proceduralRiteSteps = [];
    }

    let proceduralRiteStep;

    if (selectedStep) {
      proceduralRiteStep = {
        uuid: generateUUID(),
        ordination: proceduralRiteSteps.length + 1,
        step: {
          id: selectedStep.id,
          name: selectedStep.name
        }
      };
    } else {
      proceduralRiteStep = undefined;
    }

    const errors = validateEditPressStep(
      proceduralRiteStep,
      proceduralRiteSteps,
      'remoteStep'
    );

    if (errors) {
      form.setFields(errors);
      return;
    }

    dispach(addStep(proceduralRiteStep));
    setSelectedStep(undefined);
    form.setFields({ remoteStep: undefined });
  };

  const handleChangeSort = (data) => {
    dispach(changeSort(data));
  };

  const handleUpdateStep = (data) => {
    dispach(updateSteps(data));
  };

  const beforeSubmit = (dataSubmit) => {
    return {
      ...dataSubmit,
      proceduralRiteSteps: props.data.proceduralRiteSteps
    };
  };

  return (
    <ModalEdit
      {...props}
      beforeSubmit={beforeSubmit}
      showAuditedInfo
      initialValues={initialValues}
      size="md"
    >
      {(data) => (
        <>
          <FormItem
            name="name"
            label="Nome"
            isRequired
            initialValue={data.name}
          >
            <Input maxLength={60} />
          </FormItem>
          <Divider orientation="left">Etapas</Divider>
          <Row>
            <Col span={20}>
              <FormItem
                {...formItemLayout}
                name="remoteStep"
                label="Etapa"
                initialValue={undefined}
              >
                <RemoteSelect
                  resource="steps"
                  onSelect={(step) => setSelectedStep(step)}
                />
              </FormItem>
            </Col>
            <Col span={4}>
              <Button type="primary" onClick={AddStep}>
                Adicionar
              </Button>
            </Col>
          </Row>
          <DragSortingTable
            removable
            rowKey={(record) => record.id ?? record.uuid}
            dataSource={data.proceduralRiteSteps}
            showHeader={false}
            onChangeSort={handleChangeSort}
            columns={columns}
            validateRow={validateEditPressStep}
            onSaveRow={handleUpdateStep}
          />
        </>
      )}
    </ModalEdit>
  );
};

export default ProceduralRiteEdit;
