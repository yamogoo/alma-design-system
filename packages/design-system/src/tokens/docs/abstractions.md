# Design System Abstractions

This document describes the abstract entities (abstractions) used as an intermediate layer between base colors and component contracts.

## Token Layers

1. **baseColors**  
   Core palette of fundamental colors.

2. **derivativeColors**  
   Derived colors generated from base colors with modifications.  
   Naming format: `<name>-<DL>`, where `DL` is the lightness/tone delta.

3. **abstracts**  
   Abstract entities describing general visual principles (Surface, Label, etc.).

4. **mixins (contracts)**  
   Contracts link abstract tokens with concrete states and scenarios.

5. **componentTokens**  
   Component-specific tokens built on top of contracts.

6. **components**  
   Final application of tokens inside UI components (Vue, React, etc.).

---

## Abstractions

### Surface

Background surfaces.  
Used for fills of blocks, cards, panels, and modal windows.

- **Example:** page background, card background.

---

### OnSurface

Elements layered on top of a Surface.  
Used for text, icons, and indicators placed on backgrounds or interactive elements.

- **Example:** button text color, icon on a card.

---

### Label

Text elements of the interface (labels, captions, main typography).  
Used for forms, titles, descriptions.

- **Example:** form title, caption below an icon.

---

### Stroke

Thin line for interactive elements.  
Used for hover, pressed, or subtle boundaries.

- **Example:** subtle outline around a button in hover state.

---

### Border

Structural border for containers and blocks.  
Used for defining larger element boundaries.

- **Example:** border of a card, section, or table.

---

### Highlight

Accent outline (focus/keyboard navigation).  
Used for accessibility (a11y) and keyboard navigation indicators.

- **Example:** focus ring around a button when navigating with Tab.

---

## Summary

Abstractions act as an intermediate level, ensuring:

- **Consistency** across themes (light/dark).
- **Flexibility** when building contracts.
- **Transparency** in token logic: from `baseColors` → `derivativeColors` → `abstracts` → `contracts` → `componentTokens` → `components`.
