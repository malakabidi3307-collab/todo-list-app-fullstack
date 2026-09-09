const todoService = require("../../services/todoService");
const todoRepository = require("../../repositories/todoRepository");

jest.mock("../../repositories/todoRepository");

beforeEach(() => {
  jest.clearAllMocks();
});

test("doit créer une nouvelle tâche", async () => {
  const newTodo = {
    id: "507f1f77bcf86cd799439011",
    title: "Apprendre Jest",
    completed: false,
  };

  todoRepository.createTodo.mockResolvedValue(newTodo);

  const result = await todoService.createTodo("Apprendre Jest");

  expect(result).toEqual(newTodo);

  expect(todoRepository.createTodo).toHaveBeenCalledWith({
    title: "Apprendre Jest",
    completed: false,
  });
});