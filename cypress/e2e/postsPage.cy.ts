const mockPosts = new Array(11);
for (let i = 0; i < 11; i++) {
  mockPosts[i] = {
    id: i + 1,
    title: `Post ${i + 1}`,
    body: `Body ${i + 1}`,
    userId: 1,
  };
}
/* 
The viewport is set to 1024x768 for a desktop view and 375x667 for a mobile view.
*/

describe("Posts Page E2E Tests", () => {
  beforeEach(() => {
    // Mock API calls
    cy.intercept("GET", "**/posts", {
      statusCode: 200,
      body: mockPosts,
    }).as("fetchPosts");

    cy.intercept("POST", "**/posts", {
      statusCode: 201,
      body: {
        id: 16,
        title: "New Post",
        body: "New Body",
        userId: 1,
      },
    }).as("addPost");
    // Set viewport size to 1024x768 (desktop size)
    cy.viewport(1024, 768);
    cy.visit("/VW-project/");
  });

  it("renders All Posts page correctly", () => {
    cy.get("h1").should("have.text", "All posts");
    cy.get('[data-testid="search-input"]').should("exist");
    cy.get("button").contains("Add Post").should("exist");
    cy.get('[data-testid="table-view"]').should("exist");
    cy.get('[data-testid="table-view"] thead th').should("have.length", 4);
    cy.get('[data-testid="table-view"] tbody tr').should("have.length", 10); // Default pageSize
    cy.get('[data-testid="table-view"] tbody tr')
      .first()
      .find("td")
      .eq(1)
      .should("contain", "Post 1");
  });

  it("renders Favorites page correctly", () => {
    cy.visit("/VW-project/favorites");
    cy.get("h1").should("have.text", "Favorites posts");
    cy.get('[data-testid="table-view"]').should("not.exist"); // No favorites initially
  });

  it("filters posts by search", () => {
    cy.get('[data-testid="search-input"]').type("Post 1");
    cy.get('[data-testid="table-view"] tbody tr').should("have.length", 3); // Post 1, Post 10, Post 11
    cy.get('[data-testid="table-view"] tbody tr')
      .first()
      .find("td")
      .eq(1)
      .should("contain", "Post 1");
    cy.get('[data-testid="search-input"]').clear().type("Nonexistent");
    cy.get('[data-testid="table-view"] tbody tr').should("have.length", 0);
  });

  it("toggles favorite and verifies on Favorites page", () => {
    // Add to favorites
    cy.get('[data-testid="table-view"] tbody tr')
      .first()
      .find('button[aria-label="Add to favorites"]')
      .click();

    cy.get('[data-testid="table-view"] tbody tr')
      .first()
      .find('button[aria-label="Remove from favorites"]')
      .should("contain", "★");
  });

  it("navigates pagination", () => {
    cy.get("button").contains("Next").click();
    cy.get('[data-testid="table-view"] tbody tr')
      .first()
      .find("td")
      .eq(1)
      .should("contain", "Post 11");
    cy.get("button").contains("Previous").click();
    cy.get('[data-testid="table-view"] tbody tr')
      .first()
      .find("td")
      .eq(1)
      .should("contain", "Post 1");
    cy.get("button").contains("Last").click();
    cy.get('[data-testid="table-view"] tbody tr').should("have.length", 1); // Last page: posts 11
    cy.get("button").contains("First").click();
    cy.get('[data-testid="table-view"] tbody tr')
      .first()
      .find("td")
      .eq(1)
      .should("contain", "Post 1");
  });

  it("adds a new post", () => {
    cy.get("button").contains("Add Post").click();
    cy.get('[data-testid="modal"]').should("be.visible");
    cy.get('input[id="title"]').type("New Post");
    cy.get('textarea[id="body"]').type("New Body");
    cy.get("button").contains("Create").click();
    cy.wait("@addPost");
    cy.get('[data-testid="table-view"] tbody tr').should("have.length", 10); // Still 10 due to pagination
    cy.get('[data-testid="table-view"] tbody tr')
      .first()
      .find("td")
      .eq(1)
      .should("contain", "New Post");
  });
});
