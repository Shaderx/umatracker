#!/usr/bin/env python3
"""
Sort RaceComplete.csv using the row order from RaceSorted.csv.

Rules:
- Correlate using ONLY the Japanese race name (first column of both files).
- Preserve row data exactly as-is; do not rewrite field content.
- Keep the RaceComplete header as-is and at the top.
- Any RaceComplete rows whose names do not appear in RaceSorted are appended
  to the end, preserving their original relative order.

Usage (from repo root):
  python sort_race_complete.py \
    --sorted RaceSorted.csv \
    --complete RaceComplete.csv \
    --output RaceComplete_sorted.csv

All arguments are optional and default to the filenames above.
"""

from __future__ import annotations

import argparse
import csv
from pathlib import Path
from typing import Dict, List, Tuple


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Sort RaceComplete.csv using the row order from RaceSorted.csv")
    parser.add_argument("--sorted", dest="sorted_path", default="RaceSorted.csv", help="Path to RaceSorted.csv")
    parser.add_argument("--complete", dest="complete_path", default="RaceComplete.csv", help="Path to RaceComplete.csv")
    parser.add_argument("--output", dest="output_path", default="RaceComplete_sorted.csv", help="Output CSV path")
    parser.add_argument("--verbose", action="store_true", help="Print summary details")
    return parser.parse_args()


def build_name_to_order_index(sorted_csv_path: Path) -> Dict[str, int]:
    """Build a mapping from Japanese race name to its earliest row index in RaceSorted.csv.

    - Skips header-like rows (first column equal to 'Japanese' or 'Name').
    - Uses the physical row order (0-based) for ordering.
    - If a name appears multiple times, the earliest occurrence is used.
    """
    name_to_index: Dict[str, int] = {}
    with sorted_csv_path.open("r", encoding="utf-8-sig", newline="") as f:
        reader = csv.reader(f)
        for row_index, row in enumerate(reader):
            if not row:
                continue
            japanese_name = (row[0] or "").strip()
            if not japanese_name:
                continue
            if japanese_name in ("Japanese", "Name"):
                # Skip headers present in multiple sections of RaceSorted.csv
                continue
            # Record first occurrence only
            if japanese_name not in name_to_index:
                name_to_index[japanese_name] = row_index
    return name_to_index


def read_racecomplete_lines_with_names(complete_csv_path: Path) -> Tuple[str, List[Tuple[int, str, str]], str]:
    """Read RaceComplete.csv returning:
    - header line (string)
    - list of tuples: (original_index, original_line, japanese_name)

    Each data row is preserved exactly as read (content not modified). The
    Japanese name is parsed using csv.reader for robust comma handling.
    """
    with complete_csv_path.open("r", encoding="utf-8-sig", newline="") as f:
        # Read entire content to detect line endings
        data: str = f.read()
        # Detect predominant line ending; default to '\n'
        line_ending = "\r\n" if "\r\n" in data else "\n"
        # Split into lines without keeping line endings
        raw_lines: List[str] = data.splitlines()

    if not raw_lines:
        raise SystemExit(f"File is empty: {complete_csv_path}")

    header_line = raw_lines[0]
    data_lines = raw_lines[1:]

    indexed_lines: List[Tuple[int, str, str]] = []
    for idx, line in enumerate(data_lines):
        # Parse the Japanese name via CSV reader from the raw line
        fields = next(csv.reader([line])) if line else []
        japanese_name = (fields[0] if fields else "").strip()
        indexed_lines.append((idx, line, japanese_name))

    return header_line, indexed_lines, line_ending


def sort_racecomplete(
    name_to_sorted_index: Dict[str, int],
    header_line: str,
    complete_rows: List[Tuple[int, str, str]],
) -> List[str]:
    """Return sorted lines (including header as first line)."""

    def sort_key(item: Tuple[int, str, str]) -> Tuple[int, int, int]:
        original_idx, _line, japanese_name = item
        if japanese_name in name_to_sorted_index:
            return (0, name_to_sorted_index[japanese_name], original_idx)
        # Append to end, preserving original order among unmatched
        return (1, original_idx, 0)

    sorted_rows = sorted(complete_rows, key=sort_key)
    output_lines: List[str] = [header_line]
    output_lines.extend(line for _, line, _ in sorted_rows)
    return output_lines


def write_output(output_path: Path, lines: List[str], line_ending: str) -> None:
    with output_path.open("w", encoding="utf-8-sig", newline="") as f:
        for line in lines:
            f.write(line + line_ending)


def main() -> None:
    args = parse_args()
    sorted_path = Path(args.sorted_path)
    complete_path = Path(args.complete_path)
    output_path = Path(args.output_path)

    if not sorted_path.exists():
        raise SystemExit(f"Missing file: {sorted_path}")
    if not complete_path.exists():
        raise SystemExit(f"Missing file: {complete_path}")

    name_to_index = build_name_to_order_index(sorted_path)
    header_line, complete_rows, line_ending = read_racecomplete_lines_with_names(complete_path)

    output_lines = sort_racecomplete(name_to_index, header_line, complete_rows)
    write_output(output_path, output_lines, line_ending)

    if args.verbose:
        total_rows = len(complete_rows)
        matched = sum(1 for _, _, name in complete_rows if name in name_to_index)
        unmatched = total_rows - matched
        print(f"Sorted rows written: {output_path}")
        print(f"Matched by name: {matched} / {total_rows}")
        if unmatched:
            print(f"Unmatched (appended at end): {unmatched}")


if __name__ == "__main__":
    main()


