import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";

describe('AuthController', () => {
    let app: INestApplication;
    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
          imports: [AuthController]
        }).compile();
    
        app = moduleFixture.createNestApplication();
        await app.init();
      });
      it("/auth/customer/login (POST)", () => {
        return request(app.getHttpServer())
          .get("/customer/login")
          .expect(200)
          
      });
    

});