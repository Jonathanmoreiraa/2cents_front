import React, { useState, useRef } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import NotificationPanel from "../components/Sidebar/NotificationPanel";
import { FaBars } from "react-icons/fa";
import {
  LayoutContainer,
  MainContent,
  TopBarMobile,
  HamburgerButton,
  ResponsiveSidebar,
  Overlay,
  DesktopSidebar,
  // IconButton,
  // NotificationDot,
  MobileNotificationPanelWrapper,
  OverlayNotification,
} from "./main-layout.styles";

const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  // TODO: Depois da criação da rota de notificações, substituir por uma requisição ao backend
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Notificação 1",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ac dignissim neque. Duis tincidunt tincidunt odio vel tempus. Morbi egestas tristique metus. Fusce dapibus euismod efficitur. Quisque dignissim neque...",
      read: false,
    },
    {
      id: 2,
      title: "Notificação 2",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ac dignissim neque. Duis tincidunt tincidunt odio vel tempus. Morbi egestas tristique metus. Fusce dapibus euismod efficitur. Quisque dignissim neque...",
      read: false,
    },
    {
      id: 3,
      title: "Notificação 3",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ac dignissim neque. Duis tincidunt tincidunt odio vel tempus. Morbi egestas tristique metus. Fusce dapibus euismod efficitur. Quisque dignissim neque...",
      read: true,
    },
  ]);
  //const unreadCount = notifications.filter((n) => !n.read).length;

  const handleSidebarClose = () => setSidebarOpen(false);
  const handleSidebarOpen = () => setSidebarOpen(!sidebarOpen);

  const handleCloseNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };
  const handleClearAll = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };
  const handleMarkRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const panelRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (!showNotifications) return;
    function handleClickOutside(event: MouseEvent) {
      if (bellRef.current && bellRef.current.contains(event.target as Node)) {
        return;
      }
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotifications]);

  return (
    <LayoutContainer>
      <TopBarMobile>
        <HamburgerButton onClick={handleSidebarOpen} aria-label="Abrir menu">
          <FaBars />
        </HamburgerButton>
        {/* <IconButton ref={bellRef} onClick={() => setShowNotifications(prev => !prev)} aria-label="Notificações">
          <FaRegBell color="#fff" size={22} />
          {unreadCount > 0 && <NotificationDot>{unreadCount}</NotificationDot>}
        </IconButton> */}
        {showNotifications && (
          <>
            <OverlayNotification onClick={() => setShowNotifications(false)} />
            <MobileNotificationPanelWrapper ref={panelRef}>
              <NotificationPanel
                notifications={notifications}
                onClose={handleCloseNotification}
                onClearAll={handleClearAll}
                onMarkRead={handleMarkRead}
              />
            </MobileNotificationPanelWrapper>
          </>
        )}
      </TopBarMobile>
      <DesktopSidebar>
        <Sidebar />
      </DesktopSidebar>
      <ResponsiveSidebar open={sidebarOpen}>
        <Sidebar />
      </ResponsiveSidebar>
      <Overlay open={sidebarOpen} onClick={handleSidebarClose} />
      <MainContent>
        <Outlet />
      </MainContent>
    </LayoutContainer>
  );
};

export default MainLayout;
