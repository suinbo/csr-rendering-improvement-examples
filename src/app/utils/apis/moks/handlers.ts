import { HttpResponse, http } from "msw"
import { users } from "./dummy"

export const handlers = [
    http.get("/users", async ({ request }) => {
        const { searchParams } = new URL(request.url)
        const pageNo = Number(searchParams.get("pageNo"))
        const limit = Number(searchParams.get("limit"))

        return HttpResponse.json({
            contents: users.slice(pageNo * limit, (pageNo + 1) * limit),
            totalCount: users.length,
        })
    }),
]
