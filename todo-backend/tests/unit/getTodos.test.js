const todoService = require("../../services/todoService");
const todoRepository = require("../../repositories/todoRepository");

jest.mock("../../repositories/todoRepository");

beforeEach(() => {
  jest.clearAllMocks();
});

test("doit retourner toutes les tâches", async () => {
  const todos = [
    {
      id: "507f1f77bcf86cd799439011",
      title: "Apprendre React",
      completed: false,
    },
  ];

  todoRepository.getTodos.mockResolvedValue(todos);

  const result = await todoService.getTodos();

  expect(result).toEqual(todos);
});