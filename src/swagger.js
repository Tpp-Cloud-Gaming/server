import swaggerAutogen from "swagger-autogen";

const outputFile = "./swagger_output.json";
const endpointsFiles = ["./routes/users.routes.js"];

const swaggerGenerator = swaggerAutogen();

swaggerGenerator(outputFile, endpointsFiles);
