// test/adoption.test.js
import { expect } from "chai";
import supertest from "supertest";

const requester = supertest("http://localhost:8080");

describe("Test", function () {
  describe("Adopciones", function () {
   
    const EXISTING_USER_ID = "68f401a436a117ee0637bcf5"; 
    const EXISTING_PET_ID = "68f3ffab36a117ee0637bcf2";  

    let adoptionId;

    
    it("POST /api/adoptions/:uid/:pid debe crear una adopción", async function () {
      const response = await requester
        .post(`/api/adoptions/${EXISTING_USER_ID}/${EXISTING_PET_ID}`);

      expect(response.status).to.equal(201);
      expect(response.body).to.have.property("status", "success");
      
    });

    
    it("GET /api/adoptions debe devolver todas las adopciones", async function () {
      const response = await requester.get("/api/adoptions");

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property("status", "success");
      expect(response.body).to.have.property("payload");
      expect(response.body.payload).to.be.an("array");
      expect(response.body.payload).to.have.length.greaterThan(0);

      
      adoptionId = response.body.payload[0]._id;
    });

    it("GET /api/adoptions/:aid debe devolver una adopción por ID", async function () {
      expect(adoptionId, "adoptionId no está definido").to.exist;

      const response = await requester.get(`/api/adoptions/${adoptionId}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property("status", "success");
      expect(response.body).to.have.property("payload");
      expect(response.body.payload).to.have.property("_id");
      expect(response.body.payload._id.toString()).to.equal(adoptionId.toString());
    });

    it("GET /api/adoptions/:aid con ID inválido debe devolver 404", async function () {
      const invalidId = "123456789012345678901234"; 

      const response = await requester.get(`/api/adoptions/${invalidId}`);

      expect(response.status).to.equal(404);
      expect(response.body).to.have.property("status", "error");
      expect(response.body).to.have.property("error", "Adoption not found");
    });

    
    it("POST /api/adoptions/:uid/:pid con mascota ya adoptada debe devolver 400", async function () {
      
      await requester.post(`/api/adoptions/${EXISTING_USER_ID}/${EXISTING_PET_ID}`);

    
      const response = await requester
        .post(`/api/adoptions/${EXISTING_USER_ID}/${EXISTING_PET_ID}`);

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property("status", "error");
      expect(response.body).to.have.property("error", "Pet is already adopted");
    });
  });
});