import { getPayload } from "payload";
import config from "../payload.config.js";

async function createAdmin() {
  const payload = await getPayload({ config });

  await payload.create({
    collection: "users",
    data: {
      email: "admin@drpediatre.ma",
      password: "changeme123",
      name: "Admin",
    } as any,
  });

  console.log("✅ Admin user created");
  process.exit(0);
}

createAdmin().catch((err) => {
  console.error("❌ Failed:", err);
  process.exit(1);
});
