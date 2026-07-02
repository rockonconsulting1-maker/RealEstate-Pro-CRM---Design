# RC CRM

A calm, human-centric CRM prototype designed specifically for independent real estate agents. This project showcases a high-fidelity design implementation for both desktop and mobile surfaces, focusing on clarity, ease of use, and first-class dark mode support (as specified in the design brief).

## Overview

RC CRM is built to manage the core records of a real estate business:
- **Leads**: Prospective clients in the nurture funnel.
- **Clients**: Active buyers and sellers under contract.
- **Properties**: Listing data, showings, and property-specific tasks.
- **Offers**: Time-sensitive financial instruments with expiry tracking.

## Project Structure

The project is divided into two primary surfaces:

- **Desktop**: A master-detail oriented interface optimized for large screens and complex workflows.
- **Mobile**: An iPhone-optimized experience for agents on the go, featuring swipe actions and quick-access "Now" ribbons.

### Directory Layout

- `/desktop`: React components and styles for the desktop application.
- `/mobile`: React components and styles for the mobile application.
- `RC CRM Desktop.html`: Entry point for the desktop prototype.
- `RC CRM Mobile.html`: Entry point for the mobile prototype (rendered within an iPhone bezel).
- `RC CRM Auth Desktop.html` & `RC CRM Auth Mobile.html`: Authentication flow prototypes.
- `design.md`: The comprehensive design system and specification.
- `SCREENS.md`: A detailed inventory of all screens, views, and modals.

## Technologies

- **React**: Functional components for UI logic.
- **CSS (OKLCH)**: Modern color space for consistent and accessible UI tones.
- **Lucide-inspired Icons**: A custom set of SVG icons (handled via a global registry).
- **No Build Step**: The prototype runs directly in the browser using browser-native ES modules or script-based React loading (depending on the specific file).

## Getting Started

To view the prototypes, simply open the following files in a modern web browser:

1.  **Desktop**: Open `RC CRM Desktop.html`
2.  **Mobile**: Open `RC CRM Mobile.html`
3.  **Auth (Desktop)**: Open `RC CRM Auth Desktop.html`
4.  **Auth (Mobile)**: Open `RC CRM Auth Mobile.html`

## Documentation

- [Design Specification](design.md)
- [Agent Instructions](AGENTS.md)
- [Screen Inventory](SCREENS.md)
