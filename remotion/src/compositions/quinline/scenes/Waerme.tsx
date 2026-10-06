// Wärmedämmung: the U-values are the heroes. Both counters count down from
// 1,00 and lock on the beat (local 45); a bar on a shared 0 … 1,0 scale shows
// "shorter = better"; the 84's rating "Passivhaustauglich" gets the yellow rule.
import type React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { colors, ease } from "../../../brand/tokens";
import {
  CategoryLabel,
  Column,
  Divider,
  GRID,
  RiseText,
  SceneBg,
  clamp,
  fmt,
} from "../kit";

/** Bar scale shared by both columns: U = 1,0 W/(m²K) ≙ 600 px. */
const SCALE = 600;
/** Content block inside the 720 px column: 600 px wide, centred on the column axis. */
const BLOCK_LEFT = (GRID.colWidth - SCALE) / 2;
const DIVIDER_BOTTOM = 860;

/** Subscript (U_w) set smaller and lower without disturbing the line box. */
const Sub: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span
    style={{
      fontSize: "0.62em",
      position: "relative",
      top: "0.32em",
      lineHeight: 0,
      marginLeft: "0.02em",
    }}
  >
    {children}
  </span>
);

/** Superscript (m²) set smaller and higher. */
const Sup: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span
    style={{
      fontSize: "0.6em",
      position: "relative",
      top: "-0.62em",
      lineHeight: 0,
      marginLeft: "0.04em",
    }}
  >
    {children}
  </span>
);

const Unit: React.FC = () => (
  <span style={{ whiteSpace: "nowrap" }}>
    W/(m<Sup>2</Sup>K)
  </span>
);

type ColumnProps = {
  system: 74 | 84;
  value: number;
  rating: string;
  /** Local frame offset of this column (the 84 column trails by a few frames). */
  delay: number;
  /**
   * Counter window [start, end] with ease.snap. The end is chosen so that the
   * displayed (2-decimal) value reaches its final value exactly on local 45.
   */
  count: readonly [number, number];
  accent?: boolean;
};

const UValueColumn: React.FC<ColumnProps> = ({
  system,
  value,
  rating,
  delay,
  count,
  accent = false,
}) => {
  const frame = useCurrentFrame();
  const d = delay;

  const numberIn = interpolate(frame, [6 + d, 22 + d], [0, 1], {
    ...clamp,
    easing: ease.reveal,
  });
  const u = interpolate(frame, count, [1, value], {
    ...clamp,
    easing: ease.snap,
  });
  const captionIn = interpolate(frame, [12 + d, 28 + d], [0, 1], {
    ...clamp,
    easing: ease.reveal,
  });
  const unitIn = interpolate(frame, [16 + d, 32 + d], [0, 1], {
    ...clamp,
    easing: ease.reveal,
  });
  // Scale track draws itself, then the value fills it.
  const track = interpolate(frame, [20 + d, 38 + d], [0, 1], {
    ...clamp,
    easing: ease.snap,
  });
  const fill = interpolate(frame, [30, 50], [0, value], {
    ...clamp,
    easing: ease.reveal,
  });
  const ratingIn = interpolate(frame, [47 + d, 62 + d], [0, 1], {
    ...clamp,
    easing: ease.reveal,
  });
  const rule = interpolate(frame, [60, 78], [0, 1], {
    ...clamp,
    easing: ease.snap,
  });

  return (
    <Column system={system}>
      <div
        style={{
          position: "absolute",
          left: BLOCK_LEFT,
          width: SCALE,
          top: 0,
        }}
      >
        {/* U_w bis */}
        <RiseText
          progress={captionIn}
          style={{ position: "absolute", top: 32, left: 4 }}
        >
          <div
            style={{
              fontSize: 36,
              fontWeight: 500,
              lineHeight: 1.15,
              color: colors.blue20,
              whiteSpace: "nowrap",
            }}
          >
            U<Sub>w</Sub> bis
          </div>
        </RiseText>

        {/* Hero value + unit */}
        <div
          style={{
            position: "absolute",
            top: 72,
            left: 0,
            width: SCALE + 60,
            overflow: "hidden",
            paddingBottom: 18,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 18,
            }}
          >
            <div
              style={{
                fontSize: 206,
                fontWeight: 700,
                lineHeight: 1,
                letterSpacing: "-0.03em",
                fontVariantNumeric: "tabular-nums",
                translate: `0 ${(1 - numberIn) * 110}%`,
              }}
            >
              {fmt(u, 2)}
            </div>
            <div
              style={{
                fontSize: 40,
                fontWeight: 500,
                lineHeight: 1,
                translate: `0 ${(1 - unitIn) * 300}%`,
              }}
            >
              <Unit />
            </div>
          </div>
        </div>

        {/* Rating — the 84's advantage gets the yellow rule drawn under it */}
        <div style={{ position: "absolute", top: 322, left: 2 }}>
          <RiseText progress={ratingIn}>
            <div
              style={{
                fontSize: 50,
                fontWeight: 700,
                lineHeight: 1.15,
                whiteSpace: "nowrap",
              }}
            >
              {rating}
            </div>
          </RiseText>
          {accent ? (
            <div
              style={{
                marginTop: 4,
                height: 8,
                width: `${rule * 100}%`,
                backgroundColor: colors.yellow,
              }}
            />
          ) : null}
        </div>

        {/* Bar on the shared 0 … 1,0 scale */}
        <div style={{ position: "absolute", top: 460, left: 0 }}>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: SCALE * track,
              height: 22,
              backgroundColor: colors.blue90,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: SCALE * fill,
              height: 22,
              backgroundColor: colors.white,
            }}
          />
          {[0, 1].map((at) => (
            <div
              key={at}
              style={{
                position: "absolute",
                left: at * SCALE - 1,
                top: -10,
                width: 2,
                height: 42,
                backgroundColor: colors.blue70,
                scale: `1 ${track}`,
              }}
            />
          ))}
          {[0, 1].map((at) => (
            <div
              key={`l${at}`}
              style={{
                position: "absolute",
                left: at * SCALE - 60,
                width: 120,
                top: 44,
                textAlign: "center",
                fontSize: 28,
                fontWeight: 400,
                lineHeight: 1,
                color: colors.blue20,
                opacity: track,
              }}
            >
              {at === 0 ? "0" : "1,0"}
            </div>
          ))}
        </div>
      </div>
    </Column>
  );
};

export const WaermeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const footer = interpolate(frame, [66, 82], [0, 1], {
    ...clamp,
    easing: ease.reveal,
  });
  // Calm drift while the frame holds.
  const drift = interpolate(frame, [0, 105], [6, -6], {
    ...clamp,
    easing: ease.loop,
  });

  return (
    <SceneBg>
      <CategoryLabel icon="thermostat" title="Wärmedämmung" />
      <Divider bottom={DIVIDER_BOTTOM} />

      <div style={{ position: "absolute", inset: 0, translate: `0 ${drift}px` }}>
        <UValueColumn
          system={74}
          value={0.82}
          rating="Niedrigenergiehäuser"
          delay={0}
          count={[14, 75]}
        />
        <UValueColumn
          system={84}
          value={0.71}
          rating="Passivhaustauglich"
          delay={3}
          count={[17, 66]}
          accent
        />
      </div>

      <RiseText
        progress={footer}
        style={{
          position: "absolute",
          top: 905,
          left: GRID.center - 700,
          width: 1400,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 32,
            fontWeight: 500,
            lineHeight: 1.3,
            color: colors.blue20,
          }}
        >
          Je kleiner der U<Sub>w</Sub>-Wert, desto besser die Wärmedämmung.
        </div>
      </RiseText>
    </SceneBg>
  );
};
