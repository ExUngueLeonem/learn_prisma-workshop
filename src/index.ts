import { ApolloServer } from "apollo-server";
import { DateTimeResolver } from "graphql-scalars";
import { Context, context } from "./context";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";

const typeDefs = `
type Query {
  allUsers: [User!]!
  postById(id: Int!): Post
  feed(searchString: String, skip: Int, take: Int): [Post!]!
  draftsByUser(id: Int!): [Post]
}

type Mutation {
  signupUser(name: String, email: String!): User!
  createDraft(title: String!, content: String, authorEmail: String): Post
  incrementPostViewCount(id: Int!): Post
  deletePost(id: Int!): Post
}

type User {
  id: Int!
  email: String!
  name: String
  posts: [Post!]!
}

type Post {
  id: Int!
  createdAt: DateTime!
  updatedAt: DateTime!
  title: String!
  content: String
  published: Boolean!
  viewCount: Int!
  author: User
}

scalar DateTime
`;

const resolvers = {
  Query: {
    //Возращает всех пользователей.
    allUsers: (_parent, _args, context: Context) => {
      const {prisma} = context;
      return prisma.user.findMany()
    },
    //Возвращает публикацию по ее ID.
    postById: (_parent, args: { id: number }, context: Context) => {
      const {prisma} = context
      const {id} = args
      return prisma.post.findUnique({where: {id}})
    },
    //Возвращает все публикации с опциональной пагинацией и фильтрацией.
    //Публикация проходит фильтр, если строка поиска содержится в заголовке или теле публикации.
    feed: (
      _parent,
      args: {
        searchString: string | undefined;
        skip: number | undefined;
        take: number | undefined;
      },
      context: Context
    ) => {
      const {prisma} = context
      const {searchString, take, skip} = args
      return prisma.post.findMany({
        where: {
          OR: [
            {title: {contains: searchString}},
            {content: {contains: searchString}}
          ]
        },
        take,
        skip,
      })
    },
    //Возвращает все необупликованные посты пользователя.
    draftsByUser: (_parent, args: { id: number }, context: Context) => {
      const {prisma} = context
      const {id} = args
      return prisma.user.findUnique({where: {id}}).posts({where: {published: false}})
    },
  },
  Mutation: {
    //Создает нового пользователя.
    signupUser: (
      _parent,
      args: { name: string | undefined; email: string },
      context: Context
    ) => {
      const {prisma} = context
      const {name, email} = args;
      return prisma.user.create({
        data: {
          name,
          email
        }
      })
    },
    //Создает новый пост.
    createDraft: (
      _parent,
      args: { title: string; content: string | undefined; authorEmail: string },
      context: Context
    ) => {
      const {prisma} = context
      const {title, content, authorEmail} = args
      return prisma.post.create({
        data: {
          title,
          content,
          author: {
            connect: {
              email: authorEmail
            }
          },
        }
      })
    },
    //Увеличивает счетчик просмотров на 1.
    incrementPostViewCount: (
      _parent,
      args: { id: number },
      context: Context
    ) => {
      const {prisma} = context
      const {id} = args
      return prisma.post.update({
        where: {
          id
        },
        data: {
          viewCount: {
            increment: 1
          }
        }
      })
    },
    //Удаляет пост.
    deletePost: (_parent, args: { id: number }, context: Context) => {
      const {prisma} = context
      const {id} = args
      return prisma.post.delete({
        where: {
          id
        }
      })
    },
  },
  Post: {
    author: (parent, _args, context: Context) => {
      const {prisma} = context
      return prisma.post.findUnique({where: {id: parent.id}}).author();
    },
  },
  User: {
    posts: (parent, _args, context: Context) => {
      const {prisma} = context
      return prisma.user.findUnique({
        where: {id: parent.id}
      }).posts()
    },
  },
  DateTime: DateTimeResolver,
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
});
server.listen({port: 4000}, () =>
  console.log(`🚀 Server ready at: http://localhost:4000`)
);