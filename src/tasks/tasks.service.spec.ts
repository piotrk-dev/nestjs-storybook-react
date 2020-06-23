import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TaskRepository } from './task.repository';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';

const mockUser = { id: 12, username: 'Test user' };

const mockTaskRepository = () => ({
  getTasks: jest.fn(),
  getTaskById: jest.fn(),
  createTask: jest.fn(),
  deleteTask: jest.fn(),
  updateTaskStatus: jest.fn(),
});

describe('TasksService', () => {
  let tasksService;
  let taskRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TaskRepository, useFactory: mockTaskRepository },
      ],
    }).compile();

    tasksService = await module.get<TasksService>(TasksService);
    taskRepository = await module.get<TaskRepository>(TaskRepository);
  });

  describe('getTasks', () => {
    it('gets all tasks from repository', async () => {
      taskRepository.getTasks.mockResolvedValue('some value');
      const filters: GetTasksFilterDto = {
        status: TaskStatus.IN_PROGRESS,
        search: 'Some search query',
      };
      expect(taskRepository.getTasks).not.toHaveBeenCalled();
      const result = await tasksService.getTasks(filters, mockUser);
      expect(taskRepository.getTasks).toHaveBeenCalled();
      expect(result).toEqual('some value');
    });
  });

  describe('getTaskById', () => {
    it('calls taskRepository.findOne() and succesffuly retrieve and return the task', async () => {
      const mockTask = { title: 'Test task', description: 'Test desc' };
      taskRepository.getTaskById.mockResolvedValue(mockTask);

      const result = await tasksService.getTaskById(1, mockUser);
      expect(result).toEqual(mockTask);

      expect(taskRepository.getTaskById).toHaveBeenCalledWith(1, mockUser);
    });
  });

  describe('createTask', () => {
    it('calls taskRepository.create() and returns a task', async () => {
      const mockTask = { title: 'Test task', description: 'Test desc' };
      taskRepository.createTask.mockResolvedValue(mockTask);
      const result = await tasksService.createTask(mockTask, mockUser);
      expect(taskRepository.createTask).toHaveBeenCalled();
      expect(result).toEqual(mockTask);
    });
  });

  describe('deleteTask', () => {
    it('calls taskRepository.deleteTask() to delete a task', async () => {
      taskRepository.deleteTask.mockResolvedValue({ affected: 1 });
      expect(taskRepository.deleteTask).not.toHaveBeenCalled();
      await tasksService.deleteTask(1, mockUser);
      expect(taskRepository.deleteTask).toHaveBeenCalledWith(1, mockUser);
    });
  });

  describe('updateTaskStatus', () => {
    it('updates a task status', async () => {
      const mockTask = { id: 1, title: 'Test task', description: 'Test desc' };
      taskRepository.updateTaskStatus.mockResolvedValue(mockTask);
      expect(taskRepository.updateTaskStatus).not.toHaveBeenCalled();
      await tasksService.updateTaskStatus(
        mockTask.id,
        TaskStatus.OPEN,
        mockUser,
      );
      expect(taskRepository.updateTaskStatus).toHaveBeenCalledWith(
        mockTask.id,
        TaskStatus.OPEN,
        mockUser,
      );
    });
  });
});
