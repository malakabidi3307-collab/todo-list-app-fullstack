const todoService = require("../../services/todoService");
const todoRepository = require("../../repositories/todoRepository");

jest.mock("../../repositories/todoRepository");

beforeEach(() => {
  jest.clearAllMocks();
});

test("doit supprimer une tâche existante", async () => {
  const deletedTodo = {
    id: "507f1f77bcf86cd799439011",
    title: "Apprendre React",
    completed: false,
  };

  todoRepository.deleteTodo.mockResolvedValue(deletedTodo);

  const result = await todoService.deleteTodo(
    "507f1f77bcf86cd799439011"
  );

  expect(result).toEqual(deletedTodo);
});

test("doit retourner null si la tâche n'existe pas", async () => {
  todoRepository.deleteTodo.mockResolvedValue(null);

  const result = await todoService.deleteTodo(
    "507f1f77bcf86cd799439099"
  );

  expect(result).toBeNull();
});