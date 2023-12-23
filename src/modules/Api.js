class Api {
    constructor() {
        this.favTypes = {
            books: 'books',
            characters: 'characters',
            houses: 'houses',
        };
        // localstorage reference key
        this.databaseKey = 'GoT_DB';
        this.localstorage = localStorage;
        // [{firstName:"", lastName:"", email:"", password: "", favorites: {books:[], characters: [], houses:[]}}]
        this.database = {users: []};
        this.loadDatabase();
    }

    /**
     * Save database object {key = databaseKey, value = database }
     */
    saveDatabase() {
        this.localstorage.setItem(
            this.databaseKey,
            JSON.stringify(this.database)
        );
    }

    /**
     * Load database object and set it to this.database
     */
    loadDatabase() {
        let db = this.localstorage.getItem(this.databaseKey);
        if (db) {
            this.database = JSON.parse(db);
        }
    }

    /**
     *  Returns a boolean to validate if the email exists on the signup form
     */
    userExists(email) {
        let dbUsers = this.database.users;
        let filteredArr = dbUsers.filter(user => email === user.email);
        return filteredArr.length !== 0;
    }

    /**
     *  Save userobj from signup data to the database
     */
    registerUser(formData) {
        let newUser = {...formData}; // Create user from form data
        let dbUsers = this.database.users;
        if (this.userExists(newUser.email)) return {success: false};
        newUser['favorites'] = {books: [], characters: [], houses: []};
        dbUsers.push(newUser);
        this.saveDatabase();
        return {success: true};
    }

    /**
     * Get user from database for login information
     * Returns minimum information required for user authorization
     */
    getUser(email, password) {
        if (!email && !password) {
            return null;
        }
        let dbUsers = this.database.users;
        let filteredArr = dbUsers.filter(
            user => user.email === email && user.password === password
        );

        if (filteredArr.length > 0) {
            let user = filteredArr[0];

            let cUserObj = {};
            cUserObj['firstName'] = user.firstName;
            cUserObj['email'] = user.email;
            cUserObj['password'] = user.password;

            return cUserObj;
        }
        return null;
    }

    /**
     * Add favorites to the DB. id is pulled from external GOT Api and type is: books, characters, houses
     */
    addFavorite(curUser, id, type) {
        //loop over database users and find this user, then update favorites
        this.database.users.forEach(user => {
            if (curUser.email === user.email) {
                user.favorites[type].push(id);
            }
        });
        this.saveDatabase();
    }

    /**
     * Delete favorites from the DB. id is pulled from external GOT Api and type is: books, characters, houses
     */
    deleteFavorite(curUser, id, type) {
        this.database.users.forEach(user => {
            if (curUser.email === user.email) {
                user.favorites[type] = user.favorites[type].filter(
                    uid => uid !== id
                );
            }
        });
        this.saveDatabase();
    }

    /**
     * Check to see if already in favorites from the DB. id is pulled from external GOT Api and type is: books, characters, houses
     */
    isFavorited(curUser, id, type) {
        let favArr = [];
        this.database.users.forEach(user => {
            if (curUser.email === user.email) {
                favArr = user.favorites[type].filter(uid => uid === id);
            }
        });
        return favArr.length > 0;
    }

    /**
     * Get array of favorites from the DB. type is: books, characters, houses
     */
    getFavorites(curUser, type) {
        let favs = [];
        this.database.users.forEach(user => {
            if (curUser.email === user.email) {
                favs = user.favorites[type];
            }
        });
        return favs;
    }
}

export default Api;
