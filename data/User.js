const migrations = [
    (db) => {
        // Initial creation of database
        // TODO goals achievements supports stressors
        // TODO the selected image for the child isn't stored in the database for several unknown reasons
        //      for consistantcy this should be fixed.
        db.execAsync(`
            PRAGMA journal_mode = 'wal';
            CREATE TABLE IF NOT EXISTS childInfo (
                name TEXT PRIMARY KEY NOT NULL,
                bday TEXT,
                bio TEXT
            );
        `)
    },
    // Additional migrations should be added here
]

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

    migrations.forEach((migrate, i) => {
        console.log(`Migrating DB ${i + 1}/${migrations.length}...`)
        if (currentDbVersion === i) {
            migrate(db)
        }
        currentDbVersion++; // update so additional migrations occur
    })

    // Update DB version
    await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);

}

/**
 * Override local database with cloud database
 */
export async function syncLocalDB() {

}

/**
 * Override cloud database with local database
 */
export async function syncCloudDB() {

}

/**
 * Either insert new item or update existing data
 * TODO this method currently does no sanatization, it's probably fine since it's local but it should.
 * @param {string} name Value for "name" field
 * @param {string} bday Value for "birthday" field
 * @param {string} bio Value for "bio" field
 * @param {string} image TODO
 */
export async function updateChildInfo(db, oldName, name, bday, bio) {
    if (name === null || name === "") {
        return null
    }
    const result = await db.getFirstAsync("SELECT * FROM childInfo WHERE name = ?;", oldName)

    if (result === null) {
        return db.runAsync('INSERT INTO childInfo (name, bday, bio) VALUES (?, ?, ?);', name, bday, bio)
    } else {
        return db.runAsync("UPDATE childInfo SET name = ?, bday = ?, bio = ? WHERE name = ?;", name, bday, bio, oldName)
    }
}