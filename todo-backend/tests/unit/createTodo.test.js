const todoService = require("../../services/todoService");
const todoRepository = require("../../repositories/todoRepository");

jest.mock("../../repositories/todoRepository");

beforeEach(() => {
  jest.clearAllMocks();
});

test("doit créer une nouvelle tâche", async () => {
  const todos = [
    {
      id: 1,
      title: "Apprendre React",
      completed: false
    }
  ];

  const newTodo = {
    id: 2,
    title: "Apprendre Jest",
    completed: false
  };

  todoRepository.getTodos.mockResolvedValue(todos);
  todoRepository.createTodo.mockResolvedValue(newTodo);

  const result = await todoService.createTodo("Apprendre Jest");

  expect(result).toEqual(newTodo);

  expect(todoRepository.createTodo).toHaveBeenCalledWith({
    id: 2,
    title: "Apprendre Jest",
    completed: false
  });
});