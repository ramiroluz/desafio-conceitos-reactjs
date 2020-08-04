import React from "react";
import { render, fireEvent, act } from "@testing-library/react";
import MockAdapter from "axios-mock-adapter";
import api from "../services/api";

const apiMock = new MockAdapter(api);

import App from "../App";

const wait = (amount = 0) => {
  return new Promise((resolve) => setTimeout(resolve, amount));
};

const actWait = async (amount = 0) => {
  await act(async () => {
    await wait(amount);
  });
};

describe("App component", () => {
  it("should be able to list repositories", async () => {
    const { getByText, getByTestId } = render(<App />);

    apiMock.onGet("repositories").reply(200, [
      {
        id: "123",
        url: "https://github.com/josepholiveira",
        title: "josepholiveira",
        techs: ["React", "Node.js"],
      },
      {
        id: "234",
        url: "https://github.com/josesimpsons",
        title: "josesimpsons",
        techs: ["React", "Node.js"],
      },
      {
        id: "345",
        url: "https://github.com/zesimpsons",
        title: "zesimpsons",
        techs: ["React", "Node.js"],
      },
      {
        id: "456",
        url: "https://github.com/marietasimpsons",
        title: "marietasimpsons",
        techs: ["React", "Node.js"],
      }
    ]);

    await actWait();

    expect(getByTestId("repository-list").textContent).toContain("josepholiveira");

    expect(getByTestId("repository-list").textContent).toContain("josesimpsons");

    expect(getByTestId("repository-list").textContent).toContain("zesimpsons");
    
    expect(getByTestId("repository-list").textContent).toContain("marietasimpsons");
  });

  it("should be able to add new repository", async () => {
    const { getByText, getByTestId } = render(<App />);

    apiMock.onGet("repositories").reply(200, []);

    apiMock.onPost("repositories").reply(200, {
      id: "123",
      url: "https://github.com/josepholiveira",
      title: "Desafio ReactJS",
      techs: ["React", "Node.js"],
    });

    await actWait();

    fireEvent.click(getByText("Adicionar"));

    await actWait();

    expect(getByTestId("repository-list")).toContainElement(
      getByText("Desafio ReactJS")
    );
  });

  it("should be able to remove repository", async () => {
    const { getByText, getByTestId } = render(<App />);

    apiMock.onGet("repositories").reply(200, [
      {
        id: "123",
        url: "https://github.com/josepholiveira",
        title: "Desafio ReactJS",
        techs: ["React", "Node.js"],
      },
    ]);

    apiMock.onDelete("repositories/123").reply(204);

    await actWait();

    fireEvent.click(getByText("Remover"));

    await actWait();

    // Warning: toBeEmpty has been deprecated and will be removed in future updates.
    // Please use instead toBeEmptyDOMElement for finding empty nodes in the DOM.
    // expect(getByTestId("repository-list")).toBeEmpty();
    expect(getByTestId("repository-list")).toBeEmptyDOMElement();
  });
});
