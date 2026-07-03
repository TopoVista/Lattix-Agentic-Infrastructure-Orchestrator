import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { RepositoryDetail } from "./repository-detail";
import { dashboard } from "@/lib/mock-data";

vi.mock("@monaco-editor/react", () => ({
  default: ({ value, onChange }: { value?: string; onChange?: (value: string) => void }) => (
    <textarea
      data-testid="monaco-editor"
      value={value ?? ""}
      onChange={(event) => onChange?.(event.target.value)}
    />
  )
}));

describe("RepositoryDetail", () => {
  it("renders the editor workspace with analysis panels", async () => {
    render(<RepositoryDetail dashboard={dashboard} view="editor" />);

    expect(screen.getByText("Editor")).toBeInTheDocument();
    expect(await screen.findByText("Code editor")).toBeInTheDocument();
    expect(screen.getByText("Symbol search")).toBeInTheDocument();
    expect(screen.getByText("Parse tree")).toBeInTheDocument();
  });
});
