const todoService = require("../../services/todoService");
const todoRepository = require("../../repositories/todoRepository");

jest.mock("../../repositories/todoRepository");

beforeEach(() => {
  jest.clearAllMocks();
});

test("doit retourner une tâche existante", async () => {
  const todo = {
    id: 1,
    title: "Apprendre React",
    completed: false
  };

  todoRepository.getTodoById.mockResolvedValue(todo);

  const result = await todoService.getTodoById(1);

  expect(result).toEqual(todo);
});

test("doit retourner undefined si la tâche n'existe pas", async () => {
  todoRepository.getTodoById.mockResolvedValue(undefined);

  const result = await todoService.getTodoById(99);

  expect(result).toBeUndefined();
});