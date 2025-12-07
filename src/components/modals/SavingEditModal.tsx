import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  IconButton,
  Box,
  Typography,
  Switch,
  Divider,
  Popover,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import StyledTextField from "../common/StyledTextField";
import ActionButton from "../common/ActionButton";
import {
  IconInfoOutlined,
  ModalContainerContent,
} from "../common/common-components.styles";
import theme from "../../theme";
import { Saving } from "../../types";

interface SavingEditModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Saving) => void;
  initialValues: Saving | null;
}

const SavingEditModal: React.FC<SavingEditModalProps> = ({
  open,
  onClose,
  onSubmit,
  initialValues,
}) => {
  const [description, setDescription] = useState("");
  const [accumulated, setAccumulated] = useState<number | null>(0);
  const [goal, setGoal] = useState("");
  const [priority, setPriority] = useState<number | null>(null);
  const [shouldBeExpense, setShouldBeExpense] = useState(false);
  const [isEmergencyFund, setIsEmergencyFund] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<SVGSVGElement | null>(null);
  const [anchorElGoal, setAnchorElGoal] = React.useState<SVGSVGElement | null>(
    null,
  );
  const openPopGoal = Boolean(anchorElGoal);

  const openPopEmergencyFund = Boolean(anchorEl);
  const idPopEmergency = openPopEmergencyFund ? "simple-popover" : undefined;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: initialValues!.id,
      is_emergency_fund: isEmergencyFund ? 1 : 0,
      accumulated: accumulated ?? 0,
      description: isEmergencyFund ? "Reserva de emergência" : description,
      goal: Number(goal),
      should_be_expense: shouldBeExpense ? 1 : 0,
      priority: priority ?? 0,
    });
  };

  const handleClickSimulation = (event: React.MouseEvent<SVGSVGElement>) =>
    setAnchorEl(event.currentTarget);

  const handleCloseSimulation = () => setAnchorEl(null);

  const handleClickGoalInfo = (event: React.MouseEvent<SVGSVGElement>) => {
    setAnchorElGoal(event.currentTarget);
  };

  const handleCloseGoalInfo = () => {
    setAnchorElGoal(null);
  };

  useEffect(() => {
    setDescription(initialValues?.description || "");
    setAccumulated(initialValues?.accumulated || 0);
    setGoal(String(initialValues?.goal));
    setShouldBeExpense(initialValues?.should_be_expense === 0 ? false : true);
    setIsEmergencyFund(initialValues?.is_emergency_fund === 0 ? false : true);
    setPriority(initialValues?.priority || 0);
  }, [initialValues]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      PaperProps={{ sx: { borderRadius: 4, p: 0 } }}
    >
      <DialogTitle
        sx={{
          fontWeight: 600,
          fontSize: 28,
          pb: 0,
          pt: 3,
          px: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        Edição de caixinha
        <IconButton onClick={onClose} sx={{ ml: 2 }} aria-label="Fechar modal">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider sx={{ my: 1 }} />
      <ModalContainerContent sx={{ pt: 0, px: 4 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            mt={2}
          >
            <Typography mr={2}>É uma reserva de emergência?</Typography>
            <Switch
              color="success"
              disabled
              checked={isEmergencyFund}
              onChange={(e) => setIsEmergencyFund(e.target.checked)}
            />
            {isEmergencyFund && (
              <>
                <IconInfoOutlined
                  style={{ color: theme.palette.info.main }}
                  onClick={handleClickSimulation}
                />
                <Popover
                  id={idPopEmergency}
                  open={openPopEmergencyFund}
                  anchorEl={anchorEl}
                  onClose={handleCloseSimulation}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  style={{ width: "80%" }}
                >
                  <Typography sx={{ p: 1, fontSize: 12 }}>
                    Recomenda-se reservar pelo menos 10% das receitas recebidas
                  </Typography>
                </Popover>
              </>
            )}
          </Box>
          <StyledTextField
            label="Prioridade"
            value={priority}
            onChange={(e) =>
              e.target.value == ""
                ? setPriority(null)
                : setPriority(Number(e.target.value))
            }
            fullWidth
            required
            margin="normal"
            type="number"
            inputProps={{ min: 1 }}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <StyledTextField
              label="Meta (R$)"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              fullWidth
              required
              margin="normal"
              type="number"
            />
            <IconInfoOutlined
              aria-describedby={"goal-popover"}
              style={{
                color: theme.palette.info.main,
                marginLeft: 6,
                cursor: "pointer",
              }}
              onClick={handleClickGoalInfo}
            />
            <Popover
              id={"goal-popover"}
              open={openPopGoal}
              anchorEl={anchorElGoal}
              onClose={handleCloseGoalInfo}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
            >
              <Typography sx={{ p: 1, fontSize: 12, width: 300 }}>
                Se essa caixinha estiver relacionada a alguma despesa, a edição
                da meta não será atualizada automaticamente nas despesas
                vinculadas a ela.
              </Typography>
            </Popover>
          </Box>
          <StyledTextField
            label="Valor acumulado (R$)"
            value={accumulated}
            onChange={(e) =>
              e.target.value == ""
                ? setAccumulated(null)
                : setAccumulated(Number(e.target.value))
            }
            fullWidth
            required
            margin="normal"
            type="number"
            inputProps={{ min: 0 }}
          />
          {!isEmergencyFund && (
            <StyledTextField
              label="Descrição"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              required
              margin="normal"
            />
          )}
          <DialogActions sx={{ justifyContent: "center", pb: 2, px: 0, mt: 2 }}>
            <ActionButton
              type="submit"
              variant="contained"
              color="success"
              sx={{ px: 6, borderRadius: 999, fontWeight: 600, fontSize: 15 }}
            >
              Salvar
            </ActionButton>
          </DialogActions>
        </Box>
        <Divider sx={{ my: 1 }} />
      </ModalContainerContent>
    </Dialog>
  );
};

export default SavingEditModal;
