const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: "ONLINE", service: "MINEGUARD-NODE-MOCK" });
});

app.get('/api/dashboard/', (req, res) => {
  res.json({
    workers: 10,
    sensors: 4,
    alerts: 1,
    risk: 72,
    riskLevel: 'WARNING',
  });
});

app.get('/api/workers/', (req, res) => {
  res.json([
    { id: 'W-101', name: 'John Doe', role: 'Miner', zone: 'Zone A', heartRate: 75, temp: 36.5, status: 'Healthy' },
    { id: 'W-102', name: 'Jane Smith', role: 'Engineer', zone: 'Zone B', heartRate: 82, temp: 37.1, status: 'Healthy' },
    { id: 'W-103', name: 'Mike Johnson', role: 'Miner', zone: 'Zone C', heartRate: 110, temp: 38.2, status: 'Warning' },
    { id: 'W-104', name: 'Sarah Williams', role: 'Supervisor', zone: 'Zone A', heartRate: 68, temp: 36.4, status: 'Healthy' },
    { id: 'W-105', name: 'David Brown', role: 'Miner', zone: 'Zone B', heartRate: 78, temp: 36.8, status: 'Healthy' },
  ]);
});

app.get('/api/mines/', (req, res) => {
  res.json({
    stats: [
      { label: 'Coal Extracted Today', value: '450 Tons', color: 'text-gray-400' },
      { label: 'Iron Ore Extracted', value: '1,200 Tons', color: 'text-blue-400' },
      { label: 'Active Excavators', value: '8', color: 'text-brand-warning' },
      { label: 'Daily Target', value: '85%', color: 'text-green-400' }
    ],
    efficiency: [
      { zone: 'Zone A (Coal)', value: 92, status: 'good' },
      { zone: 'Zone B (Iron)', value: 78, status: 'warning' },
      { zone: 'Zone C (Iron)', value: 45, status: 'critical' }
    ]
  });
});

app.get('/api/risk/', (req, res) => {
  res.json([
    { name: 'Methane Gas', level: 12, max: 20, status: 'Normal' },
    { name: 'Carbon Monoxide', level: 45, max: 50, status: 'Warning' },
    { name: 'Seismic Activity', level: 2, max: 10, status: 'Normal' },
    { name: 'Temperature', level: 32, max: 40, status: 'Normal' },
  ]);
});

app.get('/api/sensors/', (req, res) => {
  res.json([
    { id: 'S-001', type: 'Gas Detection', location: 'Zone A', status: 'Online', battery: 95, signal: 'Strong' },
    { id: 'S-002', type: 'Gas Detection', location: 'Zone B', status: 'Online', battery: 82, signal: 'Good' },
    { id: 'S-003', type: 'Seismic', location: 'Zone C', status: 'Online', battery: 45, signal: 'Weak' },
    { id: 'S-004', type: 'Temperature', location: 'Zone D', status: 'Offline', battery: 0, signal: 'None' },
    { id: 'S-005', type: 'Air Quality', location: 'Zone A', status: 'Online', battery: 98, signal: 'Strong' },
  ]);
});

app.get('/api/alerts/', (req, res) => {
  res.json([
    { id: 1, type: 'Critical', message: 'High CO levels detected in Zone C.', time: '2 mins ago' },
    { id: 2, type: 'Warning', message: 'Worker W-103 showing elevated heart rate.', time: '15 mins ago' },
    { id: 3, type: 'Info', message: 'Shift change completed for Zone A.', time: '1 hour ago' },
    { id: 4, type: 'Warning', message: 'Sensor S-004 connection lost.', time: '2 hours ago' },
    { id: 5, type: 'Info', message: 'Daily quota reached for Iron Ore extraction.', time: '3 hours ago' },
  ]);
});

app.post('/api/predict/risk', (req, res) => {
  const { methane, co, seismic, temperature } = req.body;
  
  let risk_score = (methane / 20) * 40 + (co / 50) * 30 + (seismic / 10) * 20 + (temperature / 40) * 10;
  risk_score = Math.min(100, Math.max(0, risk_score + (Math.random() * 10 - 5)));
  
  let level = "NORMAL";
  let message = "All parameters within safe operating limits.";
  
  if (risk_score > 75) {
      level = "CRITICAL";
      message = "Immediate evacuation recommended.";
  } else if (risk_score > 50) {
      level = "WARNING";
      message = "Elevated risk. Increase monitoring frequency.";
  }
  
  res.json({
      riskScore: parseFloat(risk_score.toFixed(1)),
      riskLevel: level,
      recommendation: message,
      confidence: parseFloat((85.0 + Math.random() * 14.5).toFixed(1))
  });
});

app.get('/api/map/', (req, res) => {
  res.json({
      center: [37.7749, -122.4194], 
      zoom: 13,
      zones: [
          { id: "zone-a", name: "Zone A (Coal)", coordinates: [37.7849, -122.4094], radius: 500, riskLevel: "NORMAL", activeWorkers: 45 },
          { id: "zone-b", name: "Zone B (Iron)", coordinates: [37.7649, -122.4294], radius: 600, riskLevel: "WARNING", activeWorkers: 32 },
          { id: "zone-c", name: "Zone C (Iron)", coordinates: [37.7749, -122.3994], radius: 450, riskLevel: "CRITICAL", activeWorkers: 12 },
          { id: "zone-d", name: "Zone D (Copper)", coordinates: [37.7549, -122.4094], radius: 300, riskLevel: "NORMAL", activeWorkers: 28 }
      ]
  });
});

app.listen(PORT, () => {
  console.log(`Node.js Mock Backend listening on port ${PORT}`);
});
