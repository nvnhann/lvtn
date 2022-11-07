export function fCurrency(s) {
    s = s.toString();
    return s.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' đ';
}
