import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  IconButton,
  Box,
  Typography,
  Divider,
  Popover,
  CircularProgress,
  DialogActions
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import StyledTextField from '../StyledTextField';
import { Title } from '../Sidebar/NotificationPanel.styles';
import { IconInfoOutlined, ModalContainerContent } from '../CommonComponents.styles';
import ActionButton from '../ActionButton';
import api from '../../services/api';
import theme from '../../theme';

interface SimulationModalProps {
  open: boolean;
  onClose: () => void;
}

const SimulationModal: React.FC<SimulationModalProps> = ({ open, onClose }) => {
  const [goal, setGoal] = useState('');
  const [monthsToGoal, setMonthsToGoal] = useState(1);
  const [cdb, setCdb] = useState(0);
  const [poupanca, setPoupanca] = useState(0);
  const [isLoadingSimulation, setIsLoadingSimulation] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<SVGSVGElement | null>(null);
  const months = monthsToGoal == 1 ? "mês" : "meses";
  const openPopSimulation = Boolean(anchorEl);
  const idPopSimulation = openPopSimulation ? 'simple-popover' : undefined;

  const formatToMoney = (value: number) => {
    const moneyFormat = new Intl.NumberFormat("pt-BR", {style: 'currency', currency: 'BRL'})
    return moneyFormat.format(value);
  }

  const handleClickSimulation = (event: React.MouseEvent<SVGSVGElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseSimulation = () => {
    setAnchorEl(null);
  };

  const handleSimulation = async () => {
    setIsLoadingSimulation(true);
    if (goal && monthsToGoal) {
      const res = await api.post('/api/rendiments', {
        initial_value: Number(goal), 
        months: monthsToGoal
      });
      if (res.data) {
        setCdb(res.data.cdb)
        setPoupanca(res.data.poupanca)
      }
    }
    setIsLoadingSimulation(false);
  }

  useEffect(() => {
    setGoal('');
    setMonthsToGoal(1);
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth PaperProps={{ sx: { borderRadius: 4, p: 0 } }}>
      <DialogTitle sx={{ fontWeight: 600, fontSize: 28, pb: 0, pt: 3, px: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        Simulação
        <IconButton onClick={onClose} sx={{ ml: 2 }} aria-label="Fechar modal">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider sx={{ my: 1 }} />
      <ModalContainerContent sx={{ pt: 0, px: 4 }}>
        <Box component="form">
          <StyledTextField
            label="Valor a ser guardado (R$)"
            value={goal}
            onChange={e => setGoal(e.target.value)}
            fullWidth
            required
            inputProps={{  min: 0  }}
            margin="normal"
            type="number"
          />
          <StyledTextField
            label="Quantidade de meses que o dinheiro ficará investido"
            value={monthsToGoal}
            onChange={e => setMonthsToGoal(Number(e.target.value))}
            fullWidth
            required
            margin="normal"
            type="number"
            inputProps={{  min: 1  }}
          />
          <DialogActions sx={{ justifyContent: 'center', pb: 2}}>
            <ActionButton type="button" variant="contained" onClick={handleSimulation} sx={{borderRadius: 999, fontWeight: 600, fontSize: 14 }}>
              Simular
            </ActionButton>
          </DialogActions>
        </Box>
        <Divider sx={{ my: 1 }} />
        <Box mt={2} mb={3} display={"flex"} justifyContent={"center"} flexDirection={"column"}>
          {
            isLoadingSimulation ? (
              <CircularProgress size={24} />
            ) : cdb > 0 && poupanca > 0 && (
              <>
                <Typography mr={2}>
                  <Title>
                    Projeção de investimento 
                    <IconInfoOutlined style={{color: theme.palette.info.main}} onClick={handleClickSimulation}/>
                    <Popover
                      id={idPopSimulation}
                      open={openPopSimulation}
                      anchorEl={anchorEl}
                      onClose={handleCloseSimulation}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                      }}
                      style={{width: "80%"}}
                    >
                      <Typography sx={{ p: 1, fontSize: 12 }}>Os valores apresentados consideram a média de rendimento com base em 100% do CDI (para o CDB) e as taxas atuais do Banco Central. Para obter uma estimativa mais precisa, recomendamos que você consulte sua instituição financeira.</Typography>
                    </Popover>
                  </Title>
                </Typography>
                <Typography mt={1} mb={1} fontSize={14} color="text.secondary">
                  Investindo <b>{formatToMoney(Number(goal))}</b> por <b>{monthsToGoal}</b> {months}, seu dinheiro renderá aproximadamente as seguintes quantias no final do período:
                </Typography>
                <Typography mt={1} mb={1} fontSize={14} color="text.secondary">
                  <ul>
                    <li><b>CDB</b>: {formatToMoney(cdb)}</li>
                    <li><b>Poupança</b>: {formatToMoney(poupanca)}</li>
                  </ul>
                </Typography>
              </>
            )
          }
        </Box>
      </ModalContainerContent>
    </Dialog>
  );
};
          
export default SimulationModal; 