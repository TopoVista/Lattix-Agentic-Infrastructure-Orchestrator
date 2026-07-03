import { describe, expect, it } from "vitest";
import { LattixApiClient } from "./api";
import { dashboard } from "./mock-data";

describe("LattixApiClient", () => {
  it("returns workspace fixtures without a backend base url", async () => {
    const client = new LattixApiClient({ baseUrl: "" });

    await expect(client.fetchWorkspaceDashboard("ws-lattix")).resolves.toEqual(dashboard);
    await expect(client.listRepositories()).resolves.toHaveLength(2);
  });
});
