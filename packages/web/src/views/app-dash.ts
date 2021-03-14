import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import { customElement, html, internalProperty, LitElement } from 'lit-element';
import '../components/app-todo';
import { until } from 'lit-html/directives/until';
import { auth, db } from '../services/firebase';
import type { Todo } from '../components/app-todo';
import { getCurrentUser } from '../services/firebase/methods';
import { Router } from '@vaadin/router';
import '../components/app-todo-dialog';
import '../components/app-snackbar';

interface TodoDoc {
  title: string;
  content?: string;
  last_edited: string;
}

@customElement('app-dash')
export class AppDash extends LitElement {
  @internalProperty({
    hasChanged: (n, o) => JSON.stringify(n) === JSON.stringify(o),
  })
  todos: Todo[] = [];
  constructor() {
    super();
  }
  renderTodos(todos: Todo[]) {
    return html`
      ${todos.map((todo) => html` <app-todo .data=${todo}></app-todo> `)}
    `;
  }

  async getTodos(): Promise<Todo[]> {
    const user = auth.currentUser;
    const todos: Todo[] = [];
    if (!user) return todos;
    const q = await getDocs<TodoDoc>(collection(db, `users/${user.uid}/todos`));
    q.docs.map((d) => {
      todos.push({ ...d.data(), id: d.id });
    });
    //Listen to changes
    onSnapshot(q.query, { includeMetadataChanges: true }, (snap) => {
      const todos: Todo[] = [];
      snap.forEach((d) => {
        todos.push({ ...d.data(), id: d.id });
      });
      if (JSON.stringify(todos) !== JSON.stringify(this.todos)) {
        this.todos = todos;
        this.requestUpdate();
      }
    });
    return todos;
  }

  render() {
    return html`
      ${until(
        getCurrentUser().then((user) =>
          user
            ? this.getTodos()
                .then((todos) => this.renderTodos(todos ?? this.todos))
                .catch(() => html`<h1>Couldn't load todos :(</h1>`)
            : Router.go('/signin') &&
              html`<p>Redirecting to sign in page...</p>`,
        ),
        html`<p>Loading todos...</p>`,
      )}
      <app-todo-dialog></app-todo-dialog>
      <app-snackbar></app-snackbar>
    `;
  }
}
