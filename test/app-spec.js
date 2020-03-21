const request=require("supertest")
const {app}=require('../src/app')

describe("app",()=>{
    it("should get all accounts when request url pattern is'/api/tasks/'",(done)=>{
        request(app).get('/api/tasks/').expect(200).expect(
            [{"id":1,"content":"Restful API homework","createdTime":"2019-05-15T00:00:00Z"},
            {"id":2,"content":"eat","createdTime":"2019-06-15T00:00:00Z"}]
            ).end((err,res)=>{
            if(err) throw err
            done()
        })
    })
})