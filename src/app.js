import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

// middleware config
app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true
}))
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())



// import routes
import userRouter from "./routes/user.routes.js"
import ProjectRouter from "./routes/project.routes.js"
import userStoryRouter from "./routes/userStory.routes.js"
import taskRouter from "./routes/task.routes.js"

// routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/projects", ProjectRouter)
app.use("/api/v1/userstories", userStoryRouter)
app.use("/api/v1/tasks", taskRouter)



export {app}