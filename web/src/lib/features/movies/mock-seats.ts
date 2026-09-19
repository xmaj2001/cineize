import type { MockSeat, TicketStatus } from "./types";

/**
 * Generates a mock seat grid for a cinema room.
 * ~70% available, ~25% sold, ~5% reserved — simulates a partially-booked session.
 */
export function generateMockSeats(
  rows: number = 11,
  seatsPerRow: number = 16,
): MockSeat[][] {
  const ROW_LABELS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const grid: MockSeat[][] = [];

  for (let r = 0; r < rows; r++) {
    const rowLabel = ROW_LABELS[r] ?? `R${r + 1}`;
    const row: MockSeat[] = [];

    for (let s = 1; s <= seatsPerRow; s++) {
      const rand = Math.random();
      let status: TicketStatus = "AVAILABLE";
      if (rand > 0.75) status = "SOLD";
      else if (rand > 0.70) status = "RESERVED";

      row.push({
        id: `${rowLabel}${s}`,
        row: rowLabel,
        number: s,
        type: r >= rows - 1 ? "ACCESSIBLE" : r >= rows - 2 ? "RECLINER" : "STANDARD",
        status,
      });
    }

    grid.push(row);
  }

  return grid;
}
