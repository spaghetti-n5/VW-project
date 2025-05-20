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
  });

  it("renders All Posts page correctly", () => {
    cy.visit("/VW-project/");
    // Set viewport size to 1024x768 (desktop size)
    cy.viewport(1024, 768);

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
});
