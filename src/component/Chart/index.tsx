import React from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

// Define TypeScript Props
interface ChartProps {
  dataOption: any;
  options: any;
}

const HalfDoughnutChart: React.FC<ChartProps> = ({ dataOption, options }) => {
  return (
    <div style={{ width: "300px", height: "150px" }}>
      <Doughnut data={dataOption} options={options} />
    </div>
  );
};

export default HalfDoughnutChart;
