const colorPalette = [
  '#006400',
  '#8B008B',
  '#7B68EE',
  '#0000CD',
  '#7B68EE',
  '#FF4500',
  '#C71585',
  '#00CED1',
  '#FF7F7F',
  '#00FFFF',
  '#FFDAB9',
  '#FFA500',
  '#40E0D0',
  '#FF8C00',
  '#00FF00',
  '#EE82EE',
  '#7B68EE',
  '#0000CD',
  '#FF6347',
  '#FFA07A',
  '#3CB371',
  '#9ACD32',
  '#FF00FF',
  '#87CEEB',
  '#DC143C',
  '#180000',
  '#B8860B',
  '#808000',
];

export function generateColorForName(name: string): string {
  const hash = Array.from(name).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colorPalette[hash % colorPalette.length];
}
