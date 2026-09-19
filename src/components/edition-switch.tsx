"use client";

import { useId, useRef } from "react";
import { useEdition, type Edition } from "@/components/edition-provider";

const OPTIONS: { value: Edition; label: string; wideLabel: string; description: string }[] = [
  { value: "full", label: "Bulwark", wideLabel: "Bulwark, as a container", description: "The Node.js service with admin console and plugins" },
  { value: "lite", label: "Lite", wideLabel: "Lite, as static files", description: "The same client as static files, no server process" },
];

type EditionSwitchProps = {
  /** The wider form with full labels, used in the install section and the phone menu. */
  wide?: boolean;
  className?: string;
};

/**
 * "Bulwark | Lite" segmented control. A real radio group: arrow keys move
 * between the options, Space/Enter select, and the selected option is
 * announced. The visual state is driven by CSS from data-edition on <html>,
 * so it is right before hydration; aria-checked catches up after mount.
 */
export function EditionSwitch({ wide = false, className }: EditionSwitchProps) {
  const { edition, setEdition } = useEdition();
  const labelId = useId();
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (value: Edition, index: number) => {
    setEdition(value);
    buttons.current[index]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent, index: number) => {
    let next: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % OPTIONS.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index - 1 + OPTIONS.length) % OPTIONS.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = OPTIONS.length - 1;
    if (next === null) return;
    event.preventDefault();
    select(OPTIONS[next].value, next);
  };

  return (
    <div className={className}>
      <span id={labelId} className="sr-only">
        Edition
      </span>
      <div role="radiogroup" aria-labelledby={labelId} className={wide ? "bw-switch bw-switch-wide" : "bw-switch"}>
        {OPTIONS.map((option, index) => {
          const checked = edition === option.value;
          return (
            <button
              key={option.value}
              ref={(el) => {
                buttons.current[index] = el;
              }}
              type="button"
              role="radio"
              aria-checked={checked}
              aria-label={`${option.label} edition`}
              title={option.description}
              tabIndex={checked ? 0 : -1}
              data-value={option.value}
              className="bw-switch-option"
              onClick={() => select(option.value, index)}
              onKeyDown={(event) => onKeyDown(event, index)}
            >
              {wide ? option.wideLabel : option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
