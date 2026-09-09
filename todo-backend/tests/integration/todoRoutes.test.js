const request = require("supertest");
const app = require("../../server");
const { connectDB, disconnectDB } = require("../../database/db");
const Todo = require("../../models/todoModel");

beforeAll(async () => {
  await connectDB();
});

afterEach(async () => {
  await Todo.deleteMany({});
});

afterAll(async () => {
  await disconnectDB();
});

describe("Tests d'intégration des routes Todo", () => {
  test("GET /todos doit retourner toutes les tâches", async () => {
    const response = await request(app)
      .get("/todos");

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("GET /todos/:id doit retourner une tâche", async () => {
    const createResponse = await request(app)
      .post("/todos")
      .send({
        title: "Tâche à récupérer",
      });

    const id = createResponse.body.id;

    const response = await request(app)
      .get(`/todos/${id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body.id).toBe(id);
  });

  test("POST /todos doit créer une tâche", async () => {
    const response = await request(app)
      .post("/todos")
      .send({
        title: "Tâche créée par un test",
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.title).toBe("Tâche créée par un test");
    expect(response.body.completed).toBe(false);
  });

  test("PUT /todos/:id doit modifier une tâche", async () => {
    const createResponse = await request(app)
      .post("/todos")
      .send({
        title: "Ancienne tâche",
      });

    const id = createResponse.body.id;

    const response = await request(app)
      .put(`/todos/${id}`)
      .send({
        title: "Tâche modifiée par un test",
        completed: true,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe(id);
    expect(response.body.title).toBe(
      "Tâche modifiée par un test"
    );
    expect(response.body.completed).toBe(true);
  });

  test("DELETE /todos/:id doit supprimer une tâche", async () => {
    const createResponse = await request(app)
      .post("/todos")
      .send({
        title: "Tâche temporaire",
      });

    const createdTodoId = createResponse.body.id;

    const deleteResponse = await request(app)
      .delete(`/todos/${createdTodoId}`);

    expect(deleteResponse.statusCode).toBe(200);
    expect(deleteResponse.body.id).toBe(createdTodoId);

    const getResponse = await request(app)
      .get(`/todos/${createdTodoId}`);

    expect(getResponse.statusCode).toBe(404);
  });
});