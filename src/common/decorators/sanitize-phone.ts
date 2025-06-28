import { Transform } from "class-transformer";

export function SanitizePhone() {
  return Transform(({ value }) => {
    if (typeof value !== "string") return value;

    // Удаляем всё кроме цифр
    let digits = value.replace(/\D/g, "");

    // Заменяем 8 на +7
    if (digits.startsWith("8")) {
      digits = "7" + digits.slice(1);
    }

    // Добавляем +, если не хватает
    if (digits.startsWith("7") && digits.length === 11) {
      // Форматируем в +7 (XXX) XXX-XX-XX
      const formatted = `+7 (${digits.slice(1, 4)}) ${digits.slice(
        4,
        7
      )}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`;
      return formatted;
    }

    // Если уже в нужном формате — не трогаем
    if (/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(value)) {
      return value;
    }

    return value;
  });
}
