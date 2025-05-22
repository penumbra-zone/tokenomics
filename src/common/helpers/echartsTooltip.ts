import { CHART_PALETTES, COLORS } from "./colors";
import { TEXT_COLORS } from "./typography";

/**
 * Returns a reusable ECharts tooltip configuration for allocation charts.
 * @param data - The data array for the chart
 */
export function getCustomTooltipConfig(data: { category: string; amount: number }[]) {
  return {
    trigger: "item",
    backgroundColor: "#2263621A", // teal with alpha
    extraCssText: "backdrop-filter: blur(6px);", // 60% blur effect
    borderRadius: 8,
    confine: true, // Ensures tooltip stays within chart boundaries
    formatter: () => {
      if (!data || data.length === 0) {
        return "";
      }
      let tooltipHtml = '<div style="min-width: 220px;">';
      data.forEach((item, index) => {
        const dotColor = CHART_PALETTES.default[index % CHART_PALETTES.default.length];
        const valueDisplay =
          typeof item.amount === "number"
            ? item.amount.toLocaleString()
            : item.amount;
        tooltipHtml += `
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: ${index === data.length - 1 ? "0" : "8px"};">
            <div style="display: flex; align-items: center;">
              <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background-color: ${dotColor}; margin-right: 10px;"></span>
              <span style="color: ${TEXT_COLORS.primary}; margin-right: 15px;">${item.category}</span>
            </div>
            <span style="color: ${TEXT_COLORS.primary}; font-weight: 500;">${valueDisplay}</span>
          </div>`;
      });
      tooltipHtml += "</div>";
      return tooltipHtml;
    },
  };
} 