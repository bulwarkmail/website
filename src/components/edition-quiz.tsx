"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Info } from "@/components/icons";
import { BulwarkMark } from "@/components/bulwark-mark";
import { EditionLink } from "@/components/edition-link";
import { useEdition } from "@/components/edition-provider";
import {
  NONE,
  QUESTIONS,
  evaluate,
  type Answers,
  type Edition,
  type Link,
  type Question,
  type Reason,
  type Verdict,
} from "@/lib/edition-quiz";
import { ICON } from "@/lib/icon";

// =============================================================================
// "Which Bulwark fits you?" - one question per screen, answered with large
// tiles, then a result on the field in the picked edition's colour. The
// questions and the scoring live in @/lib/edition-quiz.
// =============================================================================

export function EditionQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const heading = useRef<HTMLHeadingElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const moved = useRef(false);
  const advance = useRef<number | undefined>(undefined);
  const { setEdition } = useEdition();

  const questions = QUESTIONS;
  const shownTotal = QUESTIONS.length;
  const done = step >= questions.length;
  const verdict = done ? evaluate(answers) : null;

  // Focus the new heading after a step change, so keyboard and screen-reader
  // users land on what just appeared, and keep the top of the quiz in view.
  useEffect(() => {
    if (!moved.current) return;
    heading.current?.focus({ preventScroll: true });
    const top = root.current?.getBoundingClientRect().top ?? 0;
    if (top < 0) root.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  // The site's own switch follows the result, so the result sits in the
  // picked edition's colour and every docs link opens that edition.
  useEffect(() => {
    if (verdict?.pick) setEdition(verdict.pick);
  }, [verdict?.pick, setEdition]);

  useEffect(() => () => window.clearTimeout(advance.current), []);

  const go = (next: number) => {
    window.clearTimeout(advance.current);
    moved.current = true;
    setStep(Math.max(0, next));
  };

  const choose = (q: Question, id: string) => {
    const selected = answers[q.id] ?? [];
    if (!q.multi) {
      setAnswers((a) => ({ ...a, [q.id]: [id] }));
      // A short beat so the pick is seen before the next question slides in.
      window.clearTimeout(advance.current);
      advance.current = window.setTimeout(() => go(step + 1), 220);
      return;
    }
    let next: string[];
    if (id === NONE) next = selected.includes(NONE) ? [] : [NONE];
    else {
      const rest = selected.filter((s) => s !== NONE);
      next = rest.includes(id) ? rest.filter((s) => s !== id) : [...rest, id];
    }
    setAnswers((a) => ({ ...a, [q.id]: next }));
  };

  if (verdict) {
    return (
      <Result
        rootRef={root}
        verdict={verdict}
        headingRef={heading}
        onBack={() => go(questions.length - 1)}
        onRestart={() => {
          setAnswers({});
          go(0);
        }}
      />
    );
  }

  const q = questions[step];
  const selected = answers[q.id] ?? [];

  return (
    <div className="bw-quiz" ref={root}>
      <div className="bw-quiz-top">
        <button type="button" className="bw-quiz-back" onClick={() => go(step - 1)} disabled={step === 0}>
          <ArrowLeft size={16} {...ICON} /> Back
        </button>
        <span className="bw-quiz-count">
          {step + 1} / {shownTotal}
        </span>
        <button type="button" className="bw-quiz-back" onClick={() => go(step + 1)}>
          Skip
        </button>
      </div>
      <div
        className="bw-quiz-bar"
        role="progressbar"
        aria-label="Progress"
        aria-valuemin={0}
        aria-valuemax={shownTotal}
        aria-valuenow={step}
      >
        <i style={{ width: `${(step / shownTotal) * 100}%` }} />
      </div>

      <div key={q.id} className="bw-quiz-step">
        <h2 ref={heading} tabIndex={-1} className="bw-h2" id={`q-${q.id}`}>
          {q.title}
        </h2>
        {q.help ? <p className="bw-quiz-help">{q.help}</p> : null}

        <div className="bw-quiz-tiles" role="group" aria-labelledby={`q-${q.id}`}>
          {q.choices.filter((c) => !c.showIf || c.showIf(answers)).map((c) => {
            const on = selected.includes(c.id);
            return (
              <button
                key={c.id}
                type="button"
                className={c.wide ? "bw-quiz-tile bw-quiz-tile-wide" : "bw-quiz-tile"}
                aria-pressed={on}
                data-on={on ? "true" : undefined}
                onClick={() => choose(q, c.id)}
              >
                <span className="bw-quiz-tick" aria-hidden="true">
                  {on ? <Check size={16} {...ICON} strokeWidth={2.5} /> : null}
                </span>
                <span className="bw-quiz-tile-label">{c.label}</span>
                {c.hint ? <span className="bw-quiz-tile-hint">{c.hint}</span> : null}
              </button>
            );
          })}
        </div>

        {q.multi ? (
          <div className="bw-quiz-next">
            <button type="button" className="bw-btn" onClick={() => go(step + 1)} disabled={selected.length === 0}>
              Continue <ArrowRight size={16} {...ICON} />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------

const BADGE = (r: Reason) =>
  r.badge ??
  (r.must
    ? r.toward === "full"
      ? "Needs Bulwark"
      : "Rules out Bulwark"
    : `Points to ${r.toward === "full" ? "Bulwark" : "Lite"}`);

const LITE_LEAVES_OUT = "Lite leaves out add-ons, the admin page, settings sync, Office editing, notifications and single sign-on.";

function ResultLink({ link, className, edition }: { link: Link; className: string; edition?: Edition | null }) {
  if (/^https?:\/\//.test(link.href)) {
    return (
      <a href={link.href} target="_blank" rel="noopener noreferrer" className={className}>
        {link.label} <ArrowUpRight size={16} {...ICON} />
      </a>
    );
  }
  return (
    <EditionLink href={link.href} edition={edition ?? undefined} className={className}>
      {link.label} <ArrowRight size={16} {...ICON} />
    </EditionLink>
  );
}

type ResultProps = {
  rootRef: React.RefObject<HTMLDivElement | null>;
  verdict: Verdict;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  onBack: () => void;
  onRestart: () => void;
};

function Result({ rootRef, verdict, headingRef, onBack, onRestart }: ResultProps) {
  const { kind, pick, eyebrow, title, pitch, primary, secondary, reasons, options, caveats } = verdict;
  // A result that isn't one edition sits on a neutral panel, not in either
  // edition's colour.
  const neutral = pick === null;
  // The secondary link of a close call is the other edition's docs.
  const secondaryEdition = kind === "lite" ? "full" : kind === "full" ? "lite" : null;

  return (
    <div className="bw-quiz bw-quiz-done" ref={rootRef}>
      <section
        className={neutral ? "bw-quiz-result bw-field bw-quiz-result-neutral" : "bw-quiz-result bw-field"}
        aria-labelledby="quiz-result"
      >
        <div className="bw-quiz-result-main">
          {kind !== "classic" ? <BulwarkMark size={72} color="currentColor" /> : null}
          <span className="bw-quiz-eyebrow">{eyebrow}</span>
          <h2 ref={headingRef} tabIndex={-1} id="quiz-result" className="bw-quiz-name">
            {title}
          </h2>
          <p className="bw-quiz-pitch">{pitch}</p>
          {primary ? (
            <div className="bw-btns">
              <ResultLink link={primary} edition={pick} className="bw-btn" />
              {secondary ? (
                <ResultLink link={secondary} edition={secondaryEdition} className="bw-btn bw-btn-ghost" />
              ) : null}
            </div>
          ) : null}
        </div>

        {reasons.length > 0 ? (
          <div className="bw-quiz-why">
            <span className="bw-quiz-eyebrow">Because you said</span>
            <ul>
              {reasons.map((r) => (
                <li key={r.tag}>
                  <span>{r.tag}</span>
                  <span className="bw-quiz-badge" data-hard={r.must ? "true" : undefined}>
                    {BADGE(r)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      {options.length > 0 ? (
        <div className="bw-quiz-fork">
          {options.map((o) => (
            <div key={o.title}>
              <h3 className="bw-h3">{o.title}</h3>
              <p>{o.text}</p>
              <ResultLink link={o.link} className="bw-tlink" />
            </div>
          ))}
        </div>
      ) : null}

      {caveats.map((c) => (
        <p key={c.text} className="bw-note bw-quiz-note">
          <Info size={16} {...ICON} />
          <span>
            {c.text}{" "}
            {c.link ? (
              /^https?:\/\//.test(c.link.href) ? (
                <a href={c.link.href} target="_blank" rel="noopener noreferrer" className="bw-link">
                  {c.link.label}
                </a>
              ) : (
                <EditionLink href={c.link.href} className="bw-link">
                  {c.link.label}
                </EditionLink>
              )
            ) : null}
          </span>
        </p>
      ))}

      <p className="bw-quiz-fine">
        {kind === "lite" ? `${LITE_LEAVES_OUT} ` : ""}
        {kind === "lite" || kind === "full"
          ? "Your mail stays on your mail server either way, so switching later is easy."
          : null}
      </p>

      <div className="bw-quiz-again">
        <button type="button" className="bw-tlink" onClick={onBack}>
          <ArrowLeft size={16} {...ICON} /> Change answers
        </button>
        <button type="button" className="bw-tlink" onClick={onRestart}>
          Start over
        </button>
        <EditionLink href="/docs/getting-started/editions" className="bw-tlink">
          Compare the two versions
        </EditionLink>
      </div>
    </div>
  );
}
