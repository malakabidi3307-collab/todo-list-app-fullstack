const { test, expect } = require("@playwright/test");

test.describe("Tests E2E de la Todo List", () => {
  test("L'utilisateur peut consulter, ajouter et supprimer une tâche", async ({
    page
  }) => {
    // Ouvrir la page Todo
    await page.goto("http://localhost:3000/todo");

    // Vérifier que le titre est visible
    await expect(
      page.getByRole("heading", { name: "Ma Todo List" })
    ).toBeVisible();

    // Attendre que le chargement soit terminé
    await expect(
      page.getByText("Chargement...")
    ).not.toBeVisible({
      timeout: 10000
    });

    // Vérifier qu'au moins une tâche est affichée
    const todoItems = page.locator("li");

    await expect(todoItems.first()).toBeVisible({
      timeout: 10000
    });

    // Attendre 5 secondes pour observer Chrome
    await page.waitForTimeout(5000);

    // Créer une tâche avec un titre unique
    const title = `Tâche Playwright ${Date.now()}`;

    const input = page.getByPlaceholder("Nouvelle tâche");

    await input.fill(title);

    await page.getByRole("button", { name: "Ajouter" }).click();

    // Vérifier que la nouvelle tâche apparaît
    await expect(
      page.getByText(title, { exact: true })
    ).toBeVisible({
      timeout: 10000
    });

    // Récupérer le li qui contient la nouvelle tâche
    const todoItem = page
      .locator("li")
      .filter({ hasText: title });

    // Vérifier que le bouton Supprimer existe
    await expect(
      todoItem.getByRole("button", { name: "Supprimer" })
    ).toBeVisible();

    // Supprimer la tâche créée
    await todoItem
      .getByRole("button", { name: "Supprimer" })
      .click();

    // Vérifier que la tâche a disparu
    await expect(
      page.getByText(title, { exact: true })
    ).not.toBeVisible({
      timeout: 10000
    });

    // Garder Chrome ouvert 5 secondes
    await page.waitForTimeout(5000);
  });
});