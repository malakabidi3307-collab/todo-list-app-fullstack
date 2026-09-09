const todoService = require("../../services/todoService");
const todoRepository = require("../../repositories/todoRepository");

jest.mock("../../repositories/todoRepository");

beforeEach(() => {
  jest.clearAllMocks();
});

test("doit retourner une tâche existante", async () => {
  const todo = {
    id: "507f1f77bcf86cd799439011",
    title: "Apprendre React",
    completed: false,
  };

  todoRepository.getTodoById.mockResolvedValue(todo);

  const result = await todoService.getTodoById(
    "507f1f77bcf86cd799439011"
  );

  expect(result).toEqual(todo);
});

test("doit retourner null si la tâche n'existe pas", async () => {
  todoRepository.getTodoById.mockResolvedValue(null);

  const result = await todoService.getTodoById(
    "507f1f77bcf86cd799439099"
  );

  expect(result).toBeNull();
});