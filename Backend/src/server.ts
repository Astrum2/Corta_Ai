import app from "./app";
import sequelize from "./config/database";
import dotenv from "dotenv";
dotenv.config();

const port = 3001;

async function bootstrap() {
  for (let attempt = 1; attempt <= 10; attempt += 1) {
    try {
      await sequelize.authenticate();
      await sequelize.sync({ alter: false });

      app.listen(port, () => {
        console.log(`Servidor rodando na porta ${port}`);
      });
      return;
    } catch (error) {
      if (attempt === 10) {
        throw error;
      }

      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }
}

bootstrap().catch((error) => {
  console.error("Falha ao iniciar o servidor:", error);
  process.exit(1);
});