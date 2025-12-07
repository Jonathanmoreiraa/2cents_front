import React, { useEffect, useState } from "react";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  useMediaQuery,
  Popover,
} from "@mui/material";
import {
  IconInfoOutlined,
  StyledGrid,
} from "../components/common/common-components.styles";
import { BarChartDataType, DoughnutChartType, TaxesTable } from "../types";
import { formatToMoney } from "../utils/format-money";
import { generateRandomColor } from "../utils/generate-random-color";
import theme from "../theme";
import api from "../services/api";
import DataTable from "../components/data-table/DataTable";

Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
);

const Home: React.FC = () => {
  const monthOrder = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];
  const isMobile = useMediaQuery("(max-width:900px)");

  // Bar Chart
  const defaultChart = { labels: [], datasets: [] };
  const defaultTax = { name: "", value: 0 };
  const [barDataset, setBarDataset] = useState<BarChartDataType>(defaultChart);
  const barOptions: object = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      title: { display: false },
      legend: {
        display: true,
        position: "top",
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          padding: 12,
          font: { size: 12 },
          color: "#333",
        },
      },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1000,
          callback: (value: number) => `R$ ${value}`,
        },
        grid: { color: "#e0e0e0", drawBorder: false },
      },
    },
  };

  // Situation Doughnut Chart
  const [situationDataset, setSituationDataset] =
    useState<DoughnutChartType>(defaultChart);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [totalReceivedRevenue, setTotalReceivedRevenues] = useState<number>(0);
  const [percentage, setPercentage] = useState<number>(0);
  const [situationMessage, setSituationMessage] = useState<string>("");
  const [situationColor, setSituationColor] = useState<string>("");
  const doughnutOptions: object = {
    cutout: "90%",
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    responsive: true,
    maintainAspectRatio: false,
  };
  const [anchorElSituation, setAnchorElSituation] =
    React.useState<SVGSVGElement | null>(null);
  const [anchorEl, setAnchorEl] = React.useState<SVGSVGElement | null>(null);
  const openPopSituation = Boolean(anchorElSituation);
  const openPopControl = Boolean(anchorEl);

  // Category Doughnut Chart
  const [categoryDataset, setCategoryDataset] =
    useState<DoughnutChartType>(defaultChart);
  const categoryOptions: object = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "80%",
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        align: "center",
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          padding: 15,
          color: "#333",
        },
      },
      tooltip: { enabled: true },
    },
  };

  const [controlDataset, setControlDataset] =
    useState<BarChartDataType>(defaultChart);
  const controlOptions: object = {
    indexAxis: "x",
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, title: { display: false } },
    scales: {
      x: { grid: { display: false, drawBorder: false } },
      y: {
        beginAtZero: true,
        ticks: { stepSize: 500 },
        grid: { color: "#e0e0e0", drawBorder: false },
      },
    },
  };

  const [taxes, setTaxes] = useState<TaxesTable[]>([defaultTax]);

  const getRevenuesExpensesData = async () => {
    const response = await api.get(`/api/dashboard/last-six-months`);
    if (response.data) {
      const { revenues, expenses } = response.data;
      const allMonths = Array.from(
        new Set([
          ...revenues.map((r: { month: string; total: number }) => r.month),
          ...expenses.map((d: { month: string; total: number }) => d.month),
        ]),
      ).sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b));

      const receitaMap = Object.fromEntries(
        revenues.map((r: { month: string; total: number }) => [
          r.month,
          r.total,
        ]),
      );

      const despesaMap = Object.fromEntries(
        expenses.map((d: { month: string; total: number }) => [
          d.month,
          d.total,
        ]),
      );

      const receitaData = allMonths.map((month) => receitaMap[month] ?? 0);
      const despesaData = allMonths.map((month) => despesaMap[month] ?? 0);

      const datasets = [
        {
          label: "Receitas recebidas",
          data: receitaData,
          backgroundColor: theme.palette.primary.main,
        },
        {
          label: "Despesas",
          data: despesaData,
          backgroundColor: theme.palette.error.main,
        },
      ];

      setBarDataset({ labels: allMonths, datasets: datasets });
    }
  };

  const getSituationData = async () => {
    const response = await api.get(`/api/dashboard/month-situation`);
    if (response.data) {
      const { revenues, expenses } = response.data;
      const totalRevenue = revenues[0].total ?? 0;
      const totalExpense = expenses[0].total ?? 0;

      const balance = totalRevenue - totalExpense;

      const resultPercentage =
        totalRevenue > 0 ? Math.round((totalExpense / totalRevenue) * 100) : 0;

      const formattedBalance = formatToMoney(Math.abs(balance)); // Usamos Math.abs para formatar sem o sinal aqui, ele será adicionado na mensagem.

      const datasets = [
        {
          data: [totalExpense, Math.max(balance, 0)],
          backgroundColor: [
            theme.palette.error.main,
            theme.palette.primary.main,
          ],
          borderWidth: 0,
        },
      ];

      let message = "";
      let color = "";

      if (
        !Number.isFinite(resultPercentage) ||
        (totalRevenue === 0 && totalExpense > 0)
      ) {
        message =
          "Não foi possível calcular a situação. Há despesas sem receita registrada.";
        color = theme.palette.grey[500];
      } else if (balance < 0) {
        const percentExcess = resultPercentage - 100;
        message = `Faltou ${formattedBalance} para cobrir seus gastos, que excederam a receita recebida em ${percentExcess}%. Ajustes são urgentes!`;
        color = theme.palette.error.main;
      } else if (resultPercentage <= 55) {
        message = `Parabéns! Seu planejamento está excelente. Este mês, você economizou ${formattedBalance}.`;
        color = theme.palette.primary.main;
      } else if (resultPercentage <= 85) {
        message = `Você economizou ${formattedBalance} este mês. No entanto, os gastos foram acima do ideal. Fique atento(a)!`;
        color = theme.palette.warning.main;
      } else {
        message = `Seus gastos estão muito próximos da sua receita recebida. Você economizou ${formattedBalance}. Atenção redobrada é crucial!`;
        color = theme.palette.warning.main;
      }

      const labels = ["Despesas", "Saldo"];
      setSituationMessage(message);
      setSituationColor(color);
      setTotalExpenses(totalExpense);
      setTotalReceivedRevenues(totalRevenue);
      setPercentage(resultPercentage);
      setSituationDataset({ labels, datasets });
    }
  };

  const getExpenseByCategoryData = async () => {
    const response = await api.get(`/api/dashboard/expenses-by-category`);
    if (response.data) {
      const categories = response.data;
      const labels: string[] = [];
      const data: number[] = [];
      const colors: string[] = categories.map((_: unknown, index: number) =>
        generateRandomColor(index),
      );

      categories.map((cat: { category: number; name: string }) => {
        labels.push(cat.name);
        data.push(cat.category ?? 0);
      });

      const datasets = [
        {
          data: data,
          backgroundColor: colors,
          borderWidth: 0,
        },
      ];

      setCategoryDataset({ labels: labels, datasets: datasets });
    }
  };

  const getTaxes = async () => {
    const response = await api.get(`/api/dashboard/last-metric`);
    if (response.data) {
      setTaxes(response.data);
    }
  };

  const getControlData = async () => {
    const response = await api.get(
      `/api/dashboard/month-situation?received=false`,
    );
    if (response.data) {
      const controlData = {
        labels: [""],
        datasets: [
          {
            label: "Orçamento",
            data: [response.data.revenues[0]?.total || 0],
            backgroundColor: theme.palette.primary.main,
            maxBarThickness: 40,
          },
          {
            label: "Gasto real",
            data: [response.data.expenses[0]?.total || 0],
            backgroundColor: theme.palette.error.main,
            maxBarThickness: 40,
          },
        ],
      };

      setControlDataset(controlData);
    }
  };

  const handleClickControl = (event: React.MouseEvent<SVGSVGElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseControl = () => {
    setAnchorEl(null);
  };

  const handleClickSituation = (event: React.MouseEvent<SVGSVGElement>) => {
    setAnchorElSituation(event.currentTarget);
  };

  const handleCloseSituation = () => {
    setAnchorElSituation(null);
  };

  useEffect(() => {
    getRevenuesExpensesData();
    getSituationData();
    getExpenseByCategoryData();
    getControlData();
    getTaxes();
  }, []);

  return (
    <Container sx={{ p: 2 }}>
      <Grid container spacing={3} columns={10} justifyContent="space-between">
        <StyledGrid size={6.5}>
          <Paper elevation={3} sx={{ p: 2, height: "100%" }}>
            <Bar data={barDataset} options={barOptions} />
          </Paper>
        </StyledGrid>

        <StyledGrid>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              height: "100%",
              textAlign: "center",
              width: isMobile ? "100%" : "21rem",
            }}
          >
            <Box
              width={"100%"}
              display={"flex"}
              flexDirection={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Typography
                variant="h5"
                fontWeight="bold"
                textAlign={"center"}
                width={"100%"}
              >
                Situação mensal
              </Typography>
              <IconInfoOutlined
                aria-describedby={"situation-popover"}
                style={{ color: theme.palette.info.main }}
                onClick={handleClickSituation}
              />
              <Popover
                id={"situation-popover"}
                open={openPopSituation}
                anchorEl={anchorElSituation}
                onClose={handleCloseSituation}
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
                  Este gráfico representa o quanto dos seus ganhos mensais foi
                  consumido por seus gastos.
                </Typography>
              </Popover>
            </Box>

            <Box
              sx={{
                position: "relative",
                width: 240,
                height: 200,
                mx: "auto",
                mt: 3,
              }}
            >
              <Doughnut data={situationDataset} options={doughnutOptions} />

              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  color={situationColor}
                >
                  {percentage}%
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ fontSize: 10, width: "70%" }}
                >
                  {situationMessage}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mt: 4 }}>
              <Box
                display="flex"
                justifyContent="space-between"
                mb={1}
                width={240}
              >
                <Box display="flex" alignItems="center">
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      bgcolor: theme.palette.primary.main,
                      mr: 1,
                    }}
                  />
                  <Typography>Receita recebida</Typography>
                </Box>
                <Typography fontWeight="bold">
                  {formatToMoney(totalReceivedRevenue)}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" width={240}>
                <Box display="flex" alignItems="center">
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      bgcolor: theme.palette.error.main,
                      mr: 1,
                    }}
                  />
                  <Typography>Despesas</Typography>
                </Box>
                <Typography fontWeight="bold">
                  {formatToMoney(totalExpenses)}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </StyledGrid>
      </Grid>

      <Grid
        container
        spacing={3}
        display="flex"
        justifyContent="space-between"
        sx={{ mt: 4 }}
      >
        <StyledGrid>
          <Paper elevation={3} sx={{ p: 2, height: "100%" }}>
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ mb: 2, textAlign: "center" }}
            >
              Gasto mensal por categoria (R$)
            </Typography>
            <Box height={280}>
              <Doughnut data={categoryDataset} options={categoryOptions} />
            </Box>
          </Paper>
        </StyledGrid>
        <StyledGrid>
          <Paper elevation={3} sx={{ p: 2, height: "100%" }}>
            <Box
              width={"100%"}
              display={"flex"}
              flexDirection={"row"}
              justifyContent={"space-between"}
            >
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ mb: 2, textAlign: "center", width: "100%" }}
              >
                Controle geral mensal
              </Typography>
              <IconInfoOutlined
                aria-describedby={"mensal-control"}
                style={{ color: theme.palette.info.main }}
                onClick={handleClickControl}
              />
              <Popover
                id={"mensal-control"}
                open={openPopControl}
                anchorEl={anchorEl}
                onClose={handleCloseControl}
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
                  Este gráfico de controle compara o seu orçamento mensal (que
                  inclui receitas já recebidas e as que ainda estão a receber)
                  com os gastos reais do período.
                </Typography>
              </Popover>
            </Box>
            <Box height={250}>
              <Bar data={controlDataset} options={controlOptions} />
            </Box>

            <Box
              sx={{ mt: 2, display: "flex", justifyContent: "center", gap: 3 }}
            >
              <Box display="flex" alignItems="center">
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    bgcolor: theme.palette.primary.main,
                    mr: 1,
                  }}
                />
                <Typography variant="body2">Orçamento</Typography>
              </Box>

              <Box display="flex" alignItems="center">
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    bgcolor: theme.palette.error.main,
                    mr: 1,
                  }}
                />
                <Typography variant="body2">Gasto real</Typography>
              </Box>
            </Box>
          </Paper>
        </StyledGrid>
        <StyledGrid>
          <Paper
            elevation={3}
            sx={{ pr: 4, pl: 4, pt: 2, pb: 4, height: "100%" }}
          >
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              Indicadores financeiros
            </Typography>
            <DataTable
              items={taxes}
              headers={[
                { label: "Taxa", key: "name" },
                { label: "Valor (%)", key: "value" },
              ]}
              renderCell={(item, key) => {
                return item[key];
              }}
            />
          </Paper>
        </StyledGrid>
      </Grid>
    </Container>
  );
};

export default Home;
