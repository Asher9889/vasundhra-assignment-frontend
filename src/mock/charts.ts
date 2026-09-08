import type { ChartData } from "@/types"

export const temperatureTrendData: ChartData = {
  kind: "line",
  series: [
    {
      name: "Annual Mean Temperature",
      points: [
        { label: "2015", value: 24.3 },
        { label: "2016", value: 24.6 },
        { label: "2017", value: 24.4 },
        { label: "2018", value: 24.8 },
        { label: "2019", value: 25.0 },
        { label: "2020", value: 25.2 },
        { label: "2021", value: 25.1 },
        { label: "2022", value: 25.4 },
        { label: "2023", value: 25.6 },
        { label: "2024", value: 25.3 },
      ],
    },
    {
      name: "5-Year Rolling Mean",
      points: [
        { label: "2017", value: 24.4 },
        { label: "2018", value: 24.6 },
        { label: "2019", value: 24.8 },
        { label: "2020", value: 25.0 },
        { label: "2021", value: 25.1 },
        { label: "2022", value: 25.3 },
        { label: "2023", value: 25.4 },
        { label: "2024", value: 25.4 },
      ],
    },
  ],
  unit: "°C",
  xLabel: "Year",
  yLabel: "Temperature (°C)",
}

export const climateMapData: ChartData = {
  kind: "india-map",
  points: [
    { id: "c1", name: "IMD Mumbai Observatory", latitude: 19.076, longitude: 72.8777, value: 27.1, category: "Weather Station" },
    { id: "c2", name: "IMD Delhi Observatory", latitude: 28.6139, longitude: 77.209, value: 25.9, category: "Weather Station" },
    { id: "c3", name: "IMD Chennai Observatory", latitude: 13.0827, longitude: 80.2707, value: 28.7, category: "Weather Station" },
    { id: "c4", name: "IMD Kolkata Observatory", latitude: 22.5726, longitude: 88.3639, value: 27.4, category: "Weather Station" },
    { id: "c5", name: "IMD Bengaluru Observatory", latitude: 12.9716, longitude: 77.5946, value: 24.6, category: "Weather Station" },
    { id: "c6", name: "IMD Srinagar Observatory", latitude: 34.0837, longitude: 74.7973, value: 13.2, category: "Weather Station" },
    { id: "c7", name: "IMD Guwahati Observatory", latitude: 26.1445, longitude: 91.7362, value: 23.8, category: "Weather Station" },
    { id: "c8", name: "IMD Jaipur Observatory", latitude: 26.9124, longitude: 75.7873, value: 26.4, category: "Weather Station" },
  ],
  unit: "°C",
}

export const climateChartData: ChartData = {
  kind: "bar",
  series: [
    {
      name: "Annual Rainfall (mm)",
      points: [
        { label: "2015", value: 1286 },
        { label: "2016", value: 1194 },
        { label: "2017", value: 1334 },
        { label: "2018", value: 1152 },
        { label: "2019", value: 1457 },
        { label: "2020", value: 1328 },
        { label: "2021", value: 1403 },
        { label: "2022", value: 1247 },
        { label: "2023", value: 1369 },
        { label: "2024", value: 1205 },
      ],
    },
  ],
  unit: "mm",
  xLabel: "Year",
  yLabel: "Rainfall (mm)",
}

export const renewableCapacityData: ChartData = {
  kind: "state-heatmap",
  states: [
    { state: "Rajasthan", value: 18350 },
    { state: "Gujarat", value: 24200 },
    { state: "Tamil Nadu", value: 15800 },
    { state: "Karnataka", value: 19100 },
    { state: "Maharashtra", value: 13200 },
    { state: "Andhra Pradesh", value: 11200 },
    { state: "Telangana", value: 6800 },
    { state: "Madhya Pradesh", value: 5400 },
    { state: "Uttar Pradesh", value: 4900 },
    { state: "Punjab", value: 3200 },
    { state: "Haryana", value: 2800 },
    { state: "Odisha", value: 2400 },
    { state: "West Bengal", value: 1200 },
    { state: "Kerala", value: 1900 },
    { state: "Himachal Pradesh", value: 2600 },
    { state: "Uttarakhand", value: 1800 },
    { state: "Bihar", value: 900 },
    { state: "Assam", value: 600 },
    { state: "Jharkhand", value: 700 },
    { state: "Chhattisgarh", value: 2100 },
    { state: "Goa", value: 160 },
    { state: "Delhi", value: 550 },
  ],
  unit: "MW",
}

export const renewableLocationsData: ChartData = {
  kind: "india-map",
  points: [
    { id: "p1", name: "Pavagada Solar Park", latitude: 14.17, longitude: 77.28, value: 2050, category: "Solar" },
    { id: "p2", name: "Bhadla Solar Park", latitude: 27.5, longitude: 72.9, value: 2245, category: "Solar" },
    { id: "p3", name: "Kurnool Solar Park", latitude: 15.83, longitude: 78.03, value: 1000, category: "Solar" },
    { id: "p4", name: "Muppandal Wind Farm", latitude: 8.26, longitude: 77.55, value: 1500, category: "Wind" },
    { id: "p5", name: "Jaisalmer Wind Park", latitude: 26.91, longitude: 70.9, value: 1064, category: "Wind" },
    { id: "p6", name: "Kutch Wind Farm", latitude: 23.73, longitude: 68.98, value: 824, category: "Wind" },
    { id: "p7", name: "Kamuthi Solar Plant", latitude: 9.41, longitude: 78.35, value: 648, category: "Solar" },
    { id: "p8", name: "Charanka Solar Park", latitude: 23.77, longitude: 71.24, value: 790, category: "Solar" },
    { id: "p9", name: "Noorapur Wind Farm", latitude: 15.83, longitude: 76.0, value: 1260, category: "Wind" },
    { id: "p10", name: "Tirunelveli Wind Park", latitude: 8.37, longitude: 77.45, value: 1400, category: "Wind" },
    { id: "p11", name: "Rewa Solar Park", latitude: 24.17, longitude: 81.3, value: 750, category: "Solar" },
    { id: "p12", name: "Bansagar Solar Park", latitude: 24.37, longitude: 80.9, value: 560, category: "Solar" },
  ],
  unit: "MW",
}

export const powerGenerationTrendData: ChartData = {
  kind: "bar",
  series: [
    {
      name: "Annual Generation (TWh)",
      points: [
        { label: "2015", value: 1084 },
        { label: "2016", value: 1142 },
        { label: "2017", value: 1190 },
        { label: "2018", value: 1249 },
        { label: "2019", value: 1291 },
        { label: "2020", value: 1234 },
        { label: "2021", value: 1352 },
        { label: "2022", value: 1431 },
        { label: "2023", value: 1502 },
        { label: "2024", value: 1596 },
      ],
    },
  ],
  unit: "TWh",
  xLabel: "Year",
  yLabel: "Generation (TWh)",
}

export const powerSourceMixData: ChartData = {
  kind: "area",
  series: [
    {
      name: "Coal",
      points: [
        { label: "2015", value: 782 },
        { label: "2016", value: 821 },
        { label: "2017", value: 856 },
        { label: "2018", value: 889 },
        { label: "2019", value: 905 },
        { label: "2020", value: 858 },
        { label: "2021", value: 920 },
        { label: "2022", value: 968 },
        { label: "2023", value: 1002 },
        { label: "2024", value: 1054 },
      ],
    },
    {
      name: "Hydro",
      points: [
        { label: "2015", value: 129 },
        { label: "2016", value: 138 },
        { label: "2017", value: 145 },
        { label: "2018", value: 152 },
        { label: "2019", value: 149 },
        { label: "2020", value: 156 },
        { label: "2021", value: 161 },
        { label: "2022", value: 168 },
        { label: "2023", value: 175 },
        { label: "2024", value: 183 },
      ],
    },
    {
      name: "Renewables",
      points: [
        { label: "2015", value: 42 },
        { label: "2016", value: 61 },
        { label: "2017", value: 87 },
        { label: "2018", value: 116 },
        { label: "2019", value: 143 },
        { label: "2020", value: 162 },
        { label: "2021", value: 198 },
        { label: "2022", value: 235 },
        { label: "2023", value: 268 },
        { label: "2024", value: 314 },
      ],
    },
  ],
  unit: "TWh",
  xLabel: "Year",
  yLabel: "Generation (TWh)",
}

export const powerPeakDemandData: ChartData = {
  kind: "line",
  series: [
    {
      name: "Peak Demand (GW)",
      points: [
        { label: "2015", value: 148 },
        { label: "2016", value: 159 },
        { label: "2017", value: 164 },
        { label: "2018", value: 177 },
        { label: "2019", value: 185 },
        { label: "2020", value: 181 },
        { label: "2021", value: 200 },
        { label: "2022", value: 203 },
        { label: "2023", value: 226 },
        { label: "2024", value: 250 },
      ],
    },
  ],
  unit: "GW",
  xLabel: "Year",
  yLabel: "Peak Demand (GW)",
}