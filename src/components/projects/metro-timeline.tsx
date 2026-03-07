"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "@/lib/i18n/navigation";

const STOP_MIN_WIDTH = 130;
const FILL_STEP_MS = 40;

type TimelineExhibition = {
  slug: string;
  city: string;
  dateFrom: string | null;
  dateTo: string | null;
};

type MetroTimelineProps = {
  projectSlug: string;
  exhibitions: TimelineExhibition[];
};

export function MetroTimeline({
  projectSlug,
  exhibitions,
}: MetroTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [stopsPerRow, setStopsPerRow] = useState(4);
  const [fillingTarget, setFillingTarget] = useState<number | null>(null);
  const router = useRouter();

  // Measure container width to calculate stops per row
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      const width = el.getBoundingClientRect().width;
      setStopsPerRow(Math.max(2, Math.floor(width / STOP_MIN_WIDTH)));
    };
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Reset fill when exhibitions change (slide change)
  useEffect(() => {
    setFillingTarget(null); // eslint-disable-line react-hooks/set-state-in-effect -- reset on prop change
  }, [exhibitions]);

  // Split exhibitions into rows, distributing evenly
  const rows: TimelineExhibition[][] = [];
  const totalExhibitions = exhibitions.length;
  const numRows = Math.ceil(totalExhibitions / stopsPerRow);
  if (numRows > 0) {
    const basePerRow = Math.floor(totalExhibitions / numRows);
    const remainder = totalExhibitions % numRows;
    let offset = 0;
    for (let r = 0; r < numRows; r++) {
      // Give extra items to the first rows
      const count = basePerRow + (r < remainder ? 1 : 0);
      rows.push(exhibitions.slice(offset, offset + count));
      offset += count;
    }
  }

  // Handle exhibition click — start fill animation, then navigate
  const handleClick = useCallback(
    (globalIndex: number) => {
      if (fillingTarget !== null) return;
      setFillingTarget(globalIndex);

      const totalSegments = globalIndex * 2 + 1;
      const animDuration = totalSegments * FILL_STEP_MS + 300;
      setTimeout(() => {
        router.push(
          `/projects/${projectSlug}/${exhibitions[globalIndex].slug}`
        );
      }, animDuration);
    },
    [fillingTarget, projectSlug, exhibitions, router]
  );

  // Fill timing helpers
  const dotDelay = (i: number) => i * 2 * FILL_STEP_MS;
  const connDelay = (i: number) => (i * 2 + 1) * FILL_STEP_MS;
  const isDotFilled = (i: number) =>
    fillingTarget !== null && i <= fillingTarget;
  const isConnFilled = (fromIdx: number, toIdx: number) => {
    const higher = Math.max(fromIdx, toIdx);
    return fillingTarget !== null && fillingTarget >= higher;
  };
  const connAnimDelay = (fromIdx: number, toIdx: number) =>
    connDelay(Math.min(fromIdx, toIdx));

  if (exhibitions.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className="w-full px-6 sm:px-12 md:px-16 lg:px-20 pt-6 pb-2"
    >
      {rows.map((row, rowIndex) => {
        const isReversed = rowIndex % 2 === 1;
        let rowStartGlobal = 0;
        for (let r = 0; r < rowIndex; r++) rowStartGlobal += rows[r].length;

        // Build display order: reversed rows show right-to-left
        const displayStops = isReversed ? [...row].reverse() : row;

        return (
          <div key={rowIndex}>
            {/* Row of stops and connectors */}
            <div className="flex items-start">
              {displayStops.map((exhibition, displayI) => {
                const globalI = isReversed
                  ? rowStartGlobal + (row.length - 1 - displayI)
                  : rowStartGlobal + displayI;

                const isLastInDisplay = displayI === displayStops.length - 1;

                // Next stop's global index (for connector)
                const nextGlobalI = isReversed
                  ? globalI - 1
                  : globalI + 1;

                const dotFilled = isDotFilled(globalI);
                const cFilled =
                  !isLastInDisplay && isConnFilled(globalI, nextGlobalI);
                const cDelay =
                  !isLastInDisplay
                    ? connAnimDelay(globalI, nextGlobalI)
                    : 0;

                return (
                  <div
                    key={`${rowIndex}-${displayI}`}
                    className="flex items-start flex-1 min-w-0"
                  >
                    {/* Stop */}
                    <button
                      onClick={() => handleClick(globalI)}
                      className="flex flex-col items-center gap-1 min-w-0 w-full group cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                      aria-label={`${exhibition.city}${exhibition.dateFrom ? ` (${exhibition.dateFrom})` : ""}`}
                    >
                      {/* Dot */}
                      <div
                        className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border-2 shrink-0 transition-colors ${
                          dotFilled
                            ? "bg-brand-500 border-brand-500 scale-110"
                            : "border-white/40 bg-white/10 group-hover:border-white group-hover:bg-white/20"
                        }`}
                        style={{
                          transitionDelay:
                            fillingTarget !== null
                              ? `${dotDelay(globalI)}ms`
                              : "0ms",
                          transitionDuration: `${FILL_STEP_MS}ms`,
                        }}
                      />
                      {/* City */}
                      <span className="text-[10px] sm:text-xs text-white/80 text-center leading-tight truncate max-w-full px-1">
                        {exhibition.city}
                      </span>
                      {/* Dates */}
                      {(exhibition.dateFrom || exhibition.dateTo) && (
                        <span className="text-[8px] sm:text-[10px] text-white/40 text-center leading-tight whitespace-nowrap">
                          {exhibition.dateFrom && exhibition.dateTo
                            ? `${exhibition.dateFrom} / ${exhibition.dateTo}`
                            : exhibition.dateFrom || exhibition.dateTo}
                        </span>
                      )}
                    </button>

                    {/* Horizontal connector to next stop */}
                    {!isLastInDisplay && (
                      <div className="flex-1 min-w-4 flex items-start pt-[5px] sm:pt-[6px]">
                        <div className="w-full h-[2px] relative bg-white/15 rounded-full overflow-hidden">
                          <div
                            className="absolute inset-y-0 bg-brand-500 rounded-full"
                            style={{
                              [isReversed ? "right" : "left"]: 0,
                              width: cFilled ? "100%" : "0%",
                              transitionProperty: "width",
                              transitionDelay:
                                fillingTarget !== null
                                  ? `${cDelay}ms`
                                  : "0ms",
                              transitionDuration: `${FILL_STEP_MS}ms`,
                              transitionTimingFunction: "ease-out",
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* U-turn connector between rows */}
            {rowIndex < rows.length - 1 && (
              <UTurn
                side={isReversed ? "left" : "right"}
                stopsInRow={row.length}
                stopsPerRow={stopsPerRow}
                filled={isConnFilled(
                  rowStartGlobal + row.length - 1,
                  rowStartGlobal + row.length
                )}
                delay={connAnimDelay(
                  rowStartGlobal + row.length - 1,
                  rowStartGlobal + row.length
                )}
                isAnimating={fillingTarget !== null}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function UTurn({
  side,
  stopsInRow,
  stopsPerRow,
  filled,
  delay,
  isAnimating,
}: {
  side: "left" | "right";
  stopsInRow: number;
  stopsPerRow: number;
  filled: boolean;
  delay: number;
  isAnimating: boolean;
}) {
  // Position the U-turn under the edge stop
  // Each stop is flex-1 within the row, so the edge stop center is at
  // (stopIndex + 0.5) / stopsPerRow * 100%
  const stopIndex = side === "right" ? stopsInRow - 1 : 0;
  const centerPercent = ((stopIndex + 0.5) / stopsPerRow) * 100;

  return (
    <div className="relative h-6 w-full">
      <div
        className="absolute top-0 h-full w-[2px] bg-white/15 rounded-full overflow-hidden"
        style={{ left: `${centerPercent}%`, transform: "translateX(-50%)" }}
      >
        <div
          className="absolute inset-x-0 top-0 bg-brand-500 rounded-full"
          style={{
            height: filled ? "100%" : "0%",
            transitionProperty: "height",
            transitionDelay: isAnimating ? `${delay}ms` : "0ms",
            transitionDuration: `${FILL_STEP_MS}ms`,
            transitionTimingFunction: "ease-out",
          }}
        />
      </div>
    </div>
  );
}
