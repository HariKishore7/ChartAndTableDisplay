import {
  Button,
  FormControl,
  Grid,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField
} from "@mui/material";
import React, { useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { chartData1, chartData2 } from "./dummyData";

const App = () => {
  const [selectedDataset, setSelectedDataset] = useState("chartData1");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [targetValue, setTargetValue] = useState(0);
  const [targetColor, setTargetColor] = useState("#000000");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);

  const [chartData, setChartData] = useState(chartData1);
  const [filteredData, setFilteredData] = useState(chartData1);
  const handleDatasetChange = (event) => {
    setSelectedDataset(event.target.value);
    setChartData(event.target.value === "chartData1" ? chartData1 : chartData2);
    setFilteredData(
      event.target.value === "chartData1" ? chartData1 : chartData2
    );
    setStartDate("");
    setEndDate("");
    setTargetColor("#000000");
    setTargetValue(0);
    setRowsPerPage(5);
    setPage(0);
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const handleTargetValueChange = (event) => {
    setTargetValue(event.target.value);
  };

  const handleTargetColorChange = (event) => {
    setTargetColor(event.target.value);
  };

  const handleGenerateChart = () => {
    const filteredData = chartData.filter((data) => {
      return data.Date >= startDate && data.Date <= endDate;
    });
    setFilteredData(filteredData);
    setRowsPerPage(5);
    setPage(0);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const {
        Date,
        Country,
        App,
        Platform,
        AdNetwork,
        Users
      } = payload[0].payload;

      return (
        <div
          style={{
            background: "white",
            border: "1px solid black",
            padding: "4px"
          }}
        >
          <p>Date: {Date}</p>
          <p>Country: {Country}</p>
          <p>App: {App}</p>
          <p>Platform: {Platform}</p>
          <p>AdNetwork: {AdNetwork}</p>
          <p>Users: {Users}</p>
        </div>
      );
    }

    return null;
  };

  const renderTable = () => {
    return (
      <>
        <TableContainer
          component={Paper}
          sx={{
            maxHeight: "500px",
            overflow: "auto"
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {[
                  "Date",
                  "Country",
                  "App",
                  "Platform",
                  "AdNetwork",
                  "Users"
                ].map((item) => (
                  <TableCell
                    key={item.id}
                    sx={{ color: "white", backgroundColor: "black" }}
                  >
                    {item}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item) => {
                  return (
                    <TableRow key={item.id}>
                      {Object.keys(item).map((keys) => (
                        <TableCell key={keys.id}>{item[keys]}</TableCell>
                      ))}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10]}
            component="div"
            count={filteredData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(e.target.value);
              setPage(0);
            }}
          />
        </TableContainer>
      </>
    );
  };

  return (
    <div>
      <Grid
        sx={{
          display: "flex",
          justifyContent: "space-around",
          flexWrap: "wrap",
          alignItems: "center",
          marginBottom: "15px"
        }}
      >
        <FormControl>
          <label style={{ fontSize: "16px", fontWeight: 600 }}>Dataset</label>
          <Select
            sx={{ height: "40px" }}
            value={selectedDataset}
            onChange={handleDatasetChange}
          >
            <MenuItem value="chartData1">chartData 1</MenuItem>
            <MenuItem value="chartData2">chartData 2</MenuItem>
          </Select>
        </FormControl>
        <Grid
          sx={{
            display: "flex",
            flexDirection: "column"
          }}
        >
          <label style={{ fontSize: "16px", fontWeight: 600 }}>
            Start Date
          </label>
          <TextField
            type="date"
            sx={{ "& .MuiInputBase-root": { height: "40px" } }}
            value={startDate}
            onChange={handleStartDateChange}
          />
        </Grid>
        <Grid sx={{ display: "flex", flexDirection: "column" }}>
          <label style={{ fontSize: "16px", fontWeight: 600 }}>End Date</label>
          <TextField
            type="date"
            sx={{ "& .MuiInputBase-root": { height: "40px" } }}
            value={endDate}
            onChange={handleEndDateChange}
          />
        </Grid>

        <Button
          variant="contained"
          sx={{ height: "40px" }}
          onClick={handleGenerateChart}
          disabled={startDate === "" || endDate === ""}
        >
          Generate Chart
        </Button>

        <Grid
          sx={{
            display: "flex",
            flexDirection: "column"
          }}
        >
          <label style={{ fontSize: "16px", fontWeight: 600 }}>
            Target Value
          </label>
          <TextField
            sx={{ "& .MuiInputBase-root": { height: "40px" } }}
            type="number"
            value={targetValue}
            onChange={handleTargetValueChange}
          />
        </Grid>
        <Grid sx={{ display: "flex", flexDirection: "column" }}>
          <label style={{ fontSize: "16px", fontWeight: 600 }}>
            Line Color
          </label>
          <input
            label="Target Color"
            type="color"
            value={targetColor}
            onChange={handleTargetColorChange}
          />
        </Grid>
      </Grid>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={filteredData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Date" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line type="monotone" dataKey="Users" stroke={targetColor} />
          <ReferenceLine y={targetValue} stroke={targetColor} />
        </LineChart>
      </ResponsiveContainer>
      <Grid sx={{ marginTop: "10px" }}>{renderTable()}</Grid>
    </div>
  );
};

export default App;
