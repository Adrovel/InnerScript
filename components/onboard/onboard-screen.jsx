"use client";

import { animate } from "animejs/animation";
import { stagger } from "animejs/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { OnboardChoices } from "./onboard-choices";
import { OnboardFrame } from "./onboard-frame";
import { OnboardIntroduction } from "./onboard-introduction";
import { OnboardVersionNav } from "./onboard-version-nav";
import { PatternBackground } from "./pattern-background";
import { preloadMaskedCardAssets } from "./pattern-assets";
import { useLiquidGlass } from "./use-liquid-glass";

/** V1 — Pattern Background (falling cubes + liquidGL glass cards) */
export function OnboardScreenV1() {
  const [fieldReady, setFieldReady] = useState(false);
  const [glassReady, setGlassReady] = useState(false);

  // Page stays invisible until cubes + liquid glass both finish
  const ready = fieldReady && glassReady;

  const handleFieldReady = useCallback(() => {
    setFieldReady(true);
  }, []);

  const handleGlassReady = useCallback(() => {
    setGlassReady(true);
  }, []);

  // Start glass only after cube field is ready (snapshot target has a painted frame)
  useLiquidGlass({
    enabled: fieldReady,
    onReady: handleGlassReady,
  });

  return (
    <div
      className={cn(
        "flex min-h-dvh w-full flex-1 flex-col transition-opacity duration-300 ease-out",
        ready ? "opacity-100" : "opacity-0",
      )}
      aria-busy={!ready}
      aria-hidden={!ready}
    >
      <PatternBackground onFieldReady={handleFieldReady}>
        <OnboardFrame>
          <OnboardChoices />
        </OnboardFrame>
      </PatternBackground>
      <OnboardVersionNav current="v1" />
    </div>
  );
}

/** V2 — Masked Cards (vectors on cards) */
export function OnboardScreenV2({ className }) {
  const [name, setName] = useState("");
  const [continueRequested, setContinueRequested] = useState(false);
  const [cardsReady, setCardsReady] = useState(false);
  const [phase, setPhase] = useState("introduction");
  const phaseRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    preloadMaskedCardAssets().then(() => {
      if (!cancelled) setCardsReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!continueRequested || !cardsReady || phase !== "introduction") {
      return undefined;
    }

    const phaseElement = phaseRef.current;
    if (!phaseElement) return undefined;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const transitionTimer = window.setTimeout(() => {
        setPhase("choices");
      }, 0);

      return () => window.clearTimeout(transitionTimer);
    }

    const exitAnimation = animate(phaseElement, {
      opacity: [1, 0],
      y: [0, -12],
      scale: [1, 0.99],
      duration: 280,
      ease: "in(2)",
      onComplete: () => setPhase("choices"),
    });

    return () => exitAnimation.revert();
  }, [cardsReady, continueRequested, phase]);

  useEffect(() => {
    if (phase !== "choices") return undefined;

    const phaseElement = phaseRef.current;
    if (!phaseElement) return undefined;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      phaseElement.style.opacity = "1";
      return undefined;
    }

    const enterAnimation = animate(phaseElement, {
      opacity: [0, 1],
      y: [14, 0],
      scale: [0.99, 1],
      duration: 460,
      ease: "out(4)",
    });
    const cardsAnimation = animate(
      phaseElement.querySelectorAll("[data-onboard-choice-card]"),
      {
        y: [12, 0],
        scale: [0.985, 1],
        delay: stagger(55),
        duration: 460,
        ease: "out(4)",
      },
    );

    return () => {
      enterAnimation.revert();
      cardsAnimation.revert();
    };
  }, [phase]);

  const showChoices = phase === "choices";

  function handleContinue(event) {
    event.preventDefault();

    if (name.trim().length === 0) return;

    setContinueRequested(true);
  }

  return (
    <div
      className={cn("flex min-h-dvh w-full flex-1 flex-col", className)}
      aria-busy={continueRequested && !showChoices}
    >
      <div className="relative flex min-h-dvh w-full flex-1 flex-col overflow-hidden">
        {showChoices ? (
          <div ref={phaseRef} className="flex min-h-dvh w-full flex-1 opacity-0">
            <OnboardFrame centerPrimary>
              <OnboardChoices masked />
            </OnboardFrame>
          </div>
        ) : (
          <div ref={phaseRef} className="flex min-h-dvh w-full flex-1">
            <OnboardIntroduction
              name={name}
              onNameChange={setName}
              onContinue={handleContinue}
            />
          </div>
        )}
      </div>
      {showChoices ? <OnboardVersionNav current="v2" /> : null}
    </div>
  );
}

// Back-compat alias
export function OnboardScreen() {
  return <OnboardScreenV1 />;
}
