import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import User from './User';
import PopoverHover from './PopoverHover';

const AuditedInfo = ({
  creationTime,
  creatorId,
  lastModificationTime,
  lastModifierId,
  dateLastAccess
}) => {
  const infoIcon = (
    <div className="gx-auditedinfo-icon">
      <FontAwesomeIcon className="icon" icon="info-circle" />
    </div>
  );
  return (
    <div className="gx-auditedinfo-content">
      <table>
        {creationTime ? (
          <tr>
            <td className="gx-auditedinfo-content-title">Data de criação </td>
            <td>{creationTime}</td>
            {creatorId ? (
              <td>
                <PopoverHover
                  title="Criado por"
                  dataSource={creatorId}
                  activatorComponent={() => infoIcon}
                  customizedContent={(id) => <User id={id} />}
                />
              </td>
            ) : null}
          </tr>
        ) : null}

        {lastModificationTime ? (
          <tr>
            <td className="gx-auditedinfo-content-title">Última modificação</td>
            <td>{lastModificationTime}</td>
            {lastModifierId ? (
              <td>
                <PopoverHover
                  title="Editado por"
                  dataSource={lastModifierId}
                  activatorComponent={() => infoIcon}
                  customizedContent={(id) => <User id={id} />}
                />
              </td>
            ) : null}
          </tr>
        ) : null}

        {dateLastAccess ? (
          <tr>
            <td className="gx-auditedinfo-content-title">Último acesso</td>
            <td>{dateLastAccess}</td>
          </tr>
        ) : null}
      </table>
    </div>
  );
};

export default AuditedInfo;
