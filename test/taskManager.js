class TaskManager {
  constructor() {
    this.tasks = [];
    this.goals = [];
  }

  validateDate(date) {
    return /^\d{4}-\d{2}-\d{2}$/.test(date);
  }

  validateTime(time) {
    return /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);
  }

  validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  deleteItem(id) {
    const taskIndex = this.tasks.findIndex((task) => task.id === id);
    const goalIndex = this.goals.findIndex((goal) => goal.id === id);
  
    if (taskIndex > -1) {
      const [deletedTask] = this.tasks.splice(taskIndex, 1);
      return { type: 'task', deleted: deletedTask };
    }
  
    if (goalIndex > -1) {
      const [deletedGoal] = this.goals.splice(goalIndex, 1);
      return { type: 'goal', deleted: deletedGoal };
    }
  
    throw new Error(`Task or Goal with ID ${id} not found`);
  }
  
  createTask(title, description = '', dueDate, dueTime, location, email, subtasks = []) {
    if (!title) {
      throw new Error('Title is required');
    }
    if (dueDate && !this.validateDate(dueDate)) {
      throw new Error('Invalid dueDate format');
    }
    if (dueTime && !this.validateTime(dueTime)) {
      throw new Error('Invalid dueTime format');
    }
    if (email && !this.validateEmail(email)) {
      throw new Error('Invalid email address');
    }

    const isGoal = subtasks && subtasks.length > 0;

    const item = {
      id: isGoal ? this.goals.length + 1 : this.tasks.length + 1,
      title,
      description,
      dueDate: dueDate || undefined,
      dueTime: dueTime || undefined,
      location: location || undefined,
      email: email || undefined,
      completed: false,
    };

    if (isGoal) {
      item.subtasks = subtasks.map((subtask, index) => ({
        id: index + 1,
        name: subtask.name,
        completed: !!subtask.completed,
      }));
      this.goals.push(item);
    } else {
      this.tasks.push(item);
    }

    return item;
  }
  
  editTask(id, updates) {
    let item = this.tasks.find((task) => task.id === id) || this.goals.find((goal) => goal.id === id);
  
    if (!item) {
      throw new Error(`Task or Goal with ID ${id} not found`);
    }
  
    const { title, description, dueDate, dueTime, location, email, subtasks } = updates;

    if ('title' in updates && (title === undefined || title === null || title === '')) {
      throw new Error('Title is required');
    }
    // Validate fields first before making updates
    if (dueDate && !this.validateDate(dueDate)) {
      throw new Error('Invalid dueDate format');
    }
    if (dueTime && !this.validateTime(dueTime)) {
      throw new Error('Invalid dueTime format');
    }
    if (email && !this.validateEmail(email)) {
      throw new Error('Invalid email address');
    }
   
  
     // Update fields
  if (title !== undefined) item.title = title;
  if (description !== undefined) item.description = description;
  if (dueDate !== undefined) item.dueDate = dueDate;
  if (dueTime !== undefined) item.dueTime = dueTime;
  if (location !== undefined) item.location = location;
  if (email !== undefined) item.email = email;

  // Update subtasks if provided (only for goals)
  if (subtasks && Array.isArray(subtasks) && item.subtasks) {
    item.subtasks = subtasks.map((subtask, index) => ({
      id: index + 1,
      name: subtask.name,
      completed: !!subtask.completed,
    }));
  }
  
    return item;
  }
  
  getTasks() {
    return this.tasks;
  }

  getGoals() {
    return this.goals;
  }
}

module.exports = TaskManager;
