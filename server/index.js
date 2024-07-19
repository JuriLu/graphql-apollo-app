const express = require("express");
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");
const { GraphQLSchema, GraphQLObjectType, GraphQLList, GraphQLNonNull, GraphQLInt, GraphQLString } = require("graphql");

const Todos = [
  { id: 1, name: 'Read that Book', description: 'Complete reading that book before 10PM'},
  { id: 2, name: 'Complete Assignment', description: 'Complete that assignment before 10PM'},
]

const TodoType = new GraphQLObjectType({
    name: 'Todo',
    description: 'This is a todo',
    fields: () => ({
      id: { type: new GraphQLNonNull(GraphQLInt) },
      name: { type: new GraphQLNonNull(GraphQLString) },
      description: { type: new GraphQLNonNull(GraphQLString) },
    })
  })

  const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
      todos: {
        type: new GraphQLList(TodoType),
        description: 'List of All Todos',
        resolve: () => Todos
      },
      todo:{
        type: TodoType,
        description: 'Single Todo',
        args: {
            id: {
                type: new GraphQLNonNull(GraphQLInt)
            },
        },
        resolve: (root, args) => {
            return Todos.find(todo => todo.id === args.id)
        }
      }
    })
  })




const app = express();

const schema = new GraphQLSchema({
  query: RootQueryType
}) 

app.use(cors());
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true
  })
);
app.listen(4000);

console.log("Running a GraphQL API server at localhost:4000/graphql");


