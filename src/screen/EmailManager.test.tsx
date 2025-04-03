import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import EmailManager from "./EmailManager";

describe("EmailManager Component", () => {
  beforeEach(() => {
    render(<EmailManager />);
  });

  test("renders available recipients and selected recipients sections", () => {
    expect(screen.getByText("Available Recipients")).toBeInTheDocument();
    expect(screen.getByText("Selected Recipients")).toBeInTheDocument();
  });

  test("renders all initial recipients", () => {
    fireEvent.click(screen.getByText('qwerty.com'));
    expect(screen.getByText("brian@qwerty.com")).toBeInTheDocument();
    expect(screen.getByText("abc@gmail.com")).toBeInTheDocument();
  });

  test("filters recipients based on search input", () => {
    const searchInput = screen.getByPlaceholderText("Search or enter email");
    
    fireEvent.change(searchInput, { target: { value: "qwerty" } });
    fireEvent.click(screen.getByText('qwerty.com'));
    expect(screen.getByText("brian@qwerty.com")).toBeInTheDocument();
    expect(screen.getByText("james@qwerty.com")).toBeInTheDocument();
    expect(screen.getByText("kate@qwerty.com")).toBeInTheDocument();
    expect(screen.queryByText("abc@gmail.com")).not.toBeInTheDocument();
  });

  test("allows adding a new valid email", () => {
    const searchInput = screen.getByPlaceholderText("Search or enter email");
    fireEvent.change(searchInput, { target: { value: "test@example.com" } });
    const addButton = screen.getByText('Add test@example.com');
    fireEvent.click(addButton);

    expect(screen.getByText("test@example.com")).toBeInTheDocument();
  });

  test("does not add invalid email", () => {
    const searchInput = screen.getByPlaceholderText("Search or enter email");
    fireEvent.change(searchInput, { target: { value: "invalid-email" } });

    expect(screen.queryByText("invalid-email")).not.toBeInTheDocument();
  });

  test("allows selecting and deselecting an individual email", () => {
    const checkbox = screen.getByTestId("checkbox-jane@awesome.com");

    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  test("selects and deselects an entire domain", () => {
    const domainCheckbox = screen.getByTestId('checkbox-qwerty.com');

    fireEvent.click(domainCheckbox);
    expect(screen.getByTestId("checkbox-brian@qwerty.com")).toBeChecked();
    expect(screen.getByTestId("checkbox-james@qwerty.com")).toBeChecked();
    expect(screen.getByTestId("checkbox-kate@qwerty.com")).toBeChecked();

    fireEvent.click(domainCheckbox);
    expect(screen.getByTestId("checkbox-brian@qwerty.com")).not.toBeChecked();
    expect(screen.getByTestId("checkbox-james@qwerty.com")).not.toBeChecked();
    expect(screen.getByTestId("checkbox-kate@qwerty.com")).not.toBeChecked();
  });

  test("removes all emails from a selected domain", () => {
    const domainCheckbox = screen.getByTestId("checkbox-qwerty.com");
    fireEvent.click(domainCheckbox);
    
    fireEvent.click(screen.getByTestId('company-recipients-collapse'));
    const removeAllButton = screen.getByText("Remove All");
    fireEvent.click(removeAllButton);

    expect(screen.getByTestId("checkbox-qwerty.com")).not.toBeChecked();
  });

  test("removes an individual selected email", () => {
    const checkbox = screen.getByTestId("checkbox-jane@awesome.com");
    fireEvent.click(checkbox);

    fireEvent.click(screen.getByTestId('email-recipients-collapse'));
    const removeButton = screen.getAllByText("jane@awesome.com")[1].closest("div")?.querySelector("button");
    if(removeButton){
      fireEvent.click(removeButton);
    }

    expect(checkbox).not.toBeChecked();
  });

  test("does not show expandable list for single email domains", () => {
    expect(screen.getByText("abc@gmail.com")).toBeInTheDocument();
    expect(screen.queryByText("gmail.com")).not.toBeInTheDocument();
  });

});
