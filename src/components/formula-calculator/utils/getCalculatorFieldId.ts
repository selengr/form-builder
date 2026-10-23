export const getCalculatorFieldId = (item: { elementStr?: string; extMap?: Record<string, any> }) =>
  item.extMap?.STICKY_FUNC ?? item.extMap?.UNIC_NAME ?? item.elementStr;
