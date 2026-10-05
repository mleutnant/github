import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, ease, fontFamily } from "../brand/tokens";
import img1950 from "../../../projects/schmidt-historie/assets/1950.jpg";
import img1976 from "../../../projects/schmidt-historie/assets/1976.jpg";
import img1996 from "../../../projects/schmidt-historie/assets/1996.jpg";
import img2006 from "../../../projects/schmidt-historie/assets/2006.jpg";
import img2022 from "../../../projects/schmidt-historie/assets/2022.jpg";
import img2023 from "../../../projects/schmidt-historie/assets/2023.jpg";

// 15 s @ 30 fps: intro 0–1 s, six milestones à 2 s, logo outro 13–15 s.
export const HISTORIE_FPS = 30;
export const HISTORIE_DURATION = 450;
const INTRO = 30;
const STEP = 60;
const OUTRO_START = INTRO + STEP * 6;

type Milestone = {
  year: number;
  photo: string;
  text: string;
  /** Optional counter: text contains "{n}", which counts up to this value */
  count?: number;
};

const milestones: Milestone[] = [
  {
    year: 1950,
    photo: img1950,
    text: "Arthur Schmidt gründet seine Tischlerei in Delbrück-Boke.",
  },
  {
    year: 1976,
    photo: img1976,
    text: "Konzentration auf die Fertigung von Hebeschiebetüren.",
  },
  {
    year: 1996,
    photo: img1996,
    text: "Maria Schmidt und Günter Kordsmeier übernehmen die Leitung.",
  },
  {
    year: 2006,
    photo: img2006,
    text: "{n} Hebeschiebetüren gefertigt.",
    count: 10000,
  },
  {
    year: 2022,
    photo: img2022,
    text: "{n} Hebeschiebetüren verlassen das Werk.",
    count: 30000,
  },
  {
    year: 2023,
    photo: img2023,
    text: "Neues Verwaltungsgebäude mit Showroom.",
  },
];

const staticLogo = staticFile("brand/logo-schmidt-negative.svg");
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const fmt = (n: number) => Math.round(n).toLocaleString("de-DE");

const FRAME_OFFSET = 36;

// One composition, two layouts: 16:9 side by side, 9:16 stacked.
const landscape = {
  photo: { left: 200, top: 170, size: 620 },
  text: { left: 960, top: 290, width: 780 },
  year: 220,
  body: 50,
  timeline: { x0: 200, x1: 1720, y: 930, label: 30 },
  introLogo: 820,
  outroLogo: 1100,
  claim: { size: 46, width: 1500 },
};
const portrait = {
  photo: { left: 142, top: 260, size: 760 },
  text: { left: 142, top: 1130, width: 800 },
  year: 210,
  body: 52,
  timeline: { x0: 160, x1: 920, y: 1700, label: 30 },
  introLogo: 900,
  outroLogo: 940,
  claim: { size: 54, width: 760 },
};
const useLayout = () => {
  const { width, height } = useVideoConfig();
  return height > width ? portrait : landscape;
};

const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const inP = interpolate(frame, [0, 18], [0, 1], {
    ...clamp,
    easing: ease.reveal,
  });
  const outP = interpolate(frame, [18, 30], [0, 1], {
    ...clamp,
    easing: ease.move,
  });
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        gap: 28,
        opacity: 1 - outP,
        transform: `translateX(${-outP * 160}px)`,
      }}
    >
      <Img
        src={staticLogo}
        style={{
          width: L.introLogo,
          opacity: inP,
          transform: `translateY(${(1 - inP) * 30}px)`,
        }}
      />
      <div
        style={{
          color: colors.white,
          fontSize: 64,
          fontWeight: 700,
          opacity: inP,
          transform: `translateY(${(1 - inP) * 50}px)`,
        }}
      >
        Historie
      </div>
    </AbsoluteFill>
  );
};

const MilestoneScene: React.FC<{ m: Milestone; prevYear: number }> = ({
  m,
  prevYear,
}) => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const PHOTO = L.photo;

  // Lift-and-slide motion: panes glide in from the right, out to the left.
  const enter = interpolate(frame, [0, 18], [0, 1], {
    ...clamp,
    easing: ease.reveal,
  });
  const exit = interpolate(frame, [STEP - 12, STEP + 6], [0, 1], {
    ...clamp,
    easing: ease.move,
  });
  const slide = (1 - enter) * 220 - exit * 220;
  const alpha = enter * (1 - exit);

  // Red frame trails the photo, then draws itself.
  const frameDraw = interpolate(frame, [6, 26], [0, 1], {
    ...clamp,
    easing: ease.reveal,
  });
  const year = interpolate(frame, [0, 22], [prevYear, m.year], {
    ...clamp,
    easing: ease.reveal,
  });
  const textIn = interpolate(frame, [10, 28], [0, 1], {
    ...clamp,
    easing: ease.reveal,
  });
  const counter = m.count
    ? interpolate(frame, [8, 40], [m.count * 0.5, m.count], {
        ...clamp,
        easing: ease.reveal,
      })
    : 0;
  // Slow drift keeps the photo alive while it is held.
  const zoom = interpolate(frame, [0, STEP], [1.08, 1.0], {
    ...clamp,
    easing: ease.loop,
  });

  const [before, after] = m.text.split("{n}");

  return (
    <AbsoluteFill style={{ opacity: alpha }}>
      <div
        style={{
          position: "absolute",
          left: PHOTO.left + FRAME_OFFSET,
          top: PHOTO.top + FRAME_OFFSET,
          width: PHOTO.size,
          height: PHOTO.size,
          border: `8px solid ${colors.red}`,
          boxSizing: "border-box",
          transform: `translateX(${slide * 0.6}px)`,
          clipPath: `inset(0 ${(1 - frameDraw) * 100}% 0 0)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: PHOTO.left,
          top: PHOTO.top,
          width: PHOTO.size,
          height: PHOTO.size,
          overflow: "hidden",
          transform: `translateX(${slide}px)`,
        }}
      >
        <Img
          src={m.photo}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${zoom})`,
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: L.text.left,
          top: L.text.top,
          width: L.text.width,
          transform: `translateX(${slide * 0.4}px)`,
        }}
      >
        <div
          style={{
            color: colors.white,
            fontSize: L.year,
            fontWeight: 700,
            lineHeight: 1,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {Math.round(year)}
        </div>
        <div
          style={{
            marginTop: 36,
            color: colors.white,
            fontSize: L.body,
            fontWeight: 500,
            lineHeight: 1.3,
            opacity: textIn,
            transform: `translateY(${(1 - textIn) * 30}px)`,
          }}
        >
          {m.count ? (
            <>
              {before}
              <span
                style={{ fontWeight: 700, fontVariantNumeric: "tabular-nums" }}
              >
                {fmt(counter)}
              </span>
              {after}
            </>
          ) : (
            m.text
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Bottom timeline: six stations, white rule, progress line grows station by station.
const Timeline: React.FC = () => {
  const frame = useCurrentFrame();
  const { x0, x1, y, label } = useLayout().timeline;
  const gap = (x1 - x0) / (milestones.length - 1);
  const shown = interpolate(frame, [INTRO - 10, INTRO + 10], [0, 1], {
    ...clamp,
    easing: ease.reveal,
  });
  const hide = interpolate(frame, [OUTRO_START - 10, OUTRO_START + 8], [0, 1], {
    ...clamp,
    easing: ease.move,
  });
  const progress = interpolate(
    frame,
    milestones.flatMap((_, i) => [INTRO + i * STEP, INTRO + i * STEP + 18]),
    milestones.flatMap((_, i) => [Math.max(i - 1, 0), i]),
    { ...clamp, easing: ease.reveal },
  );

  return (
    <AbsoluteFill style={{ opacity: shown * (1 - hide) }}>
      <div
        style={{
          position: "absolute",
          left: x0,
          top: y,
          width: (x1 - x0) * shown,
          height: 2,
          background: "rgba(255,255,255,.28)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: x0,
          top: y - 1,
          width: progress * gap,
          height: 4,
          background: colors.white,
        }}
      />
      {milestones.map((m, i) => {
        const active = interpolate(progress, [i - 0.6, i], [0, 1], clamp);
        return (
          <div key={m.year}>
            <div
              style={{
                position: "absolute",
                left: x0 + i * gap - 9,
                top: y - 8,
                width: 18,
                height: 18,
                background: active > 0.5 ? colors.white : colors.blue,
                border: `3px solid ${colors.white}`,
                boxSizing: "border-box",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: x0 + i * gap - 100,
                width: 200,
                top: y + 26,
                textAlign: "center",
                color: colors.white,
                fontSize: label,
                fontWeight: 500,
                opacity: 0.45 + 0.55 * active,
              }}
            >
              {m.year}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const frameIn = interpolate(frame, [0, 20], [0, 1], {
    ...clamp,
    easing: ease.reveal,
  });
  const logoIn = interpolate(frame, [6, 26], [0, 1], {
    ...clamp,
    easing: ease.pop,
  });
  const claimIn = interpolate(frame, [16, 36], [0, 1], {
    ...clamp,
    easing: ease.reveal,
  });
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          inset: 64,
          border: `8px solid ${colors.red}`,
          clipPath: `inset(0 ${(1 - frameIn) * 100}% 0 0)`,
        }}
      />
      <AbsoluteFill
        style={{ justifyContent: "center", alignItems: "center", gap: 0 }}
      >
        <Img
          src={staticLogo}
          style={{
            width: L.outroLogo,
            opacity: Math.min(logoIn, 1),
            transform: `scale(${0.9 + 0.1 * logoIn})`,
          }}
        />
        <div
          style={{
            color: colors.white,
            fontSize: L.claim.size,
            maxWidth: L.claim.width,
            textAlign: "center",
            lineHeight: 1.3,
            fontWeight: 500,
            opacity: claimIn,
            transform: `translateY(${(1 - claimIn) * 24}px)`,
          }}
        >
          Marktführer für Kunststoff-Hebeschiebetüren in Europa
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const SchmidtHistorie: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: colors.blue, fontFamily }}>
      <Sequence durationInFrames={INTRO} name="Intro">
        <Intro />
      </Sequence>
      {milestones.map((m, i) => (
        <Sequence
          key={m.year}
          from={INTRO + i * STEP}
          durationInFrames={STEP + 6}
          name={String(m.year)}
        >
          <MilestoneScene
            m={m}
            prevYear={i === 0 ? m.year : milestones[i - 1].year}
          />
        </Sequence>
      ))}
      <Timeline />
      <Sequence from={OUTRO_START} name="Outro">
        <Outro />
      </Sequence>
    </AbsoluteFill>
  );
};
