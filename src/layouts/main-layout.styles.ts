import styled from 'styled-components';
import theme from '../theme';
export const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100%;
  flex-direction: row;
`;

export const MainContent = styled.main`
  flex: 1;
  margin-left: 260px;
  background: #f8f8f8;
  min-height: 100vh;
  padding: 32px 32px 0 32px;
  transition: margin-left 0.3s;
  width: calc(100vw - 260px);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: ${theme.palette.primary.main} #e6f2ec;
  height: 100vh;

  @media (max-width: 900px) {
    margin-left: 0;
    padding: 16px 4vw 0 4vw;
    margin-top: 56px;
    width: 100%;
    height: calc(100vh - 56px);
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
    scrollbar-color: ${theme.palette.primary.main} #e6f2ec;
  }
`;

export const TopBarMobile = styled.div`
  display: none;
  @media (max-width: 900px) {
    display: flex;
    align-items: center;
    width: 100vw;
    height: 56px;
    background: ${theme.palette.primary.main};
    position: fixed;
    top: 0;
    left: 0;
    z-index: 300;
    padding-left: 8px;
    justify-content: space-between;
    padding-right: 16px;
  }
`;

export const HamburgerButton = styled.button`
  background: ${theme.palette.primary.main};
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 1.5rem;
  cursor: pointer;
  @media (min-width: 901px) {
    display: none;
  }
`;

export const ResponsiveSidebar = styled.div<{ open: boolean }>`
  display: none;
  @media (max-width: 900px) {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 260px;
    z-index: 250;
    background: ${theme.palette.primary.main};
    margin-top: 54px;
    transform: ${({ open }) => (open ? 'translateX(0)' : 'translateX(-100%)')};
    transition: transform 0.3s;
    box-shadow: ${({ open }) => (open ? '2px 0 16px rgba(0,0,0,0.12)' : 'none')};
  }
`;

export const Overlay = styled.div<{ open: boolean }>`
  display: ${({ open }) => (open ? 'block' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 200;
`;

export const DesktopSidebar = styled.div`
  @media (max-width: 900px) {
    display: none;
  }
`;

export const IconButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
  position: relative;
`;

export const NotificationDot = styled.span`
  background: #FF5A5F;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  color: white;
  position: absolute;
  top: 5px;
  right: 5px;
  @media (max-width: 900px) {
    bottom: 18px;
    right: 10px;
    top: 0;
  }
`;

export const MobileNotificationPanelWrapper = styled.div`
  position: fixed;
  top: 56px;
  z-index: 400;
  width: 400px;
  max-width: 96vw;
`;

export const OverlayNotification = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(240,240,240,0.7);
  z-index: 399;
`; 