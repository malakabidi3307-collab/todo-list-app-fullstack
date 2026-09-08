const todoService = require("../../services/todoService");
const todoRepository = require("../../repositories/todoRepository");
jest.mock("../../repositories/todoRepository");
beforeEach(() => {
  jest.clearAllMocks();
});
test("doit supprimer une tâche existante", async () => {
  const deletedTodo = {
    id: 1,
    title: "Apprendre React",
    completed: false
  };
  todoRepository.deleteTodo.mockResolvedValue(deletedTodo);
  const result = await todoService.deleteTodo(1);
  expect(result).toEqual(deletedTodo);
});
test("doit retourner null si la tâche n'existe pas", async () => {
  todoRepository.deleteTodo.mockResolvedValue(null);
  const result = await todoService.deleteTodo(99);
  expect(result).toBeNull();
});