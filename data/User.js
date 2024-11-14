// Management for the user.db database
const migrations = [
    // Initial creation of database
    (db) => {
        // TODO the selected image for the child isn't stored in the database for several unknown reasons
        //      for consistantcy this should be fixed.
        db.execAsync(`
            PRAGMA journal_mode = 'wal';
            CREATE TABLE IF NOT EXISTS children (
                name TEXT PRIMARY KEY NOT NULL,
                bday TEXT,
                bio TEXT
            );
            CREATE TABLE IF NOT EXISTS contacts (
                name TEXT PRIMARY KEY NOT NULL,
                phone TEXT,
                level INTEGER
            );
            CREATE TABLE IF NOT EXISTS achievements (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                text TEXT,
                date INTEGER
            );
            CREATE TABLE IF NOT EXISTS stressors (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                text TEXT,
                date INTEGER
            );
            CREATE TABLE IF NOT EXISTS supports (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                text TEXT,
                date INTEGER
            );
            CREATE TABLE IF NOT EXISTS goals (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                text TEXT,
                date INTEGER,
                met INTEGER
            );
        `)
    },
    // Additional migrations should be added here
]

/**
 * Will run all database migrations from the "migrations" array
 */
export async function migrateDbIfNeeded(db) {
    // What verions of the db schema do we want
    const DATABASE_VERSION = 1;

    let {user_version: currentDbVersion} = await db.getFirstAsync('PRAGMA user_version');
    if (currentDbVersion >= DATABASE_VERSION) {
        console.log("Database is up-to-date")
        return;
    }

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

// TODO sync operations

/**
 * Either insert new item or update existing data
 * @todo this method currently does no sanatization, it's probably fine since it's local but it should. This function should also be moved to the child-info screen
 * @param db
 * @param {string} oldName Value to use for primary key when searching for existing data
 * @param {string} name Value for "name" field
 * @param {string} bday Value for "birthday" field
 * @param {string} bio Value for "bio" field
 */
export async function addUpdateChildInfo(db, oldName, name, bday, bio) {
    if (name === null || name === "") {
        return null
    }
    const result = await db.getFirstAsync("SELECT * FROM childInfo WHERE name = ?;", oldName)

    if (result === null) {
        return db.runAsync('INSERT INTO childInfo (name, bday, bio) VALUES (?, ?, ?);', name, bday, bio)
    } else {
        // Updating the primary key like this is probably a bad idea but until support for multiple children is
        // added it shouldn't cause any harm.
        return db.runAsync("UPDATE childInfo SET name = ?, bday = ?, bio = ? WHERE name = ?;", name, bday, bio, oldName)
    }
}
