import { describe, it, expect } from "vitest";
import {
  fadeInUp,
  fadeIn,
  slideUp,
  staggerContainer,
  staggerItem,
  scaleIn,
  lineReveal,
  reducedMotionTransition,
} from "./motion-variants";

describe("motion-variants", () => {
  describe("fadeInUp", () => {
    it("starts hidden with opacity 0 and y offset", () => {
      expect(fadeInUp.hidden).toEqual({ opacity: 0, y: 30 });
    });

    it("animates to visible with opacity 1 and y 0", () => {
      expect(fadeInUp.visible).toMatchObject({ opacity: 1, y: 0 });
    });
  });

  describe("fadeIn", () => {
    it("starts hidden with opacity 0", () => {
      expect(fadeIn.hidden).toEqual({ opacity: 0 });
    });

    it("animates to visible with opacity 1", () => {
      expect(fadeIn.visible).toMatchObject({ opacity: 1 });
    });
  });

  describe("slideUp", () => {
    it("has larger y offset than fadeInUp", () => {
      const hidden = slideUp.hidden as { y: number };
      const fadeHidden = fadeInUp.hidden as { y: number };
      expect(hidden.y).toBeGreaterThan(fadeHidden.y);
    });
  });

  describe("staggerContainer", () => {
    it("has empty hidden state", () => {
      expect(staggerContainer.hidden).toEqual({});
    });

    it("has staggerChildren in visible transition", () => {
      const visible = staggerContainer.visible as { transition: { staggerChildren: number } };
      expect(visible.transition.staggerChildren).toBe(0.1);
    });
  });

  describe("staggerItem", () => {
    it("starts hidden with opacity 0 and y offset", () => {
      expect(staggerItem.hidden).toEqual({ opacity: 0, y: 20 });
    });

    it("animates to visible", () => {
      expect(staggerItem.visible).toMatchObject({ opacity: 1, y: 0 });
    });
  });

  describe("scaleIn", () => {
    it("starts at reduced scale", () => {
      const hidden = scaleIn.hidden as { scale: number };
      expect(hidden.scale).toBeLessThan(1);
    });

    it("animates to full scale", () => {
      expect(scaleIn.visible).toMatchObject({ scale: 1 });
    });
  });

  describe("lineReveal", () => {
    it("starts with scaleX 0", () => {
      expect(lineReveal.hidden).toEqual({ scaleX: 0 });
    });

    it("animates to scaleX 1", () => {
      expect(lineReveal.visible).toMatchObject({ scaleX: 1 });
    });
  });

  describe("reducedMotionTransition", () => {
    it("has zero duration for instant resolution", () => {
      expect(reducedMotionTransition.duration).toBe(0);
    });

    it("uses linear easing", () => {
      expect(reducedMotionTransition.ease).toBe("linear");
    });
  });

  describe("all variants have consistent structure", () => {
    const allVariants = [fadeInUp, fadeIn, slideUp, staggerItem, scaleIn, lineReveal];

    allVariants.forEach((variant, idx) => {
      it(`variant ${idx} has hidden and visible keys`, () => {
        expect(variant).toHaveProperty("hidden");
        expect(variant).toHaveProperty("visible");
      });
    });
  });
});
