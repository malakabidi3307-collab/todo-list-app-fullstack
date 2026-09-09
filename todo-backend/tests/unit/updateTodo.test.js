const todoService = require("../../services/todoService");
const todoRepository = require("../../repositories/todoRepository");

jest.mock("../../repositories/todoRepository");

beforeEach(() => {
  jest.clearAllMocks();
});

test("doit modifier une tâche existante", async () => {
  const id = "507f1f77bcf86cd799439011";

  const existingTodo = {
    id,
    title: "Ancien titre",
    completed: false,
  };

  const updatedTodo = {
    id,
    title: "Nouveau titre",
    completed: true,
  };

  todoRepository.getTodoById.mockResolvedValue(existingTodo);

  todoRepository.updateTodo.mockResolvedValue(updatedTodo);

  const result = await todoService.updateTodo(
    id,
    "Nouveau titre",
    true
  );

  expect(result).toEqual(updatedTodo);

  expect(todoRepository.updateTodo).toHaveBeenCalledWith(
    id,
    updatedTodo
  );
});

test("doit retourner null si la tâche n'existe pas", async () => {
  const id = "507f1f77bcf86cd799439099";

  todoRepository.getTodoById.mockResolvedValue(null);

  const result = await todoService.updateTodo(
    id,
    "Nouveau titre",
    true
  );

  expect(result).toBeNull();

  expect(todoRepository.updateTodo).not.toHaveBeenCalled();
});