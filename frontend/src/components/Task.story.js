import React from 'react';
import { Button } from '@storybook/react/demo';
import Task from './Task';
import { Provider } from 'mobx-react';
import TasksService from '../services/tasks.service';
import TasksStore from '../stores/tasks.store';
import { RouterStore } from 'mobx-react-router';

// export default { title: 'Button' };

// export const withText = () => <Button>Hello Button</Button>;

// export const withEmoji = () => (
//   <Button>
//     <span role="img" aria-label="so cool">
//       😀 😎 👍 💯
//     </span>
//   </Button>
// );

export default { title: 'Task Card' };

export const card = () => {
  const routerStore = new RouterStore();
  const tasksService = new TasksService(routerStore);
  const tasksStore = new TasksStore(tasksService);
  return (
    <Provider tasksStore={tasksStore}>
      <Task
        title="This is a card changed"
        description="some fancy description"
        status="OPEN"
      />
    </Provider>
  );
};
