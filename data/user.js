export async function migrateDbIfNeeded(db) {
    const DATABASE_VERSION = 1;

    let {user_version: currentDbVersion} = await db.getFirstAsync('PRAGMA user_version');
    if (currentDbVersion >= DATABASE_VERSION) {
        // Database is more up-to-date then application, no good way to handle this
        return;
    }

//    migrations.forEach(function (migrate, i) {
//        if (currentDbVersion === i) {
//            migrate(db);
//        }
//        currentDbVersion++; // update so additional migrations occur
//    })

    await db.execAsync(`
            PRAGMA journal_mode = 'wal';
            DROP TABLE IF EXISTS childInfo;
            CREATE TABLE IF NOT EXISTS childInfo (name TEXT PRIMARY KEY NOT NULL, image BLOB, bday INTEGER, bio TEXT);
        `);

    // Update DB version
    await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}

const migrations = [
    async function (db) {
        // Initial creation of database
        // TODO goals achievements supports stressors
        // TODO remove drop lines when not doing development
        await db.execAsync(`
            PRAGMA journal_mode = 'wal';
            DROP TABLE IF EXISTS childInfo
            CREATE TABLE IF NOT EXISTS childInfo (name TEXT PRIMARY KEY NOT NULL, image BLOB, bday INTEGER, bio TEXT)
        `);
        //        CREATE TABLE todos (id INTEGER PRIMARY KEY NOT NULL, value TEXT NOT NULL, intValue INTEGER);
        //        await db.runAsync('INSERT INTO todos (value, intValue) VALUES (?, ?)', 'hello', 1);
        //        await db.runAsync('INSERT INTO todos (value, intValue) VALUES (?, ?)', 'world', 2);
    },
    // Additional migrations can be added here
]