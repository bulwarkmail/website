"use client";

import { useId, useRef, useState, type ReactNode } from "react";

type Choice = { id: string; label: string; panel: ReactNode };

/**
 * Two ways to install, as a real tab list: arrow keys move between the tabs,
 * the selected tab owns the panel. It only switches the step list inside the
 * install section and stores nothing.
 */
export function InstallChoice({ choices, label }: { choices: Choice[]; label: string }) {
  const [active, setActive] = useState(0);
  const base = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (index: number) => {
    setActive(index);
    tabs.current[index]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent, index: number) => {
    let next: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % choices.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index - 1 + choices.length) % choices.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = choices.length - 1;
    if (next === null) return;
    event.preventDefault();
    select(next);
  };

  return (
    <div className="bw-choice">
      <div role="tablist" aria-label={label} className="bw-switch bw-switch-wide">
        {choices.map((choice, index) => (
          <button
            key={choice.id}
            ref={(el) => {
              tabs.current[index] = el;
            }}
            type="button"
            role="tab"
            id={`${base}-tab-${choice.id}`}
            aria-selected={active === index}
            aria-controls={`${base}-panel-${choice.id}`}
            tabIndex={active === index ? 0 : -1}
            className="bw-switch-option"
            onClick={() => select(index)}
            onKeyDown={(event) => onKeyDown(event, index)}
          >
            {choice.label}
          </button>
        ))}
      </div>
      {choices.map((choice, index) => (
        <div
          key={choice.id}
          role="tabpanel"
          id={`${base}-panel-${choice.id}`}
          aria-labelledby={`${base}-tab-${choice.id}`}
          hidden={active !== index}
          tabIndex={0}
        >
          {choice.panel}
        </div>
      ))}
    </div>
  );
}
