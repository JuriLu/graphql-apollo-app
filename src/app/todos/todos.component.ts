import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ADD_TODO, DELETE_TODO, GET_TODOS} from "../graphql/graphql.queries";
import {Apollo} from "apollo-angular";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgForOf
  ],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.css'
})
export class TodosComponent implements OnInit{
  todos: any[] = [];
  error: any;

  todoForm = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required)
  });

  constructor(private apollo: Apollo) {
  }

  ngOnInit(): void {
    this.apollo.watchQuery({
      query: GET_TODOS
    }).valueChanges.subscribe((response: any) => {
      // console.log(data);
      this.todos = response.data.todos;
        this.error = response.error;
      }
    );
  }

  addTodo() {
    // apollo graphql query to add todo
    this.apollo.mutate({
      mutation: ADD_TODO,
      variables: {
        name: this.todoForm.value.name,
        description: this.todoForm.value.description,
      },
      refetchQueries: [{
        query: GET_TODOS
      }]
    }).subscribe((response: any) => {
        this.todos = response.data.addTodo;
        this.todoForm.reset();
      }
      , (error: any) => {
        this.error = error;
      }
    );

  }

  deleteTodo(id: string) {
    // apollo graphql query to delete todo
    this.apollo.mutate({
      mutation: DELETE_TODO,
      variables: {
        id: id,
      },
      refetchQueries: [{
        query: GET_TODOS
      }]
    }).subscribe((response: any) => {
        console.log(response);
        this.todos = response.data.deleteTodo;
      }
      , (error: any) => {
        this.error = error;
      }
    );
  }
}
