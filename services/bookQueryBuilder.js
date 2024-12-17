class BookQueryBuilder{
    constructor(){
        this.query = 'SELECT * FROM book WHERE';
        this.values = [];
    }

    addNewerThanCondtion(isFirstCondition, import_time){
        let cond = isFirstCondition? ' ' : ' AND ';
        cond = cond + `import_time > CONVERT_TZ(?, '+00:00', 'SYSTEM')`
        this.query = this.query + cond;
        this.values.push(import_time);
    }

    addOlderThanCondtion(isFirstCondition, import_time){
        let cond = isFirstCondition? ' ' : ' AND ';
        cond = cond + `import_time < CONVERT_TZ(?, '+00:00', 'SYSTEM')`
        this.query = this.query + cond;
        this.values.push(import_time);
    }

    addIsbnCondition(isFirstCondition, isbn){
        let cond = isFirstCondition? ' ' : ' AND ';
        cond = cond + `isbn LIKE ?`
        this.query = this.query + cond;
        this.values.push(isbn + '%');
    }
    
    addTitleCondition(isFirstCondition, title){
        let cond = isFirstCondition? ' ' : ' AND ';
        cond = cond + `title LIKE ?`
        this.query = this.query + cond;
        this.values.push(title + '%');
    }

    addAuthorCondition(isFirstCondition, author){
        let cond = isFirstCondition? ' ' : ' AND ';
        cond = cond + `author LIKE ?`
        this.query = this.query + cond;
        this.values.push(author + '%');
    }

    addOrderBYandLimit(pageSize){
        this.query = this.query + " ORDER BY import_time DESC Limit ?";
        this.values.push(pageSize);
    }
}

module.exports = {BookQueryBuilder};