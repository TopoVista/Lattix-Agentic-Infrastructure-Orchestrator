import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WorkspaceDashboardView } from "./dashboard";
import { dashboard } from "@/lib/mock-data";

describe("WorkspaceDashboardView", () => {
  it("renders workspace summary and repository cards", () => {
    render(<WorkspaceDashboardView dashboard={dashboard} />);

    expect(screen.getByText("Projects")).toBeInTheDocument();
    expect(screen.getByText("lattix-platform")).toBeInTheDocument();
    expect(screen.getAllByText("Notifications").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Terminal policy")).toBeInTheDocument();
  });
});
