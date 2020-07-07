import React, { useEffect, useState } from 'react';
import { Prompt } from 'react-router-dom';
import { Modal, ConfirmDialog } from 'antd';
import { Beforeunload } from 'react-beforeunload';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const RouteLeavingGuard = ({
  when = false,
  navigate,
  shouldBlockNavigation
}) => {
  const [lastLocation, setLastLocation] = useState(null);
  const [confirmedNavigation, setConfirmedNavigation] = useState(false);

  const handleBlockedNavigation = (nextLocation) => {
    if (
      !confirmedNavigation &&
      (!shouldBlockNavigation || shouldBlockNavigation(nextLocation))
    ) {
      setLastLocation(nextLocation);

      Modal.confirm({
        title: 'Você tem certeza que deseja sair sem salvar?',
        icon: <ExclamationCircleOutlined />,
        content: 'As alterações realizadas não foram salvas.',
        okText: 'Sair',
        cancelText: 'Cancelar',
        onOk() {
          setConfirmedNavigation(true);
        }
      });

      return false;
    }
    return true;
  };

  useEffect(() => {
    if (confirmedNavigation && lastLocation) {
      navigate(lastLocation.pathname);
    }
  }, [confirmedNavigation, lastLocation]);

  return (
    <>
      {when && (
        <Beforeunload onBeforeunload={(event) => event.preventDefault()} />
      )}
      <Prompt when={when} message={handleBlockedNavigation} />
    </>
  );
};

export default RouteLeavingGuard;
