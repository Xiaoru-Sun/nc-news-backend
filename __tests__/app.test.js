const app = require("../app")
const seed = require("../db/seeds/seed.js")
const testData = require("../db/data/test-data/index.js")
const db = require("../db/connection.js")
const request = require("supertest")

afterAll(() => {
    return db.end()
})
beforeAll(() => {
    return seed(testData)
})

describe("/api/topics", () => {
//requesting all topics, happy path
    test("Respond with an array of topic objects, each of which should slug and description property", () => {
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({body})=> {
            const allTopics = body.topics;
            expect(allTopics.length).toBe(3);
            allTopics.forEach(topic => {
                expect(typeof topic.slug).toBe("string");
                expect(typeof topic.description).toBe("string");
            })
        })
    })
//requesting all topics sending invalid route
    test("Respond with 404 error", () => {
        return request(app)
        .get("/api/cats")
        .expect(404)
        .then(({body})=> {
            const {msg} = body
            expect(msg).toBe("Not found")
        })
    })
})

describe("getApi", () => {
    test("Respond with an object describing all the available endpoints on your API, and each key has description, queries, exampleResponse keys", () => {
        return request(app)
        .get("/api")
        .expect(200)
        .then(({body}) => {
            const {endpoints} = body;
            Object.keys(endpoints).forEach( (key) => {
                expect(typeof endpoints[key]["description"]).toBe("string");
                expect(Array.isArray(endpoints[key]["queries"])).toBe(true);
                expect(endpoints[key]["exampleResponse"]).not.toBe("null");
                expect(endpoints[key]["exampleResponse"].constructor === Object).toBe(true)
            })
        })
    })
})
