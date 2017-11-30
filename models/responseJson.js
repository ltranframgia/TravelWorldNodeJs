
class Status {
    constructor(){}

    get(success, code, message) {
        return { success: success, code: code, message: message }
    }

}

class Pagination {
    constructor(){}

    get(page, page_size, total, totalPages, last_index) {
        return {page: page, page_size: page_size, total: total, total_pages: totalPages, last_index: last_index}
    }

}

class ResponseJson {

    constructor(){
        this.clear()
    }

    clear(){
        this._status = undefined
        this._data = undefined
        this._pagination = undefined
    }

    status(error, code, message) {
        this._status = {error: error, code: code, message: message}
    }

    data(data) {
        this._data = data
    }

    pagination(page, page_size, total, totalPages) {
      this._pagination = {page: page, page_size: page_size, total: total, totalPages: totalPages}
    }

    render() {
      return {status: this._status, pagination: this._pagination, data: this._data}
    }
}

exports.ResponseJson = new ResponseJson()
exports.status = new Status()
exports.pagination = new Pagination()