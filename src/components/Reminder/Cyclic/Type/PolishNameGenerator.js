import { polishPlural } from "@/helpers/polishPluralizer";

export function getTypeName(periodicity, type_id) {
  const cyclicTypeNames = {
    1: polishPlural("Dzień", "Dni", "Dni", periodicity),
    2: polishPlural("Tydzień", "Tygodnie", "Tygodni", periodicity),
    3: polishPlural("Miesiąc", "Miesiące", "Miesięcy", periodicity),
    4: polishPlural("Rok", "Lata", "Lat", periodicity)
  };
  return cyclicTypeNames[type_id];
}
