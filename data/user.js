export async function migrateDbIfNeeded(db) {
    // What verions of the db schema do we want
    const DATABASE_VERSION = 1;

    let currentDbVersion = 0
    // TODO don't always migrate in final build
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
    await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
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
        //        await db.runAsync('INSERT INTO todos (value, intValue) VALUES (?, ?)', 'world', 2);
    },
    // Additional migrations should be added here
]

/**
 * TODO this method currently does no sanatization, it's probably fine since it's local but it should.
 * @param {string} name Value for "name" field
 * @param {number} bday Value for "birthday" field (Unix Timestamp)
 * @param {string} bio Value for "bio" field
 * @param {string} image TODO
 */
async function addChildInfo(db, name, bday, bio, image) {
    return db.execAsync('INSERT INTO childInfo (name, image, bday, bio) VALUES (?, ?, ?, ?)', name, image, bday, bio)
}