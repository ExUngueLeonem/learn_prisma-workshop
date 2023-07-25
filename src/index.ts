import { PrismaClient } from '@prisma/client'
import express from "express";

const prisma = new PrismaClient();
const app = express();
const port = process.env.port
app.use(express.json());

app.get("/", async (req, res) => {
  res.status(200)
  res.send("standby")
})


// Возвращает всех пользователей.
app.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany()
    res.status(200)
    res.json(users)
  } catch (e) {
    res.status(400)
    res.json(e)
  }
})


// Создает нового пользователя.
app.post("/signup", async (req, res) => {
  try {
    const {name, email} = req.body
    const resData = await prisma.user.create({
      data: {
        name,
        email
      }
    })
    res.status(200)
    res.json(resData)
  } catch (error) {
    res.status(400)
    res.json(error)
  }
})


// Создает новую публикацию.
app.post("/post", async (req, res) => {
  const {title, content, authorEmail} = req.body
  try {
    const resData = await prisma.post.create({
      data: {
        title,
        content,
        author: {
          connect: {
            email: authorEmail
          }
        }
      }
    })

    res.status(200)
    res.json(resData)
  } catch (e) {
    res.status(400)
    res.json(e)
  }
})

// Увеличивает количество просмотров на 1
app.put("/post/:id/views", async (req, res) => {
  try {
    const {id} = req.params
    const resData = await prisma.post.update({
      where: {
        id: +id
      },
      data: {
        viewCount: {
          increment: 1
        }
      }
    })
    res.status(200)
    res.json(resData)
  } catch (e) {
    res.status(400)
    res.json(e)
  }
})


// Публикует пост.
app.put("/publish/:id", async (req, res) => {
  try {
    const {id} = req.params
    const resData = await prisma.post.update({
      where: {
        id: +id
      },
      data: {
        published: {
          set: true
        }
      }
    })
    res.status(200)
    res.json(resData)
  } catch (e) {
    res.status(400)
    res.json(e)
  }
})

// Возвращает все неопубликованные посты для пользователя
app.get("/user/:id/drafts", async (req, res) => {
  const {id} = req.params
  try {
    const resData = await prisma.post.findMany({
      where: {
        authorId: +id,
        published: false
      }
    })
    res.status(200)
    res.json(resData)
  } catch (e) {
    res.status(400)
    res.json(e)
  }
})

// Возвращает публикацю по ее ID.
app.get("/post/:id", async (req, res) => {
  const {id} = req.params
  try {
    const resData = await prisma.post.findUnique({
      where: {
        id: +id
      }
    })
    res.status(200)
    res.json(resData)
  } catch (e) {
    res.status(400)
    res.json(e)
  }
})

// Возращает все публикации, опционально с пагинацией и фильтрацией.
// Публикация проходит фильтр, если переданная строка встречается в заголовке или ее теле.
app.get("/feed", async (req, res) => {
  let {searchString, skip, take} = req.query

  try {
    searchString = searchString ? searchString.toString() : ""

    const resData = await prisma.post.findMany({
      where: {
        published: true,
        OR: [
          {title: {contains: searchString}},
          {content: {contains: searchString}}
        ]
      },
      take: Number(take) || undefined,
      skip: Number(skip) || undefined
    })

    res.status(200)
    res.json(resData)
  } catch (e) {
    res.status(400)
    res.json(e)
  }
})

app.listen(port, () => {
  console.log(`🚀 Server ready at: ${port}`)
})

async function main() {
  // ... you will write your Prisma Client queries here
}

main()
  .catch(e => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
