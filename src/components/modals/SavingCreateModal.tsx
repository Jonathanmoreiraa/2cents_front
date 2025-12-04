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
import { Title } from "../Sidebar/notification-panel.styles";
import {
  IconInfoOutlined,
  ModalContainerContent,
} from "../common/common-components.styles";
import theme from "../../theme";
import api from "../../services/api";
import { formatToMoney } from "../../utils/format-money";

interface SavingCreateModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    is_emergency_fund: number;
    accumulated: number | null;
    description: string;
    goal: number;
    months_to_goal: number;
    should_be_expense: number;
  }) => void;
}

const SavingCreateModal: React.FC<SavingCreateModalProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [description, setDescription] = useState("");
  const [accumulated, setAccumulated] = useState<number | null>(0);
  const [goal, setGoal] = useState("");
  const [monthsToGoal, setMonthsToGoal] = useState(0);
  const [shouldBeExpense, setShouldBeExpense] = useState(false);
  const [isEmergencyFund, setIsEmergencyFund] = useState(false);
  const [cdb, setCdb] = useState(0);
  const [poupanca, setPoupanca] = useState(0);
  const [anchorEl, setAnchorEl] = React.useState<SVGSVGElement | null>(null);
  const months = monthsToGoal == 1 ? "mês" : "meses";
  const openPopSimulation = Boolean(anchorEl);
  const openPopEmergencyFund = Boolean(anchorEl);
  const idPopSimulation = openPopSimulation ? "simple-popover" : undefined;
  const idPopEmergency = openPopEmergencyFund ? "simple-popover" : undefined;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      is_emergency_fund: isEmergencyFund ? 1 : 0,
      accumulated,
      description: isEmergencyFund ? "Reserva de emergência" : description,
      goal: Number(goal),
      months_to_goal: monthsToGoal,
      should_be_expense: shouldBeExpense ? 1 : 0,
    });
  };

  const handleClickSimulation = (event: React.MouseEvent<SVGSVGElement>) =>
    setAnchorEl(event.currentTarget);

  const handleCloseSimulation = () => setAnchorEl(null);

  const handleSimulation = async () => {
    if (goal && monthsToGoal) {
      const res = await api.post("/api/month/rendiment", {
        initial_value: Number(goal),
        months: monthsToGoal,
        accumulated: Number(accumulated),
      });
      if (res.data) {
        setCdb(res.data.cdb);
        setPoupanca(res.data.poupanca);
      }
    }
  };

  useEffect(() => {
    setDescription("");
    setAccumulated(null);
    setGoal("");
    setMonthsToGoal(1);
    setShouldBeExpense(false);
    setIsEmergencyFund(false);
  }, [open]);

  useEffect(() => {
    if (Number(goal) > 0 && monthsToGoal > 1) {
      handleSimulation();
    }
  }, [monthsToGoal, accumulated, goal]);

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
        Cadastro de caixinha
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
            label="Meta (R$)"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            fullWidth
            required
            margin="normal"
            type="number"
          />
          <StyledTextField
            label="Valor acumulado (R$)"
            onChange={(e) => setAccumulated(Number(e.target.value))}
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
          <StyledTextField
            label="Quantidade de meses para alcançar a meta"
            onChange={(e) => setMonthsToGoal(Number(e.target.value))}
            fullWidth
            required
            margin="normal"
            type="number"
            inputProps={{ min: 1 }}
          />
          <Box display="flex" alignItems="center">
            <Switch
              color="success"
              checked={shouldBeExpense}
              onChange={(e) => setShouldBeExpense(e.target.checked)}
            />
            <Typography mr={2}>Adicionar as despesas mensais?</Typography>
          </Box>
          <DialogActions sx={{ justifyContent: "center", pb: 2, px: 0, mt: 2 }}>
            <ActionButton
              type="submit"
              variant="contained"
              color="success"
              sx={{ px: 6, borderRadius: 999, fontWeight: 600, fontSize: 15 }}
            >
              Cadastrar
            </ActionButton>
          </DialogActions>
        </Box>
        <Divider sx={{ my: 1 }} />
        <Box
          mt={2}
          mb={3}
          display={"flex"}
          justifyContent={"center"}
          flexDirection={"column"}
        >
          {cdb > 0 && poupanca > 0 && (
            <>
              <Typography mr={2}>
                <Title>
                  Projeção de rendimento
                  <IconInfoOutlined
                    style={{ color: theme.palette.info.main }}
                    onClick={handleClickSimulation}
                  />
                  <Popover
                    id={idPopSimulation}
                    open={openPopSimulation}
                    anchorEl={anchorEl}
                    onClose={handleCloseSimulation}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    style={{ width: "80%" }}
                  >
                    <Typography sx={{ p: 1, fontSize: 12 }}>
                      Os valores apresentados consideram a média de rendimento
                      com base em 100% do CDI (para o CDB) e as taxas atuais do
                      Banco Central. Para obter uma estimativa mais precisa,
                      recomendamos que você consulte sua instituição financeira.
                    </Typography>
                  </Popover>
                </Title>
              </Typography>
              <Typography mt={1} mb={1} fontSize={14} color="text.secondary">
                Para alcançar a meta de {formatToMoney(Number(goal))} em{" "}
                {monthsToGoal} {months}, você precisará guardar aproximadamente{" "}
                <b>{formatToMoney(Number(goal) / monthsToGoal)} por mês</b>.
              </Typography>
              <Typography mt={1} mb={1} fontSize={14} color="text.secondary">
                Caso esse valor não se encaixe no seu orçamento mensal,
                considere aumentar o número de {months} para atingir a meta.
                Isso fará com que o valor mensal a ser poupado diminua.
              </Typography>
              <Typography mt={1} mb={1} fontSize={14} color="text.secondary">
                Investindo <b>{formatToMoney(Number(goal) / monthsToGoal)}</b>{" "}
                por <b>{monthsToGoal}</b> {months}
                {accumulated
                  ? ` + ${formatToMoney(accumulated)} já acumulado`
                  : ""}
                , seu dinheiro renderá aproximadamente as seguintes quantias no
                final do período:
              </Typography>
              <Typography mt={1} mb={1} fontSize={14} color="text.secondary">
                <ul>
                  <li>
                    <b>CDB</b>: {formatToMoney(cdb)}
                  </li>
                  <li>
                    <b>Poupança</b>: {formatToMoney(poupanca)}
                  </li>
                </ul>
              </Typography>
            </>
          )}
        </Box>
      </ModalContainerContent>
    </Dialog>
  );
};

export default SavingCreateModal;
