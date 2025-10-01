"use client";

import { useCallback, useId, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  Rectangle,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import RealtimeChartWiderCandles from "@/pages/chart";
import RealtimeLineAreaChart from "@/pages/chart2";
import RealtimeLineChart from "./LineChart";
import { AlignHorizontalDistributeCenter, ChartNoAxesCombined, ChartSpline } from "lucide-react";
import { toast } from "sonner";
import { useUserContext } from "@/context/AuthProvider";
import { useCreateHistory, useGetLastHistory, useLastTransaction } from "@/lib/query/api";

const hourlyData = [
  { date: "2025-03-12", time: "3:00 PM", value: 1181008 },
  { date: "2025-03-12", time: "4:00 PM", value: 1182003 },
  { date: "2025-03-12", time: "5:00 PM", value: 1182007 },
  { date: "2025-03-12", time: "6:00 PM", value: 1184000 },
  { date: "2025-03-12", time: "7:00 PM", value: 1183003 },
  { date: "2025-03-12", time: "8:00 PM", value: 1183005 },
  { date: "2025-03-12", time: "9:00 PM", value: 1185001 },
  { date: "2025-03-12", time: "10:00 PM", value: 1188007 },
  { date: "2025-03-12", time: "11:00 PM", value: 1184000 },
  { date: "2025-03-13", time: "12:00 AM", value: 1186002 },
  { date: "2025-03-13", time: "1:00 AM", value: 1182005 },
  { date: "2025-03-13", time: "2:00 AM", value: 1178005 },
  { date: "2025-03-13", time: "3:00 AM", value: 1174005 },
  { date: "2025-03-13", time: "4:00 AM", value: 1176005 },
  { date: "2025-03-13", time: "5:00 AM", value: 1173008 },
  { date: "2025-03-13", time: "6:00 AM", value: 1174005 },
  { date: "2025-03-13", time: "7:00 AM", value: 1174000 },
  { date: "2025-03-13", time: "8:00 AM", value: 1174006 },
  { date: "2025-03-13", time: "9:00 AM", value: 1175004 },
  { date: "2025-03-13", time: "10:00 AM", value: 1175008 },
  { date: "2025-03-13", time: "11:00 AM", value: 1175005 },
  { date: "2025-03-13", time: "12:00 PM", value: 1173100 },
  { date: "2025-03-13", time: "1:00 PM", value: 1172700 },
  { date: "2025-03-13", time: "2:00 PM", value: 1171600 },
  { date: "2025-03-13", time: "3:00 PM", value: 1172600 },
  { date: "2025-03-13", time: "4:00 PM", value: 1174000 },
  { date: "2025-03-13", time: "5:00 PM", value: 1173800 },
  { date: "2025-03-13", time: "6:00 PM", value: 1175500 },
  { date: "2025-03-13", time: "7:00 PM", value: 1176000 },
  { date: "2025-03-13", time: "8:00 PM", value: 1168100 },
  { date: "2025-03-13", time: "9:00 PM", value: 1170400 },
  { date: "2025-03-13", time: "10:00 PM", value: 1171000 },
  { date: "2025-03-13", time: "11:00 PM", value: 1174900 },
  { date: "2025-03-14", time: "12:00 AM", value: 1174200 },
  { date: "2025-03-14", time: "1:00 AM", value: 1174000 },
  { date: "2025-03-14", time: "2:00 AM", value: 1176000 },
  { date: "2025-03-14", time: "3:00 AM", value: 1175500 },
  { date: "2025-03-14", time: "4:00 AM", value: 1175800 },
  { date: "2025-03-14", time: "5:00 AM", value: 1175400 },
  { date: "2025-03-14", time: "6:00 AM", value: 1174000 },
  { date: "2025-03-14", time: "7:00 AM", value: 1174500 },
  { date: "2025-03-14", time: "8:00 AM", value: 1173800 },
  { date: "2025-03-14", time: "9:00 AM", value: 1176500 },
  { date: "2025-03-14", time: "10:00 AM", value: 1174500 },
  { date: "2025-03-14", time: "11:00 AM", value: 1178500 },
  { date: "2025-03-14", time: "12:00 PM", value: 1182500 },
  { date: "2025-03-14", time: "1:00 PM", value: 1186200 },
  { date: "2025-03-14", time: "2:00 PM", value: 1184000 },
  { date: "2025-03-14", time: "3:00 PM", value: 1188700 },
  { date: "2025-03-14", time: "4:00 PM", value: 1185100 },
  { date: "2025-03-14", time: "5:00 PM", value: 1183500 },
  { date: "2025-03-14", time: "6:00 PM", value: 1183300 },
  { date: "2025-03-14", time: "7:00 PM", value: 1184000 },
  { date: "2025-03-14", time: "8:00 PM", value: 1182700 },
  { date: "2025-03-14", time: "9:00 PM", value: 1182300 },
  { date: "2025-03-14", time: "10:00 PM", value: 1181800 },
  { date: "2025-03-14", time: "11:00 PM", value: 1184000 },
  { date: "2025-03-15", time: "12:00 AM", value: 1181700 },
  { date: "2025-03-15", time: "1:00 AM", value: 1180800 },
  { date: "2025-03-15", time: "2:00 AM", value: 1177400 },
  { date: "2025-03-15", time: "3:00 AM", value: 1177800 },
  { date: "2025-03-15", time: "4:00 AM", value: 1180500 },
  { date: "2025-03-15", time: "5:00 AM", value: 1181200 },
  { date: "2025-03-15", time: "6:00 AM", value: 1180100 },
  { date: "2025-03-15", time: "7:00 AM", value: 1183800 },
  { date: "2025-03-15", time: "8:00 AM", value: 1183100 },
  { date: "2025-03-15", time: "9:00 AM", value: 1182500 },
  { date: "2025-03-15", time: "10:00 AM", value: 1186300 },
  { date: "2025-03-15", time: "11:00 AM", value: 1188300 },
  { date: "2025-03-15", time: "12:00 PM", value: 1191000 },
  { date: "2025-03-15", time: "1:00 PM", value: 1190200 },
  { date: "2025-03-15", time: "2:00 PM", value: 1190300 },
  { date: "2025-03-15", time: "3:00 PM", value: 1189200 },
  { date: "2025-03-15", time: "4:00 PM", value: 1187900 },
  { date: "2025-03-15", time: "5:00 PM", value: 1186600 },
  { date: "2025-03-15", time: "6:00 PM", value: 1187600 },
  { date: "2025-03-15", time: "7:00 PM", value: 1189200 },
  { date: "2025-03-15", time: "8:00 PM", value: 1190700 },
  { date: "2025-03-15", time: "9:00 PM", value: 1184800 },
  { date: "2025-03-15", time: "10:00 PM", value: 1183900 },
  { date: "2025-03-15", time: "11:00 PM", value: 1188600 },
  { date: "2025-03-16", time: "12:00 AM", value: 1186800 },
  { date: "2025-03-16", time: "1:00 AM", value: 1187600 },
  { date: "2025-03-16", time: "2:00 AM", value: 1180500 },
  { date: "2025-03-16", time: "3:00 AM", value: 1172200 },
  { date: "2025-03-16", time: "4:00 AM", value: 1176700 },
  { date: "2025-03-16", time: "5:00 AM", value: 1176000 },
  { date: "2025-03-16", time: "6:00 AM", value: 1176100 },
  { date: "2025-03-16", time: "7:00 AM", value: 1177500 },
  { date: "2025-03-16", time: "8:00 AM", value: 1179900 },
  { date: "2025-03-16", time: "9:00 AM", value: 1177800 },
  { date: "2025-03-16", time: "10:00 AM", value: 1177000 },
  { date: "2025-03-16", time: "11:00 AM", value: 1174900 },
  { date: "2025-03-16", time: "12:00 PM", value: 1181500 },
  { date: "2025-03-16", time: "1:00 PM", value: 1182300 },
  { date: "2025-03-16", time: "2:00 PM", value: 1181900 },
  { date: "2025-03-16", time: "3:00 PM", value: 1181100 },
  { date: "2025-03-16", time: "4:00 PM", value: 1183900 },
  { date: "2025-03-16", time: "5:00 PM", value: 1188100 },
  { date: "2025-03-16", time: "6:00 PM", value: 1189900 },
  { date: "2025-03-16", time: "7:00 PM", value: 1181500 },
  { date: "2025-03-16", time: "8:00 PM", value: 1185700 },
  { date: "2025-03-16", time: "9:00 PM", value: 1186300 },
  { date: "2025-03-16", time: "10:00 PM", value: 1188700 },
  { date: "2025-03-16", time: "11:00 PM", value: 1188600 },
  { date: "2025-03-17", time: "12:00 AM", value: 1187400 },
  { date: "2025-03-17", time: "1:00 AM", value: 1187600 },
  { date: "2025-03-17", time: "2:00 AM", value: 1187600 },
  { date: "2025-03-17", time: "3:00 AM", value: 1186300 },
  { date: "2025-03-17", time: "4:00 AM", value: 1186300 },
  { date: "2025-03-17", time: "5:00 AM", value: 1184100 },
  { date: "2025-03-17", time: "6:00 AM", value: 1187600 },
  { date: "2025-03-17", time: "7:00 AM", value: 1187600 },
  { date: "2025-03-17", time: "8:00 AM", value: 1186300 },
  { date: "2025-03-17", time: "9:00 AM", value: 1186300 },
  { date: "2025-03-17", time: "10:00 AM", value: 1184100 },
  { date: "2025-03-17", time: "11:00 AM", value: 1184700 },
  { date: "2025-03-17", time: "12:00 PM", value: 1187000 },
  { date: "2025-03-17", time: "1:00 PM", value: 1184500 },
  { date: "2025-03-17", time: "2:00 PM", value: 1185100 },
  { date: "2025-03-17", time: "3:00 PM", value: 1184700 },
  { date: "2025-03-17", time: "4:00 PM", value: 1187200 },
  { date: "2025-03-17", time: "5:00 PM", value: 1184200 },
  { date: "2025-03-17", time: "6:00 PM", value: 1188300 },
  { date: "2025-03-17", time: "7:00 PM", value: 1190200 },
  { date: "2025-03-17", time: "8:00 PM", value: 1192800 },
  { date: "2025-03-17", time: "9:00 PM", value: 1201300 },
  { date: "2025-03-17", time: "10:00 PM", value: 1199900 },
  { date: "2025-03-17", time: "11:00 PM", value: 1196800 },
  { date: "2025-03-18", time: "12:00 AM", value: 1200200 },
  { date: "2025-03-18", time: "1:00 AM", value: 1198200 },
  { date: "2025-03-18", time: "2:00 AM", value: 1201100 },
  { date: "2025-03-18", time: "3:00 AM", value: 1200300 },
  { date: "2025-03-18", time: "4:00 AM", value: 1201200 },
  { date: "2025-03-18", time: "5:00 AM", value: 1189800 },
  { date: "2025-03-18", time: "6:00 AM", value: 1195200 },
  { date: "2025-03-18", time: "7:00 AM", value: 1192200 },
  { date: "2025-03-18", time: "8:00 AM", value: 1193400 },
  { date: "2025-03-18", time: "9:00 AM", value: 1194900 },
  { date: "2025-03-18", time: "10:00 AM", value: 1194100 },
  { date: "2025-03-18", time: "11:00 AM", value: 1195600 },
  { date: "2025-03-18", time: "12:00 PM", value: 1197100 },
  { date: "2025-03-18", time: "1:00 PM", value: 1200300 },
  { date: "2025-03-18", time: "2:00 PM", value: 1195900 },
  { date: "2025-03-18", time: "3:00 PM", value: 1201300 },
  { date: "2025-03-18", time: "4:00 PM", value: 1201500 },
  { date: "2025-03-18", time: "5:00 PM", value: 1200600 },
  { date: "2025-03-18", time: "6:00 PM", value: 1202300 },
  { date: "2025-03-18", time: "7:00 PM", value: 1198400 },
  { date: "2025-03-18", time: "8:00 PM", value: 1198500 },
  { date: "2025-03-18", time: "9:00 PM", value: 1201300 },
  { date: "2025-03-18", time: "10:00 PM", value: 1199800 },
  { date: "2025-03-18", time: "11:00 PM", value: 1203100 },
  { date: "2025-03-19", time: "12:00 AM", value: 1194100 },
  { date: "2025-03-19", time: "1:00 AM", value: 1185200 },
  { date: "2025-03-19", time: "2:00 AM", value: 1192100 },
  { date: "2025-03-19", time: "3:00 AM", value: 1191100 },
  { date: "2025-03-19", time: "4:00 AM", value: 1193100 },
  { date: "2025-03-19", time: "5:00 AM", value: 1200400 },
  { date: "2025-03-19", time: "6:00 AM", value: 1202200 },
  { date: "2025-03-19", time: "7:00 AM", value: 1205100 },
  { date: "2025-03-19", time: "8:00 AM", value: 1207700 },
  { date: "2025-03-19", time: "9:00 AM", value: 1200000 },
  { date: "2025-03-19", time: "10:00 AM", value: 1203000 },
  { date: "2025-03-19", time: "11:00 AM", value: 1203000 },
  { date: "2025-03-19", time: "12:00 PM", value: 1199300 },
  { date: "2025-03-19", time: "1:00 PM", value: 1196200 },
  { date: "2025-03-19", time: "2:00 PM", value: 1196900 },
  { date: "2025-03-19", time: "3:00 PM", value: 1200100 },
  { date: "2025-03-19", time: "4:00 PM", value: 1201800 },
  { date: "2025-03-19", time: "5:00 PM", value: 1200600 },
  { date: "2025-03-19", time: "6:00 PM", value: 1197500 },
  { date: "2025-03-19", time: "7:00 PM", value: 1198300 },
  { date: "2025-03-19", time: "8:00 PM", value: 1200000 },
  { date: "2025-03-19", time: "9:00 PM", value: 1202100 },
  { date: "2025-03-19", time: "10:00 PM", value: 1203700 },
  { date: "2025-03-19", time: "11:00 PM", value: 1205500 },
  { date: "2025-03-20", time: "12:00 AM", value: 1206000 },
  { date: "2025-03-20", time: "1:00 AM", value: 1208400 },
  { date: "2025-03-20", time: "2:00 AM", value: 1205200 },
  { date: "2025-03-20", time: "3:00 AM", value: 1205900 },
  { date: "2025-03-20", time: "4:00 AM", value: 1208100 },
  { date: "2025-03-20", time: "5:00 AM", value: 1213200 },
  { date: "2025-03-20", time: "6:00 AM", value: 1214800 },
  { date: "2025-03-20", time: "7:00 AM", value: 1210700 },
  { date: "2025-03-20", time: "8:00 AM", value: 1212300 },
  { date: "2025-03-20", time: "9:00 AM", value: 1216600 },
  { date: "2025-03-20", time: "10:00 AM", value: 1211500 },
  { date: "2025-03-20", time: "11:00 AM", value: 1214600 },
  { date: "2025-03-20", time: "12:00 PM", value: 1206400 },
  { date: "2025-03-20", time: "1:00 PM", value: 1204300 },
  { date: "2025-03-20", time: "2:00 PM", value: 1204700 },
  { date: "2025-03-20", time: "3:00 PM", value: 1205700 },
];

const dailyData = [
  { date: "2025-02-21", value: 1150200 },
  { date: "2025-02-22", value: 1157400 },
  { date: "2025-02-23", value: 1149800 },
  { date: "2025-02-24", value: 1143500 },
  { date: "2025-02-25", value: 1152700 },
  { date: "2025-02-26", value: 1168900 },
  { date: "2025-02-27", value: 1162300 },
  { date: "2025-02-28", value: 1175600 },
  { date: "2025-03-01", value: 1169200 },
  { date: "2025-03-02", value: 1176800 },
  { date: "2025-03-03", value: 1182500 },
  { date: "2025-03-04", value: 1167300 },
  { date: "2025-03-05", value: 1160100 },
  { date: "2025-03-06", value: 1178600 },
  { date: "2025-03-07", value: 1191200 },
  { date: "2025-03-08", value: 1183500 },
  { date: "2025-03-09", value: 1175100 },
  { date: "2025-03-10", value: 1182700 },
  { date: "2025-03-11", value: 1194300 },
  { date: "2025-03-12", value: 1185800 },
  { date: "2025-03-13", value: 1186002 },
  { date: "2025-03-14", value: 1174200 },
  { date: "2025-03-15", value: 1181700 },
  { date: "2025-03-16", value: 1186800 },
  { date: "2025-03-17", value: 1187400 },
  { date: "2025-03-18", value: 1200200 },
  { date: "2025-03-19", value: 1194100 },
  { date: "2025-03-20", value: 1206000 },
];

const weeklyData = [
  { date: "2024-12-13", value: 1132500 },
  { date: "2024-12-20", value: 1127800 },
  { date: "2024-12-27", value: 1143200 },
  { date: "2025-01-03", value: 1138900 },
  { date: "2025-01-10", value: 1145600 },
  { date: "2025-01-17", value: 1156700 },
  { date: "2025-01-24", value: 1149300 },
  { date: "2025-01-31", value: 1162800 },
  { date: "2025-02-07", value: 1158400 },
  { date: "2025-02-14", value: 1167900 },
  { date: "2025-02-21", value: 1172300 },
  { date: "2025-02-28", value: 1150200 },
  { date: "2025-03-06", value: 1175600 },
  { date: "2025-03-13", value: 1178600 },
  { date: "2025-03-20", value: 1186002 },
  { date: "2025-03-27", value: 1206000 },
];

const monthlyData = [
  { date: "2024-03-01", value: 1148500 },
  { date: "2024-04-01", value: 1145800 },
  { date: "2024-05-01", value: 1138200 },
  { date: "2024-06-01", value: 1138900 },
  { date: "2024-07-01", value: 1132600 },
  { date: "2024-08-01", value: 1136700 },
  { date: "2024-09-01", value: 1138300 },
  { date: "2024-10-01", value: 1132800 },
  { date: "2024-11-01", value: 1148400 },
  { date: "2024-12-01", value: 1142900 },
  { date: "2025-01-01", value: 1157900 },
  { date: "2025-02-01", value: 1162300 },
  { date: "2025-03-01", value: 1169200 },
];

const yearlyData = [
  { date: "2016-01-01", value: 920500 },
  { date: "2017-01-01", value: 967800 },
  { date: "2018-01-01", value: 988200 },
  { date: "2019-01-01", value: 998900 },
  { date: "2020-01-01", value: 892600 },
  { date: "2021-01-01", value: 916700 },
  { date: "2022-01-01", value: 988300 },
  { date: "2023-01-01", value: 1022800 },
  { date: "2024-01-01", value: 1128400 },
  { date: "2025-01-01", value: 1169200 },
];

const formatDate = (dateStr: string, period: string) => {
  const date = new Date(dateStr);
  if (period === "1d") {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } else if (period === "1w") {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } else if (period === "1m") {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  } else if (period === "1y") {
    return date.toLocaleDateString("en-US", { year: "numeric" });
  } else {
    return dateStr;
  }
};

const chartConfig = {
  value: {
    label: "Value",
    color: "var(--chart-1)",
  },
  projected: {
    label: "Projected",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

const TIME_PERIOD_OPTIONS = ["1h", "1d", "1w", "1m", "1y"];

const ViewOption = ({ id, value }: { id: string; value: string }) => {
  return (
    <label className="relative z-10 inline-flex h-full min-w-8 cursor-pointer items-center justify-center px-2 whitespace-nowrap transition-colors select-none uppercase text-foreground has-data-[state=unchecked]:text-muted-foreground">
      {value}
      <RadioGroupItem id={`${id}-${value}`} value={value} className="sr-only" />
    </label>
  );
};

interface CustomCursorProps {
  fill?: string;
  pointerEvents?: string;
  height?: number;
  points?: Array<{ x: number; y: number }>;
  className?: string;
}



export function CoinChart() {
  const id = useId();
  const [selectedValue, setSelectedValue] = useState("1h");
  const selectedIndex = TIME_PERIOD_OPTIONS.indexOf(selectedValue);

  // Determine which data set to use based on the selected time period
  const getChartDataForTimePeriod = () => {
    switch (selectedValue) {
      case "1h":
        return hourlyData;
      case "1d":
        return dailyData;
      case "1w":
        return weeklyData;
      case "1m":
        return monthlyData;
      case "1y":
        return yearlyData;
      default:
        return hourlyData;
    }
  };

  const chartDataToUse = getChartDataForTimePeriod();
  const [selectedTimeframe, setSelectedTimeframe] = useState('1H');
  const [selectedTab, setSelectedTab] = useState(1);

  const {user,tradeData} = useUserContext()
  const {data:last_hist, isPending:isFinding} = useGetLastHistory(user?.user_id)
const {mutateAsync:createHistory, isPending:isCreating} = useCreateHistory()
const {data:transaction} = useLastTransaction(user?.user_id)


 


console.log(transaction)

//const prices =  generateTradePrice(transaction?.currency, transaction?.type)

 

  let icons = [AlignHorizontalDistributeCenter ,ChartNoAxesCombined , ChartSpline]
  return (
    <Card className="gap-4 bg-transparent border-0">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-0.5">
            <CardTitle>ArkFi</CardTitle>
            <div className="font-bold text-3xl mb-1">
              <span className="text-xl text-muted-foreground">$</span>
              {tradeData.close_price.toFixed(2)}
            </div>
            <div className="text-emerald-500 text-sm font-medium">
              ↗ {tradeData.price_changes?.toFixed(2)} ({tradeData.percentage_changes?.toFixed(2)}%)
            </div>
          </div>

          <div className="flex bg-gray-900 gap-3 px-2 rounded-lg p-1 mb-6">
        {icons.map((Tab, i) => (
          <button
            key={i}
            onClick={() => setSelectedTab(i)}
            className={`flex-1 flex items-center  justify-center py-2 text-sm font-medium rounded-md transition-all ${
              i === selectedTab ? 'bg-slate-800 border-slate-700 shadow-2xl shadow-slate-900/50' : 'bg-transparent text-gray-400'
            }`}
          >
             < Tab className='w-6 h-6' />
          </button>
        ))}
      </div>
        
        </div>
      </CardHeader>
      <CardContent>
      {
         selectedTab === 0 ?  <RealtimeChartWiderCandles asset={transaction?.currency} /> : selectedTab === 1 ? <RealtimeLineAreaChart asset={transaction?.currency}/> : <RealtimeLineChart asset={transaction?.currency} /> 
       }
        
      </CardContent>
    </Card>
  );
}
