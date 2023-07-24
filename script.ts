import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// A `main` function so that you can use async/await
async function main() {
  // //Task 1 get all Users
  // const result = await prisma.user.findMany();

  // //Task 2 create User
  // const result = await prisma.user.create({
  //   data: {
  //     email: "Sacha@mail.com"
  //   }
  // })

  // //Task 3 update User
  // const result = await prisma.user.update({
  //     where: {      // ... provide filter here
  //       email: "Sacha@mail.com"
  //     },
  //     data: {      // ... provide data here
  //       name: "Sasha"
  //     }
  //   }
  // )

  //Task 4 crate new table "Posts"
  //upd schema && do migrate with terminal command

  // //Task 5 create new Post
  // const result = await prisma.post.create({
  //   data: {
  //     title: "пост, созданный через скрипт",
  //     authorId: 2,
  //     content: "букв ыбук выбуквыб уквы буквы буквы буквыбук выбукв ыбуквы",
  //     published: true,
  //   }
  // })

  // //Task 6 connect post with user
  // // const result = await prisma.post.create({
  // //   data: {
  // //     title: "title"
  // //   }
  // // })
  // const result = await prisma.post.update({
  //   where: {id: 5},
  //   data: {
  //     author: {
  //       connect: {email: "Oleg@gmail.com"}
  //     }
  //   }
  // })

  // //Task 7 get User by unique field
  // const result = await prisma.user.findUnique({
  //   where: {
  //     email: "Pert@mail.com"
  //   },
  // })

  // //Task 8 get a lot of Users by field
  // const result = await prisma.user.findMany({
  //   select: {
  //     id: true,
  //     name: true
  //   }
  // })

  // //Task 9 get nested data
  // const result = await prisma.user.findUnique({
  //   where: {
  //     email: "Pert@mail.com"
  //   },
  //   include: {
  //     posts: true,
  //   }
  // })

  // //Task 10 create user & post
  // const result = await prisma.user.create({
  //   data: {
  //     name: "Alex",
  //     email: "Alex@gmail.com",
  //     posts: {
  //       create: [
  //         {title: "пост_1, созданный вместе с юзером"},
  //         {title: "пост_2, созданный вместе с юзером"}
  //       ]
  //     }
  //   }
  // })

  // //Task 11 pagination
  // const result = await prisma.user.findMany({
  //   skip: 2,
  //   take: 2
  // })


  // console.log(result)
// ... you will write your Prisma Client queries here
}

main()
  .catch(e => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
