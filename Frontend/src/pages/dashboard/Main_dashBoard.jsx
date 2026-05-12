import React from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Select,
  MenuItem,
} from "@mui/material";

export default function Main_dashBoard() {
  const cards = [
    { title: "Today Sales", value: "₹12,540" },
    { title: "Monthly Sales", value: "₹2,45,000" },
    { title: "Total Bills", value: "182" },
    { title: "Profit Today", value: "₹3,240" },
  ];

  const topProducts = [
    { name: "Data Cable", qty: 22 },
    { name: "Temper Glass", qty: 18 },
    { name: "Neckband", qty: 9 },
  ];

  const lowStock = [
    { name: "Fast Charger", qty: 2 },
    { name: "USB Cable", qty: 1 },
    { name: "Bluetooth Speaker", qty: 3 },
  ];

  const recentBills = [
    { customer: "Rahul", amount: "₹1,250", date: "12 May" },
    { customer: "Aman", amount: "₹850", date: "12 May" },
    { customer: "Vikas", amount: "₹2,100", date: "11 May" },
  ];

  return (
    <Box sx={{ background: "#f5f7fb", minHeight: "100vh", p: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          mb: 4,
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight="bold">
            Bhatia Telecom SmartZone
          </Typography>

          <Typography variant="body1" color="text.secondary">
            Billing Software Dashboard
          </Typography>
        </Box>
      </Box>

      {/* Top Cards */}
      <Grid container spacing={3}>
        {cards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: 3,
              }}
            >
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  {card.title}
                </Typography>

                <Typography variant="h4" fontWeight="bold">
                  {card.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Middle Section */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {/* Sales Analytics */}
        <Grid item xs={12} md={8}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              boxShadow: 3,
              height: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                Sales Analytics
              </Typography>

              <Select defaultValue="week" size="small">
                <MenuItem value="week">This Week</MenuItem>
                <MenuItem value="month">This Month</MenuItem>
                <MenuItem value="year">This Year</MenuItem>
              </Select>
            </Box>

            <Box
              sx={{
                height: 300,
                border: "2px dashed #d1d5db",
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#fafafa",
              }}
            >
              <Typography color="text.secondary">Sales Chart Here</Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Payment Summary */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              boxShadow: 3,
              height: "100%",
            }}
          >
            <Typography variant="h6" fontWeight="bold" mb={3}>
              Payment Summary
            </Typography>

            {["Cash", "UPI", "Card"].map((method, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "#f5f5f5",
                  p: 2,
                  borderRadius: 2,
                  mb: 2,
                }}
              >
                <Typography>{method}</Typography>
                <Typography fontWeight="bold">₹{(index + 1) * 3000}</Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>

      {/* Bottom Section */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {/* Top Products */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
            <Typography variant="h6" fontWeight="bold" mb={3}>
              Top Selling Products
            </Typography>

            {topProducts.map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  background: "#f5f5f5",
                  p: 2,
                  borderRadius: 2,
                  mb: 2,
                }}
              >
                <Typography>{item.name}</Typography>
                <Typography fontWeight="bold">{item.qty}</Typography>
              </Box>
            ))}
          </Paper>
        </Grid>

        {/* Low Stock */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
            <Typography variant="h6" fontWeight="bold" color="error" mb={3}>
              Low Stock Alert
            </Typography>

            {lowStock.map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  background: "#fff3f3",
                  border: "1px solid #ffcdd2",
                  p: 2,
                  borderRadius: 2,
                  mb: 2,
                }}
              >
                <Typography>{item.name}</Typography>
                <Typography color="error" fontWeight="bold">
                  {item.qty} Left
                </Typography>
              </Box>
            ))}
          </Paper>
        </Grid>

        {/* Recent Bills */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                Recent Bills
              </Typography>

              <Button size="small">View All</Button>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Customer</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {recentBills.map((bill, index) => (
                    <TableRow key={index}>
                      <TableCell>{bill.customer}</TableCell>
                      <TableCell>{bill.amount}</TableCell>
                      <TableCell>{bill.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
