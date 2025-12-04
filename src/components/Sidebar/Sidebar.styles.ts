import styled from "styled-components";
import theme from "../../theme";

export const SidebarContainer = styled.div`
  width: 260px;
  background: ${theme.palette.primary.main};
  color: #fff;
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
`;

export const TopSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

export const AvatarImg = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 8px;
`;

export const BellWrapper = styled.div`
  position: absolute;
  top: 8px;
  right: 24px;
`;

export const NotificationDot = styled.div`
  position: absolute;
  top: -4px;
  right: -4px;
  background: ${theme.palette.error.main};
  color: #fff;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  cursor: pointer;
`;

export const Menu = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
  z-index: 2;
`;

export const MenuItem = styled.li<{ selected?: boolean }>`
  display: flex;
  align-items: center;
  padding: 18px 32px;
  cursor: pointer;
  background: ${({ selected }) => (selected ? "#fff" : "transparent")};
  color: ${({ selected }) => (selected ? theme.palette.primary.main : "#fff")};
  font-weight: 700;
  font-size: 19px;
  border-left: ${({ selected }) =>
    selected
      ? "4px solid " + theme.palette.primary.main
      : "4px solid transparent"};
  transition:
    background 0.2s,
    color 0.2s;
  &:hover {
    background: ${({ selected }) =>
      selected ? "#fff" : "rgba(255,255,255,0.08)"};
  }
`;

export const SubMenu = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  background: #fff;
`;

export const SubMenuItem = styled.li<{ selected?: boolean }>`
  padding: 16px 32px;
  color: ${theme.palette.primary.main};
  font-weight: 700;
  font-size: 18px;
  background: ${({ selected }) => (selected ? "#e6f2ec" : "#fff")};
  cursor: pointer;
  border-left: 4px solid transparent;
  &:hover {
    background: #e6f2ec;
  }
`;

export const BottomSection = styled.div`
  margin-top: auto;
  padding: 24px 0;
  @media (max-width: 900px) {
    padding: 60px 0;
  }
`;

export const ExitItem = styled(MenuItem)`
  color: #fff;
  background: transparent;
  font-size: 1.25rem;
  border-left: 4px solid transparent;
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    color: #fff;
  }
`;
