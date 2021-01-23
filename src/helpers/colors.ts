export function randomColorSet(index: number): string {
  // Stolen from https://flatuicolors.com/palette/nl
  const colors = [
    'rgba(255, 195, 18,1.0)', 'rgba(196, 229, 56,1.0)', 'rgba(18, 203, 196,1.0)', 'rgba(253, 167, 223,1.0)', 'rgba(237, 76, 103,1.0)',
    'rgba(247, 159, 31,1.0)', 'rgba(163, 203, 56,1.0)', 'rgba(18, 137, 167,1.0)', 'rgba(217, 128, 250,1.0)', 'rgba(181, 52, 113,1.0)',
    'rgba(238, 90, 36,1.0)', 'rgba(0, 148, 50,1.0)', 'rgba(6, 82, 221,1.0)', 'rgba(153, 128, 250,1.0)', 'rgba(131, 52, 113,1.0)',
    'rgba(234, 32, 39,1.0)', 'rgba(0, 98, 102,1.0)', 'rgba(27, 20, 100,1.0)', 'rgba(87, 88, 187,1.0)', 'rgba(111, 30, 81,1.0)',
  ];
  return colors[index % colors.length];
}
