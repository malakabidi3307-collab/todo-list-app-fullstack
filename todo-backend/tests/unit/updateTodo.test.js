const todoService = require("../../services/todoService");
const todoRepository = require("../../repositories/todoRepository");

jest.mock("../../repositories/todoRepository");

beforeEach(() => {
  jest.clearAllMocks();
});

test("doit modifier une tâche existante", async () => {
  const existingTodo = {
    id: 1,
    title: "Ancien titre",
    completed: false
  };

  const updatedTodo = {
    id: 1,
    title: "Nouveau titre",
    completed: true
  };

  todoRepository.getTodoById.mockResolvedValue(existingTodo);

  todoRepository.updateTodo.mockResolvedValue(updatedTodo);

  const result = await todoService.updateTodo(
    1,
    "Nouveau titre",
    true
  );

  expect(result).toEqual(updatedTodo);

  expect(todoRepository.updateTodo).toHaveBeenCalledWith(
    1,
    updatedTodo
  );
});

test("doit retourner null si la tâche n'existe pas", async () => {
  todoRepository.getTodoById.mockResolvedValue(undefined);

  const result = await todoService.updateTodo(
    99,
    "Nouveau titre",
    true
  );

  expect(result).toBeNull();

  expect(todoRepository.updateTodo).not.toHaveBeenCalled();
});