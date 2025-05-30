import { formatNumber } from "@/lib/utils";
import { CHART_PALETTES, COLORS } from "./colors";
import { TEXT_COLORS } from "./typography";

/**
 * Returns a reusable ECharts tooltip configuration for both allocation and time-series charts.
 * @param data - The data array for the chart
 * @param title - Optional title to show at the top of the tooltip
 * @param trigger - Tooltip trigger type ("item" for allocation charts, "axis" for time-series)
 * @param lineColor - Optional color for the indicator dot (used for time-series charts)
 * @param valueFormatter - Optional function to format values (used for time-series charts)
 */
export function getCustomTooltipConfig(
  data: { category: string; amount: number }[],
  title?: string,
  trigger: "item" | "axis" = "item",
  lineColor?: string,
  valueFormatter: (value: number) => string = (value) => formatNumber(value, 2)
) {
  return {
    trigger,
    backgroundColor: `${COLORS.secondary.DEFAULT}1A`, // alpha (1A = ~10% opacity)
    extraCssText: "backdrop-filter: blur(6px);", // 60% blur effect
    borderRadius: 8,
    confine: true, // Ensures tooltip stays within chart boundaries
    textStyle: {
      color: TEXT_COLORS.primary,
      fontSize: 12,
    },
    formatter:
      trigger === "item"
        ? () => {
            if (!data || data.length === 0) {
              return "";
            }
            let tooltipHtml = '<div style="min-width: 220px; padding: 8px;">';

            // Add title if provided
            if (title) {
              tooltipHtml += `<div style="margin-bottom: 8px; color: ${TEXT_COLORS.primary}; font-weight: 600; font-size: 13px;">${title}</div>`;
            }

            data.forEach((item, index) => {
              const dotColor = CHART_PALETTES.default[index % CHART_PALETTES.default.length];
              const valueDisplay = valueFormatter(item.amount);
              tooltipHtml += `
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: ${index === data.length - 1 ? "0" : "8px"};">
                <div style="display: flex; align-items: center;">
                  <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background-color: ${dotColor}; margin-right: 10px;"></span>
                  <span style="color: ${TEXT_COLORS.primary}; margin-right: 15px; font-size: 12px;">${item.category}</span>
                </div>
                <span style="color: ${TEXT_COLORS.primary}; font-weight: 500; font-size: 13px;">${valueDisplay}</span>
              </div>`;
            });
            tooltipHtml += "</div>";
            return tooltipHtml;
          }
        : (params: any[]) => {
            if (!params || params.length === 0) return "";

            const dataPoint = params[0];
            const formattedValue = valueFormatter(dataPoint.value);

            // Format the date - try to parse and format it nicely
            let formattedDate = dataPoint.axisValueLabel;
            try {
              const date = new Date(dataPoint.axisValueLabel);
              if (!isNaN(date.getTime())) {
                formattedDate = date.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                });
              }
            } catch (e) {
              // Keep original if parsing fails
            }

            let tooltipHtml = '<div style="min-width: 180px; padding: 8px;">';

            // Add title if provided
            if (title) {
              tooltipHtml += `<div style="margin-bottom: 8px; color: ${TEXT_COLORS.primary}; font-weight: 600; font-size: 13px;">${title}</div>`;
            }

            tooltipHtml += `
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <div style="display: flex; align-items: center;">
                <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background-color: ${lineColor || CHART_PALETTES.default[0]}; margin-right: 10px;"></span>
                <span style="color: ${TEXT_COLORS.primary}; font-size: 12px;">${formattedDate}</span>
              </div>
              <span style="color: ${TEXT_COLORS.primary}; font-weight: 600; margin-left: 15px; font-size: 13px;">${formattedValue}</span>
            </div>
          </div>`;

            return tooltipHtml;
          },
  };
}
