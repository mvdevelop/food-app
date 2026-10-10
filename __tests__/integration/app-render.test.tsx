import React from "react";
import { render } from "@testing-library/react-native";
import Index from "@/app/index";
import { offers } from "@/constants";

describe("App — Render Integration", () => {
  beforeEach(() => {
    // Clear mock console to ensure no errors/warnings leaked
    jest.clearAllMocks();
  });

  it("renders the home screen without crashing", () => {
    const { toJSON } = render(<Index />);
    expect(toJSON()).toBeTruthy();
  });

  it("renders the correct number of offer cards", () => {
    const { getAllByText } = render(<Index />);
    const titles = getAllByText(/SUMMER COMBO|BURGER BASH|PIZZA PARTY|BURRITO DELIGHT/);
    expect(titles).toHaveLength(offers.length);
  });

  it("renders offer titles correctly", () => {
    const { getByText } = render(<Index />);
    offers.forEach((offer) => {
      expect(getByText(offer.title)).toBeTruthy();
    });
  });

  // Security: Ensure no runtime exceptions or unhandled promise rejections
  it("does not produce console errors during render", () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    render(<Index />);
    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
