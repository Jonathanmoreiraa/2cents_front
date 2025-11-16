import React from "react";
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
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { Box, Container, Grid, Typography, Paper } from "@mui/material";
import { StyledGrid } from "../components/CommonComponents.styles";
import theme from "../theme";

Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
);

const Home: React.FC = () => {
  const COLORS = {
    health: "#387B57",
    transport: "#195B8A",
    food: "#BDE2F2",
    leisure: "#E56D5B",
  };

  const barData = {
    labels: ["Jan", "Fev", "Mar", "Abr", "Maio", "Jun"],
    datasets: [
      {
        label: "Receitas",
        data: [750, 1500, 950, 1200, 700, 700],
        backgroundColor: theme.palette.primary.main,
      },
      {
        label: "Despesas",
        data: [500, 950, 600, 800, 550, 500],
        backgroundColor: theme.palette.error.main,
      },
    ],
  };

  const barOptions: any = {
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

  const totalExpenses = 1800;
  const totalRecipes = 2500;
  const percentage = Math.round((totalExpenses / totalRecipes) * 100);

  const doughnutData = {
    labels: ["Despesas", "Restante"],
    datasets: [
      {
        data: [totalExpenses, Math.max(totalRecipes - totalExpenses, 0)],
        backgroundColor: [theme.palette.error.main, theme.palette.primary.main],
        borderWidth: 0,
      },
    ],
  };

  const doughnutOptions: any = {
    cutout: "90%",
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  const categoryData = {
    labels: ["Saúde", "Alimentação", "Lazer", "Transporte"],
    datasets: [
      {
        data: [20, 35, 25, 20],
        backgroundColor: [
          COLORS.health,
          COLORS.food,
          COLORS.leisure,
          COLORS.transport,
        ],
        borderWidth: 0,
      },
    ],
  };

  const categoryOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "80%",
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        align: "start",
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

  const lineData = {
    labels: ["2023", "2024", "2025"],
    datasets: [
      {
        label: "Patrimônio",
        data: [10000, 20000, 28000],
        borderColor: theme.palette.primary.main,
        backgroundColor: theme.palette.primary.main,
        borderWidth: 2,
        tension: 0.3,
        fill: false,
        pointRadius: 4,
      },
    ],
  };

  const lineOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { maxRotation: 0, minRotation: 0 } },
      y: {
        beginAtZero: false,
        ticks: { stepSize: 1000 },
        grid: { color: "#e0e0e0", drawBorder: false },
      },
    },
  };

  const controlData = {
    labels: [""],
    datasets: [
      {
        label: "Orçamento",
        data: [1500],
        backgroundColor: theme.palette.primary.main,
        maxBarThickness: 40,
      },
      {
        label: "Gasto real",
        data: [1200],
        backgroundColor: theme.palette.error.main,
        maxBarThickness: 40,
      },
    ],
  };

  const controlOptions: any = {
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

  return (
    <Container sx={{ p: 2 }}>
      <Grid container spacing={3} columns={10} justifyContent="space-between">
        <StyledGrid size={6.5}>
          <Paper elevation={3} sx={{ p: 2, height: "100%" }}>
            <Bar data={barData} options={barOptions} />
          </Paper>
        </StyledGrid>

        <StyledGrid>
          <Paper elevation={3} sx={{ p: 2, height: "100%", textAlign: "center" }}>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
              Situação mensal (NOV/25)
            </Typography>

            <Box sx={{ position: "relative", width: 200, height: 200, mx: "auto" }}>
              <Doughnut data={doughnutData} options={doughnutOptions} />

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
                <Typography variant="h4" fontWeight="bold" color={theme.palette.warning.main}>
                  {percentage}%
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: -1 }}>
                  Atente-se!
                </Typography>
                <Typography variant="caption" sx={{ fontSize: 10, width: "70%" }}>
                  Você gastou acima do recomendado, mas tudo bem, fique atento(a)!
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mt: 4 }}>
              <Box display="flex" justifyContent="space-between" width={200} mb={1}>
                <Box display="flex" alignItems="center">
                  <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: theme.palette.error.main, mr: 1 }} />
                  <Typography>Despesas</Typography>
                </Box>
                <Typography fontWeight="bold">R$ 1800</Typography>
              </Box>

              <Box display="flex" justifyContent="space-between" width={200}>
                <Box display="flex" alignItems="center">
                  <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: theme.palette.primary.main, mr: 1 }} />
                  <Typography>Receitas</Typography>
                </Box>
                <Typography fontWeight="bold">R$ 2500</Typography>
              </Box>
            </Box>
          </Paper>
        </StyledGrid>
      </Grid>

      <Grid container spacing={3} display="flex" justifyContent="space-between" sx={{ mt: 4 }}>
        <StyledGrid>
          <Paper elevation={3} sx={{ p: 2, height: "100%" }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              Gasto por categoria
            </Typography>
            <Box height={280}>
              <Doughnut data={categoryData} options={categoryOptions} />
            </Box>
          </Paper>
        </StyledGrid>

        <StyledGrid>
          <Paper elevation={3} sx={{ p: 2, height: "100%" }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              Projeção de patrimônio
            </Typography>
            <Box height={200}>
              <Line data={lineData} options={lineOptions} />
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

            <Box sx={{ mt: 2, display: "flex", justifyContent: "center", gap: 3 }}>
              <Box display="flex" alignItems="center">
                <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: theme.palette.primary.main, mr: 1 }} />
                <Typography variant="body2">Orçamento</Typography>
              </Box>

              <Box display="flex" alignItems="center">
                <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: theme.palette.error.main, mr: 1 }} />
                <Typography variant="body2">Gasto real</Typography>
              </Box>
            </Box>
          </Paper>
        </StyledGrid>
      </Grid>
    </Container>
  );
};

export default Home;
