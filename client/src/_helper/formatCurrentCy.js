export function fCurrency(s) {
  if (!s) return;
  s = s.toString();
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' đ';
}
