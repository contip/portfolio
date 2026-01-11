import React from "react";
import type { Page } from "@/types/payload-types";
import HighImpactHero from "./HighImpact";
import MediumImpactHero from "./MediumImpact";
import LowImpactHero from "./LowImpact";

const heroes = {
  highImpact: HighImpactHero,
  mediumImpact: MediumImpactHero,
  lowImpact: LowImpactHero,
};

export const RenderHero: React.FC<Page["hero"]> = (props) => {
  const { type } = props;

  if (!type || type === "none") return null;

  const HeroComponent = heroes[type];

  if (!HeroComponent) return null;

  return <HeroComponent {...props} />;
};

export default RenderHero;
