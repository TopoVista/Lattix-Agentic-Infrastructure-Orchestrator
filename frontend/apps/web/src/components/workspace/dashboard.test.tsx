import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WorkspaceDashboardView } from "./dashboard";

describe("WorkspaceDashboardView", () => {
  it("renders workspace summary and repository cards", () => {
    render(<WorkspaceDashboardView />);

    expect(screen.getByText("Projects")).toBeInTheDocument();
    // Repos come from Zustand store (seeded with mock-data) — may appear multiple times
    expect(screen.getAllByText("lattix-platform").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Notifications").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Terminal").length).toBeGreaterThanOrEqual(1);
  });
});
