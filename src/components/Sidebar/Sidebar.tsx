import React, { useState, useRef, useEffect } from "react";
import {
  FaChartBar,
  FaMoneyBillWave,
  FaWallet,
  FaCog,
  FaSignOutAlt,
  FaChevronDown,
} from "react-icons/fa";
// import NotificationPanel from './NotificationPanel';
import {
  SidebarContainer,
  TopSection,
  // AvatarImg,
  // BellWrapper,
  // NotificationDot,
  Menu,
  MenuItem,
  SubMenu,
  SubMenuItem,
  BottomSection,
  ExitItem,
} from "./sidebar.styles";
import { useDispatch } from "react-redux";
import { logout } from "../../store/slices/auth-slice";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import logo from "../../assets/logo_2cents_white.svg";
import theme from "../../theme";
// import { useMediaQuery } from '@mui/material';
// import { OverlayNotification } from '../../layouts/MainLayout.styles';

// TODO: Depois da criação da rota de notificações, substituir por uma requisição ao backend
// const mockNotifications = [
//   {
//     id: 1,
//     title: 'Notificação 1',
//     text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ac dignissim neque. Duis tincidunt tincidunt odio vel tempus. Morbi egestas tristique metus. Fusce dapibus euismod efficitur. Quisque dignissim neque...'
//     , read: false
//   },
//   {
//     id: 2,
//     title: 'Notificação 2',
//     text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ac dignissim neque. Duis tincidunt tincidunt odio vel tempus. Morbi egestas tristique metus. Fusce dapibus euismod efficitur. Quisque dignissim neque...'
//     , read: false
//   },
//   {
//     id: 3,
//     title: 'Notificação 3',
//     text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ac dignissim neque. Duis tincidunt tincidunt odio vel tempus. Morbi egestas tristique metus. Fusce dapibus euismod efficitur. Quisque dignissim neque...'
//     , read: true
//   }
// ];

const Sidebar: React.FC = () => {
  const [financasOpen, setFinancasOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  // const [notifications, setNotifications] = useState(mockNotifications);
  const panelRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLDivElement>(null);
  const pathname = window.location.pathname;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  /*  const isMobile = useMediaQuery('(max-width:900px)');
 
   const unreadCount = notifications.filter(n => !n.read).length;
 
   const handleBellClick = () => {
     setShowNotifications((prev) => !prev);
   };
 
   const putNotification = async (data: object) => {
     await fetch('/api/notification', { method: 'PUT', body: JSON.stringify(data) });
     return new Promise(resolve => setTimeout(resolve, 300));
   }; */

  /* const handleCloseNotification = async (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    await putNotification({ id, read: true });
  };

  const handleClearAll = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    await putNotification({ clear_all: true });
  };

  const handleMarkRead = async (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    await putNotification({ id, read: true });
  }; */

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  useEffect(() => {
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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);

  useEffect(() => {
    setSelected(pathname);

    if (pathname === "/receitas" || pathname === "/despesas") {
      setFinancasOpen(true);
    }
  }, [pathname]);

  return (
    <SidebarContainer>
      <TopSection>
        {/* TODO: Adicionar imagem padrão aqui para todos e o usuário poderá mudar para o dele */}
        {/* <AvatarImg src="https://randomuser.me/api/portraits/men/32.jpg" alt="Avatar" />
        {!isMobile && (
          <BellWrapper ref={bellRef}>
            <FaRegBell size={24} onClick={handleBellClick} style={{ cursor: 'pointer' }} />
            {unreadCount > 0 && <NotificationDot onClick={handleBellClick}>{unreadCount}</NotificationDot>}
          </BellWrapper>
        )}
        {showNotifications && <>
          <OverlayNotification onClick={() => setShowNotifications(false)} />
          <div ref={panelRef}>
            <NotificationPanel
              notifications={notifications}
              onClose={handleCloseNotification}
              onClearAll={handleClearAll}
              onMarkRead={handleMarkRead}
            />
          </div>
        </>} */}
        <Box
          sx={{
            width: "80%",
            bgcolor: `${theme.palette.primary.main}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "-16px",
          }}
        >
          <img
            src={logo}
            alt="Logo Planejja"
            style={{ maxWidth: "80%", height: 96, zIndex: 1 }}
          />
        </Box>
      </TopSection>
      <Menu>
        <MenuItem
          style={{ marginTop: "-16px" }}
          selected={selected === "/"}
          onClick={() => {
            setFinancasOpen(false);
            navigate("/");
            setSelected("/");
          }}
        >
          <FaChartBar style={{ marginRight: 16 }} /> Dashboard
        </MenuItem>
        <MenuItem
          selected={selected === "/receitas" || selected === "/despesas"}
          onClick={() => setFinancasOpen(!financasOpen)}
        >
          <FaMoneyBillWave style={{ marginRight: 16 }} /> Finanças
          <FaChevronDown
            style={{
              marginLeft: "auto",
              transition: "transform 0.2s",
              transform: financasOpen ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </MenuItem>
        {financasOpen && (
          <SubMenu>
            <SubMenuItem
              selected={selected === "/receitas"}
              onClick={() => {
                navigate("/receitas");
                setSelected("/receitas");
              }}
            >
              Receitas
            </SubMenuItem>
            <SubMenuItem
              selected={selected === "/despesas"}
              onClick={() => {
                navigate("/despesas");
                setSelected("/despesas");
              }}
            >
              Despesas
            </SubMenuItem>
          </SubMenu>
        )}
        <MenuItem
          selected={selected === "/caixinhas"}
          onClick={() => {
            navigate("/caixinhas");
            setFinancasOpen(false);
            setSelected("/caixinhas");
          }}
        >
          <FaWallet style={{ marginRight: 16 }} /> Caixinhas
        </MenuItem>
        <MenuItem
          selected={selected === "/configuracoes"}
          onClick={() => {
            setFinancasOpen(false);
            navigate("/configuracoes");
            setSelected("/configuracoes");
          }}
        >
          <FaCog style={{ marginRight: 16 }} /> Configurações
        </MenuItem>
      </Menu>
      <BottomSection>
        <ExitItem onClick={handleLogout}>
          <FaSignOutAlt style={{ marginRight: 16 }} /> Sair
        </ExitItem>
      </BottomSection>
    </SidebarContainer>
  );
};

export default Sidebar;
