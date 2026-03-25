"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const src_1 = require("../../src");
const database_1 = require("../../src/database");
beforeAll(async () => {
    console.log('Running bofore all');
    console.log = () => { };
    await (0, database_1.initDb)(); //
});
describe('User API', () => {
    let userId;
    const newUser = {
        "name": "Una",
        "phoneNumber": "0871234567",
        "email": "john.doe@mymail.ie",
        "dob": "2001/01/12",
        "silly": "this is not just silly but dangerous"
    };
    test('should create a user and return Location header', async () => {
        const res = await (0, supertest_1.default)(src_1.app)
            .post('/api/v1/users')
            .send(newUser)
            .expect(201);
        userId = res.header['location'];
        expect(userId).toBeDefined();
    });
});
