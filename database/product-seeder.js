import { faker } from "@faker-js/faker/locale/id_ID";
import { config } from "dotenv";
import prisma  from "../app/prisma.js";


config();

async function main() {
    await prisma.product.deleteMany();

    for (let i = 0; i < 5; i++) {
        await prisma.product.create({
            data: {
                name: faker.commerce.productName(),
                description: faker.commerce.productDescription(),
                price: parseFloat(faker.commerce.price()),
                in_stock: faker.datatype.boolean(),
                category_id: 1,
            },
        });
    }
}

main()
    .catch((e) => {
        throw e;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });