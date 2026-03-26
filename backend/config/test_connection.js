import db from "./PostgreSQLDatabase.js";

const testConnection = async () => {
  try {
    await db.connect();

    const rows = await db.query("SELECT current_database() AS db, NOW() AS hora");
    console.log(`✓ Base de datos activa: ${rows[0].db}`);
    console.log(`✓ Hora del servidor:    ${rows[0].hora}`);

    await db.disconnect();
  } catch (error) {
    console.error("✗ Error de conexión:", error.message);
    process.exit(1);
  }
};

testConnection();
