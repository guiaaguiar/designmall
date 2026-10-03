/**
 * Utilitários de texto para conteúdo editável.
 *
 * Marcação simples suportada nos textos do /admin:
 *   *texto*   → ênfase (cor de destaque)
 *   **texto** → destaque forte (usado no manifesto)
 *   quebra de linha (\n) → <br>
 */

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

/** Converte *ênfase* e quebras de linha em HTML seguro. */
export function richText(value: string): string {
  return escapeHtml(value)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>');
}

/** Remove a marcação (para atributos, alt, aria-label…). */
export function plainText(value: string): string {
  return value.replace(/\*\*?(.+?)\*\*?/g, '$1').replace(/\n/g, ' ');
}

export type Word = { text: string; strong: boolean; /** sem espaço antes (pontuação após destaque) */ glue: boolean };

/** Quebra um texto em palavras, preservando trechos **destacados**. */
export function splitWords(value: string): Word[] {
  const words: Word[] = [];
  const parts = value.split(/(\*\*.+?\*\*)/g).filter(Boolean);
  let prevEndedWithSpace = true;
  for (const part of parts) {
    const strong = part.startsWith('**') && part.endsWith('**');
    const clean = strong ? part.slice(2, -2) : part;
    const glueFirst = !prevEndedWithSpace && !/^\s/.test(clean);
    clean
      .split(/\s+/)
      .filter(Boolean)
      .forEach((w, i) => words.push({ text: w, strong, glue: i === 0 && glueFirst && words.length > 0 }));
    prevEndedWithSpace = /\s$/.test(clean);
  }
  return words;
}

const TZ = 'America/Sao_Paulo';

/** Data de hoje (YYYY-MM-DD) no fuso de Brasília. */
export function todayISO(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(new Date());
}

const parseISO = (iso: string) => new Date(`${iso}T12:00:00Z`);

export function dayAndMonth(iso: string) {
  const d = parseISO(iso);
  return {
    day: new Intl.DateTimeFormat('pt-BR', { day: '2-digit', timeZone: 'UTC' }).format(d),
    month: new Intl.DateTimeFormat('pt-BR', { month: 'short', timeZone: 'UTC' }).format(d).replace('.', ''),
  };
}

/** "19 a 25 de out", "14 de nov", "a partir de 14 de nov" */
export function formatDateRange(start: string | null, end: string | null): string {
  if (!start) return '';
  const fmt = (iso: string, withMonth = true) =>
    new Intl.DateTimeFormat('pt-BR', {
      day: 'numeric',
      ...(withMonth ? { month: 'short' } : {}),
      timeZone: 'UTC',
    })
      .format(parseISO(iso))
      .replace('.', '');
  if (!end) return `A partir de ${fmt(start)}`;
  if (start === end) return fmt(start);
  const sameMonth = start.slice(0, 7) === end.slice(0, 7);
  return sameMonth ? `${fmt(start, false)} a ${fmt(end)}` : `${fmt(start)} a ${fmt(end)}`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value);
}

/** Iniciais para o monograma da loja: "Lorem Moda" → "LM" */
export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter((w) => w.length > 2 || /^[A-ZÀ-Ú]/.test(w))
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}
