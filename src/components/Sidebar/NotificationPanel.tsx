import React, { useState } from "react";
import {
  Panel,
  NotificationsList,
  NotificationItem,
  UnreadDot,
  TitleRow,
  ClearAll,
  Title,
  Close,
  Text,
  More,
} from "./NotificationPanel.styles";

interface Notification {
  id: number;
  title: string;
  text: string;
  read: boolean;
}

interface NotificationPanelProps {
  notifications: Notification[];
  onClose: (id: number) => void;
  onClearAll: () => void;
  onMarkRead: (id: number) => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({
  notifications,
  onClose,
  onClearAll,
  onMarkRead,
}) => {
  const [expanded, setExpanded] = useState<number | null>(null);

  const handleMore = (id: number) => {
    setExpanded(expanded === id ? null : id);
    if (notifications.find((n) => n.id === id && !n.read)) {
      onMarkRead(id);
    }
  };

  return (
    <Panel>
      <TitleRow padding={"8px 0px"}>
        <ClearAll onClick={onClearAll}>Limpar todas</ClearAll>
        <div></div>
      </TitleRow>
      <NotificationsList>
        {notifications.map((n) => (
          <NotificationItem key={n.id} expanded={expanded === n.id}>
            <TitleRow>
              {!n.read && <UnreadDot />}
              <Title>{n.title}</Title>
              <Close onClick={() => onClose(n.id)}>×</Close>
            </TitleRow>
            <Text>
              {expanded === n.id
                ? n.text
                : n.text.slice(0, 120) + (n.text.length > 120 ? "..." : "")}
            </Text>
            {n.text.length > 120 && (
              <More onClick={() => handleMore(n.id)}>
                {expanded === n.id ? "Ver menos" : "Ver mais..."}
              </More>
            )}
          </NotificationItem>
        ))}
      </NotificationsList>
    </Panel>
  );
};

export default NotificationPanel;
