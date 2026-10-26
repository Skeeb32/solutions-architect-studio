// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Decisions,
  Technologies,
  Roadmap,
  Governance,
  readReview,
} from "./Workspace";
import { controls } from "./data";
afterEach(cleanup);
beforeEach(() => localStorage.clear());
describe("Architecture workspace", () => {
  it("combines decision text and status filters and shows an empty state", async () => {
    const user = userEvent.setup();
    render(<Decisions />);
    await user.type(screen.getByLabelText("Search decisions"), "storage");
    expect(
      screen.getByText("Choose storage by consistency needs"),
    ).toBeTruthy();
    expect(screen.queryByText("Contract-first API integration")).toBeNull();
    await user.selectOptions(
      screen.getByLabelText("Decision status"),
      "Proposed",
    );
    expect(screen.getByRole("status").textContent).toContain("No decisions");
  });
  it("filters the technology portfolio by domain", async () => {
    render(<Technologies />);
    await userEvent.selectOptions(
      screen.getByLabelText("Technology category"),
      "Data",
    );
    expect(screen.getByText("MySQL")).toBeTruthy();
    expect(screen.queryByText("Java")).toBeNull();
  });
  it("intersects roadmap phase, priority and domain", async () => {
    render(<Roadmap />);
    await userEvent.selectOptions(
      screen.getByLabelText("Roadmap phase"),
      "Modernize",
    );
    await userEvent.selectOptions(
      screen.getByLabelText("Roadmap priority"),
      "High",
    );
    await userEvent.selectOptions(
      screen.getByLabelText("Roadmap domain"),
      "Integration",
    );
    expect(screen.getByText("Introduce the API boundary")).toBeTruthy();
    expect(screen.queryByText("Automate release assurance")).toBeNull();
  });
  it("persists review status across remounts", async () => {
    const view = render(<Governance />);
    await userEvent.selectOptions(
      screen.getByLabelText(controls[0]),
      "Compliant",
    );
    expect(screen.getByText("1 / 12 controls marked compliant")).toBeTruthy();
    view.unmount();
    render(<Governance />);
    expect(
      (screen.getByLabelText(controls[0]) as HTMLSelectElement).value,
    ).toBe("Compliant");
  });
  it("recovers from corrupt or unrecognized saved data", () => {
    localStorage.setItem("studio-review-v1", "not json");
    expect(readReview()).toEqual({});
    localStorage.setItem(
      "studio-review-v1",
      JSON.stringify({ [controls[0]]: "Invented", unknown: "Compliant" }),
    );
    expect(readReview()).toEqual({});
  });
});
