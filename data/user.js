export async function migrateDbIfNeeded(db) {
    // What verions of the db schema do we want
    const DATABASE_VERSION = 1;

    let currentDbVersion = 0
//    let {user_version: currentDbVersion} = await db.getFirstAsync('PRAGMA user_version');
//    if (currentDbVersion >= DATABASE_VERSION) {
//        // Database is more up-to-date then application, no good way to handle this
//        return;
//    }

    migrations.forEach(function (migrate, i) {
        console.log(`Migrating DB ${i + 1}/${migrations.length}...`)
        if (currentDbVersion === i) {
            migrate(db)
        }
        currentDbVersion++; // update so additional migrations occur
    })

    // Update DB version
    await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`
    );
}

const migrations = [
    function (db) {
        // Initial creation of database
        // TODO goals achievements supports stressors
        // TODO remove drop lines when not doing development
        db.execAsync(`
            PRAGMA journal_mode = 'wal';
            DROP TABLE IF EXISTS childInfo;
            CREATE TABLE IF NOT EXISTS childInfo (
                name TEXT PRIMARY KEY NOT NULL,
                image BLOB,
                bday INTEGER,
                bio TEXT
            );
        `)
        db.runAsync('INSERT INTO childInfo (name, bday, bio) VALUES (?, ?, ?)', 'Test Name', 'May/22/2004', "This is an example bio")
        //        await db.runAsync('INSERT INTO todos (value, intValue) VALUES (?, ?)', 'hello', 1);
        //        await db.runAsync('INSERT INTO todos (value, intValue) VALUES (?, ?)', 'world', 2);
    },
    // Additional migrations should be added here
]

function addChild() {
    
}