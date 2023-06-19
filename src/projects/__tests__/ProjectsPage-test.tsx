import React from "react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../../state";
import ProjectsPage from "../ProjectsPage";
import { render, screen } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { url as projectsUrl } from "../projectAPI";
import { MOCK_PROJECTS } from "../MockProjects";
import userEvent from "@testing-library/user-event";
// declare which API requests to mock
const server = setupServer(
  // capture "GET http://localhost:3000/projects" requests
  rest.get(projectsUrl, (req, res, ctx) => {
    // respond using a mocked JSON body
    return res(ctx.json(MOCK_PROJECTS));
  })
);

describe("<ProjectsPage />", () => {
  function renderComponent() {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ProjectsPage />
        </MemoryRouter>
      </Provider>
    );
  }

  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  test("should render without crashing", () => {
    renderComponent();
    expect(screen).toBeDefined();
  });

  test("should display more", () => {
    renderComponent();
    expect(screen.getByText(/More.../i)).toBeInTheDocument();
  });

  test("should display projects", async () => {
    renderComponent();
    // eslint-disable-next-line testing-library/render-result-naming-convention
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /more/i }));
    expect(await screen.findAllByRole("img")).toHaveLength(
      MOCK_PROJECTS.length
    );
  });

  test("should display more button", async () => {
    renderComponent();
    expect(
      await screen.findByRole("button", { name: /more/i })
    ).toBeInTheDocument();
  });

  // this tests the same as the last test but demonstrates
  // what find* methods are doing
  test("should display more button with get", async () => {
    renderComponent();
    expect(screen.getByRole("button", { name: /more/i })).toBeInTheDocument();
  });
});
