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
import { Box, Container, Grid, Typography, Paper, useMediaQuery } from "@mui/material";
import { StyledGrid } from "../components/common/common-components.styles";
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
  const [totalRecipes, setTotalRecipes] = useState<number>(0);
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
          label: "Receitas",
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
      const labels = ["Despesas", "Saldo"];

      const { revenues, expenses } = response.data;
      const totalRevenue = revenues[0].total ?? 0;
      const totalExpense = expenses[0].total ?? 0;

      const datasets = [
        {
          data: [totalExpense, Math.max(totalRevenue - totalExpense, 0)],
          backgroundColor: [
            theme.palette.error.main,
            theme.palette.primary.main,
          ],
          borderWidth: 0,
        },
      ];

      const resultPercentage =
        totalRevenue > 0 ? Math.round((totalExpense / totalRevenue) * 100) : 0;

      switch (true) {
        case resultPercentage <= 55:
          setSituationMessage(
            "Parabéns! Seu planejamento financeiro está funcionando muito bem.",
          );
          setSituationColor(theme.palette.primary.main);
          break;

        case resultPercentage <= 85:
          setSituationMessage(
            "Você gastou acima do recomendado, mas ainda está no controle. Atente-se!",
          );
          setSituationColor(theme.palette.warning.main);
          break;

        default:
          setSituationMessage(
            "Este mês seus gastos foram muito altos. Ajustes são recomendados para evitar problemas financeiros.",
          );
          setSituationColor(theme.palette.error.main);
      }

      if (!Number.isFinite(resultPercentage)) {
        setSituationMessage("Não foi possível calcular a situação deste mês.");
        setSituationColor(theme.palette.grey[500]);
      }

      setTotalExpenses(totalExpense);
      setTotalRecipes(totalRevenue);
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

  const controlData = {
    labels: [""],
    datasets: [
      {
        label: "Orçamento",
        data: [totalRecipes],
        backgroundColor: theme.palette.primary.main,
        maxBarThickness: 40,
      },
      {
        label: "Gasto real",
        data: [totalExpenses],
        backgroundColor: theme.palette.error.main,
        maxBarThickness: 40,
      },
    ],
  };

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

  useEffect(() => {
    getRevenuesExpensesData();
    getSituationData();
    getExpenseByCategoryData();
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
            sx={{ p: 2, height: "100%", textAlign: "center", width: isMobile ? "100%" : "21rem" }}
          >
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
              Situação mensal
            </Typography>

            <Box
              sx={{
                position: "relative",
                width: 200,
                height: 200,
                mx: "auto",
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
                width={200}
                mb={1}
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
                  <Typography>Receitas</Typography>
                </Box>
                <Typography fontWeight="bold">
                  {formatToMoney(totalRecipes)}
                </Typography>
              </Box>

              <Box display="flex" justifyContent="space-between" width={200}>
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
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              Despesas por categoria (R$)
            </Typography>
            <Box height={280}>
              <Doughnut data={categoryDataset} options={categoryOptions} />
            </Box>
          </Paper>
        </StyledGrid>
        <StyledGrid>
          <Paper elevation={3} sx={{ p: 2, height: "100%" }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              Controle mensal
            </Typography>
            <Box height={250}>
              <Bar data={controlData} options={controlOptions} />
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
