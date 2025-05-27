/**
 * @deprecated This file is deprecated. Please use the new style files:
 * - @/common/styles/activeStates for active state styles
 * - @/common/styles/componentStyles for base component styles
 * 
 * This file will be removed in a future version.
 */

// Re-exports for backward compatibility
export {
  TAB_ACTIVE_WITH_UNDERLINE as TAB_ACTIVE_WITH_GRADIENT,
  TAB_ACTIVE_WITH_UNDERLINE as TAB_TRIGGER_ACTIVE_STYLES,
  NAV_ACTIVE_WITH_UNDERLINE as NAV_ITEM_ACTIVE_STYLES,
  NAV_ACTIVE_WITH_UNDERLINE as NAV_ITEM_ACTIVE_WITH_GRADIENT,
  ACTIVE_UNDERLINE_FULL as GRADIENT_UNDERLINE_FULL_WIDTH,
  ACTIVE_UNDERLINE_MEDIUM as GRADIENT_UNDERLINE_MEDIUM,
  ACTIVE_UNDERLINE_SMALL as GRADIENT_UNDERLINE_SMALL,
  ACTIVE_UNDERLINE_MINIMAL as GRADIENT_UNDERLINE_MINIMAL,
} from "@/common/styles/activeStates";

export {
  TAB_BASE_STYLES,
  TAB_BASE_STYLES as TAB_TRIGGER_BASE_STYLES,
  TAB_LIST_STYLES,
  NAV_ITEM_BASE_STYLES,
  NAV_ITEM_INACTIVE_STYLES,
} from "@/common/styles/componentStyles"; 